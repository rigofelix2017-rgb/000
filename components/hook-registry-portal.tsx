"use client"

import { useState } from "react"
import { useHookRegistry, type HookType } from "@/lib/hooks/use-hook-registry"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const HOOK_TYPES: { value: HookType; label: string }[] = [
  { value: "defi", label: "DeFi / Trading" },
  { value: "gaming", label: "Gaming" },
  { value: "social", label: "Social" },
  { value: "nft", label: "NFT" },
  { value: "entertainment", label: "Entertainment" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "other", label: "Other" },
]

export function HookRegistryPortal({ onClose }: { onClose?: () => void }) {
  const { address } = useAccount()
  const { hooks, myHooks, loading, registerHook, calculateTaxOwed } = useHookRegistry()

  const [showForm, setShowForm] = useState(false)
  const [hookAddress, setHookAddress] = useState("")
  const [hookName, setHookName] = useState("")
  const [hookType, setHookType] = useState<HookType>("defi")

  async function handleRegister() {
    try {
      if (!address) {
        alert("Please connect your wallet")
        return
      }

      await registerHook(hookAddress, hookName, hookType)

      alert("Hook registered successfully! Submit for DAO approval to get property allocation.")

      setHookAddress("")
      setHookName("")
      setHookType("defi")
      setShowForm(false)
    } catch (err: any) {
      console.error("[v0] Registration error:", err)
      alert("Failed to register: " + err.message)
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "approved":
        return "bg-blue-500"
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-500"
      case "removed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const activeHooks = hooks.filter((h) => h.status === "active")
  const signalsWhitelisted = hooks.filter((h) => h.whitelisted_for_signals)

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">V4 Hook Registry</CardTitle>
              <CardDescription>Register hooks, track volume, and manage property</CardDescription>
            </div>
            {onClose && (
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!address ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Connect your wallet to register V4 hooks</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Hooks</CardDescription>
                    <CardTitle className="text-3xl">{hooks.length}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Active Hooks</CardDescription>
                    <CardTitle className="text-3xl">{activeHooks.length}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Signals Whitelisted</CardDescription>
                    <CardTitle className="text-3xl">{signalsWhitelisted.length}</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div className="mb-6">
                <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto">
                  {showForm ? "Cancel" : "Register New Hook"}
                </Button>
              </div>

              {showForm && (
                <Card className="mb-6 border-2 border-primary">
                  <CardHeader>
                    <CardTitle>Register V4 Hook</CardTitle>
                    <CardDescription>Register your deployed V4 hook to get property allocation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Hook Address *</Label>
                      <Input value={hookAddress} onChange={(e) => setHookAddress(e.target.value)} placeholder="0x..." />
                    </div>

                    <div>
                      <Label>Hook Name *</Label>
                      <Input
                        value={hookName}
                        onChange={(e) => setHookName(e.target.value)}
                        placeholder="My Awesome Hook"
                      />
                    </div>

                    <div>
                      <Label>Hook Type *</Label>
                      <Select value={hookType} onValueChange={(v) => setHookType(v as HookType)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {HOOK_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={handleRegister} disabled={!hookAddress || !hookName} className="w-full">
                      Register Hook
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Tabs defaultValue="my-hooks">
                <TabsList className="w-full">
                  <TabsTrigger value="my-hooks" className="flex-1">
                    My Hooks ({myHooks.length})
                  </TabsTrigger>
                  <TabsTrigger value="all-hooks" className="flex-1">
                    All Hooks ({hooks.length})
                  </TabsTrigger>
                  <TabsTrigger value="signals" className="flex-1">
                    Signals ({signalsWhitelisted.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="my-hooks" className="space-y-4 mt-4">
                  {loading ? (
                    <p className="text-center text-muted-foreground">Loading...</p>
                  ) : myHooks.length === 0 ? (
                    <p className="text-center text-muted-foreground">No hooks registered yet</p>
                  ) : (
                    myHooks.map((hook) => <HookCard key={hook.id} hook={hook} getStatusColor={getStatusColor} />)
                  )}
                </TabsContent>

                <TabsContent value="all-hooks" className="space-y-4 mt-4">
                  {loading ? (
                    <p className="text-center text-muted-foreground">Loading...</p>
                  ) : hooks.length === 0 ? (
                    <p className="text-center text-muted-foreground">No hooks registered yet</p>
                  ) : (
                    hooks.map((hook) => <HookCard key={hook.id} hook={hook} getStatusColor={getStatusColor} />)
                  )}
                </TabsContent>

                <TabsContent value="signals" className="space-y-4 mt-4">
                  {signalsWhitelisted.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                      No hooks have met the $100M volume threshold yet
                    </p>
                  ) : (
                    signalsWhitelisted.map((hook) => (
                      <HookCard key={hook.id} hook={hook} getStatusColor={getStatusColor} highlighted />
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function HookCard({ hook, getStatusColor, highlighted = false }: any) {
  return (
    <Card className={highlighted ? "border-2 border-green-500" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className={getStatusColor(hook.status)}>{hook.status}</Badge>
              <Badge variant="outline">{hook.hook_type}</Badge>
              {hook.whitelisted_for_signals && <Badge className="bg-green-500">Signals Whitelisted</Badge>}
              {hook.district && <Badge variant="secondary">{hook.district}</Badge>}
            </div>
            <CardTitle className="text-lg">{hook.hook_name}</CardTitle>
            <code className="text-xs text-muted-foreground">{hook.hook_address}</code>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Total Volume</p>
            <p className="font-semibold">${(hook.total_volume / 1000000).toFixed(2)}M</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">30d Volume</p>
            <p className="font-semibold">${(hook.last_30d_volume / 1000000).toFixed(2)}M</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Peak Daily</p>
            <p className="font-semibold">${(hook.peak_daily_volume / 1000000).toFixed(2)}M</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Tax Balance</p>
            <p className={`font-semibold ${hook.tax_balance < 0 ? "text-red-500" : "text-green-500"}`}>
              {hook.tax_balance} VOID
            </p>
          </div>
        </div>
        {hook.property_id && (
          <div className="mt-4 text-sm">
            <p className="text-muted-foreground">
              Property: ({hook.coordinates_x?.toFixed(0)}, {hook.coordinates_z?.toFixed(0)})
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
