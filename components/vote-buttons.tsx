"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VoteButtonsProps {
  proposalId: string
  currentVote?: boolean
  userId: string
}

export function VoteButtons({ proposalId, currentVote, userId }: VoteButtonsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleVote = async (vote: boolean) => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      // Check if user already voted
      if (currentVote !== undefined) {
        // Update existing vote
        const { error: updateError } = await supabase
          .from("proposal_votes")
          .update({ vote })
          .eq("proposal_id", proposalId)
          .eq("user_id", userId)

        if (updateError) throw updateError
      } else {
        // Insert new vote
        const { error: insertError } = await supabase.from("proposal_votes").insert({
          proposal_id: proposalId,
          user_id: userId,
          vote,
        })

        if (insertError) throw insertError
      }

      // Update vote counts
      const { data: votes } = await supabase.from("proposal_votes").select("vote").eq("proposal_id", proposalId)

      const votesFor = votes?.filter((v) => v.vote === true).length || 0
      const votesAgainst = votes?.filter((v) => v.vote === false).length || 0

      await supabase
        .from("governance_proposals")
        .update({
          votes_for: votesFor,
          votes_against: votesAgainst,
        })
        .eq("id", proposalId)

      // Log activity
      await supabase.from("activity_log").insert({
        user_id: userId,
        action: "vote",
        details: { proposal_id: proposalId, vote },
      })

      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to submit vote")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button
          onClick={() => handleVote(true)}
          disabled={isLoading}
          variant={currentVote === true ? "default" : "outline"}
          className="flex-1"
        >
          Vote For
        </Button>
        <Button
          onClick={() => handleVote(false)}
          disabled={isLoading}
          variant={currentVote === false ? "destructive" : "outline"}
          className="flex-1"
        >
          Vote Against
        </Button>
      </div>
      {currentVote !== undefined && (
        <p className="text-sm text-muted-foreground text-center">
          You voted {currentVote ? "for" : "against"} this proposal
        </p>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
