// Simple Node.js WebSocket server for multiplayer presence
// Run this separately: node server/multiplayer-server.js

const { WebSocketServer } = require("ws")
const crypto = require("crypto")

const PORT = process.env.PORT || 8080

const wss = new WebSocketServer({ port: PORT })
const players = new Map()
const sockets = new Map()

console.log(`Multiplayer server listening on ws://localhost:${PORT}`)

wss.on("connection", (ws) => {
  const id = crypto.randomUUID()
  const now = Date.now()

  const player = {
    id,
    x: 0,
    y: 0,
    z: 0,
    ry: 0,
    lastHeartbeat: now,
    wallet: null,
  }

  players.set(id, player)
  sockets.set(id, ws)

  // Send init message with current player list
  ws.send(
    JSON.stringify({
      type: "init",
      id,
      players: Array.from(players.values()),
    }),
  )

  // Broadcast join to others
  broadcastExcept(id, {
    type: "join",
    player,
  })

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data.toString())

      if (msg.type === "update") {
        const p = players.get(id)
        if (!p) return

        p.x = msg.x
        p.y = msg.y
        p.z = msg.z
        p.ry = msg.ry
        p.lastHeartbeat = Date.now()
        p.wallet = msg.wallet ?? p.wallet

        broadcastExcept(id, {
          type: "update",
          player: p,
        })
      }

      if (msg.type === "heartbeat") {
        const p = players.get(id)
        if (p) p.lastHeartbeat = Date.now()
      }
    } catch (err) {
      console.error("Bad message:", err)
    }
  })

  ws.on("close", () => {
    players.delete(id)
    sockets.delete(id)
    broadcastExcept(id, {
      type: "leave",
      id,
    })
    console.log(`Player ${id} disconnected`)
  })

  console.log(`Player ${id} connected. Total players: ${players.size}`)
})

function broadcastExcept(senderId, payload) {
  const raw = JSON.stringify(payload)
  for (const [id, socket] of sockets.entries()) {
    if (id === senderId) continue
    if (socket.readyState === 1) {
      // WebSocket.OPEN
      socket.send(raw)
    }
  }
}

// Garbage collection for stale connections
setInterval(() => {
  const now = Date.now()
  const timeout = 30000 // 30 seconds

  for (const [id, p] of players.entries()) {
    if (now - p.lastHeartbeat > timeout) {
      console.log(`Removing stale player ${id}`)
      players.delete(id)
      const s = sockets.get(id)
      sockets.delete(id)
      if (s && s.readyState === 1) s.close()
      broadcastExcept(id, { type: "leave", id })
    }
  }
}, 5000)
