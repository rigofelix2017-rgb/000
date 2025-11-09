"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UpdateProposalStatusProps {
  proposalId: string
  currentStatus: string
}

export function UpdateProposalStatus({ proposalId, currentStatus }: UpdateProposalStatusProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleUpdate = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { error: updateError } = await supabase
        .from("governance_proposals")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", proposalId)

      if (updateError) throw updateError

      // Log activity
      await supabase.from("activity_log").insert({
        user_id: user?.id,
        action: "update_proposal_status",
        details: { proposal_id: proposalId, new_status: status },
      })

      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to update status")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="implemented">Implemented</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleUpdate} disabled={isLoading || status === currentStatus} className="w-full">
        {isLoading ? "Updating..." : "Update Status"}
      </Button>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
