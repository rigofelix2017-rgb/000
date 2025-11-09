"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Activity {
  id: string
  user_id: string | null
  action: string
  details: any
  created_at: string
  profiles?: {
    display_name: string | null
    email: string
  }
}

interface ActivityLogTableProps {
  activities: Activity[]
}

export function ActivityLogTable({ activities }: ActivityLogTableProps) {
  const getActionBadgeVariant = (action: string) => {
    if (action.includes("create")) return "default"
    if (action.includes("update")) return "secondary"
    if (action.includes("delete")) return "destructive"
    return "outline"
  }

  const formatActionLabel = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No activity recorded yet
              </TableCell>
            </TableRow>
          ) : (
            activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">{activity.profiles?.display_name || "System"}</TableCell>
                <TableCell>
                  <Badge variant={getActionBadgeVariant(activity.action)}>{formatActionLabel(activity.action)}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {activity.details?.title ||
                    activity.details?.new_role ||
                    activity.details?.new_status ||
                    JSON.stringify(activity.details || {})}
                </TableCell>
                <TableCell className="text-sm">{new Date(activity.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
