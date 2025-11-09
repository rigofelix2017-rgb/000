"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  display_name: string | null
  role: "founder" | "governance_member" | "user"
  created_at: string
}

interface UserManagementTableProps {
  users: User[]
}

export function UserManagementTable({ users }: UserManagementTableProps) {
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRoleChange = async (userId: string) => {
    const supabase = createClient()
    setIsLoading(true)

    try {
      const { error } = await supabase.from("profiles").update({ role: selectedRole }).eq("id", userId)

      if (error) throw error

      // Log activity
      const {
        data: { user },
      } = await supabase.auth.getUser()
      await supabase.from("activity_log").insert({
        user_id: user?.id,
        action: "update_user_role",
        details: { target_user_id: userId, new_role: selectedRole },
      })

      setEditingUserId(null)
      router.refresh()
    } catch (error) {
      console.error("Failed to update role:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "founder":
        return "default"
      case "governance_member":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.display_name || "Unknown"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {editingUserId === user.id ? (
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="governance_member">Governance Member</SelectItem>
                        <SelectItem value="founder">Founder</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant={getRoleBadgeVariant(user.role)}>{user.role.replace("_", " ")}</Badge>
                  )}
                </TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  {editingUserId === user.id ? (
                    <div className="flex justify-end gap-2">
                      <Button size="sm" onClick={() => handleRoleChange(user.id)} disabled={isLoading}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingUserId(null)} disabled={isLoading}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingUserId(user.id)
                        setSelectedRole(user.role)
                      }}
                    >
                      Edit Role
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
