"use client"

import { useState } from "react"
import { useGovernance, type ProposalType } from "@/lib/hooks/use-governance"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function GovernancePortal({ onClose }: { onClose?: () => void }) {
  const { address } = useAccount()
  const { proposals, loading, createProposal, castVote, checkVotingStatus } = useGovernance()
  const [activeTab, setActiveTab] = useState("active")
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Create proposal form state
  const [proposalType, setProposalType] = useState<ProposalType>("business_approval")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [hookAddress, setHookAddress] = useState("")
  const [targetWallet, setTargetWallet] = useState("")

  const activeProposals = proposals.filter((p) => p.status === "active")
  const completedProposals = proposals.filter((p) => p.status !== "active")

  async function handleCreateProposal() {
    try {
      const metadata: any = {}
      if (hookAddress) metadata.hook_address = hookAddress
      if (targetWallet) metadata.target_wallet = targetWallet

      await createProposal(proposalType, title, description, metadata)

      // Reset form
      setTitle("")
      setDescription("")
      setHookAddress("")
      setTargetWallet("")
      setShowCreateForm(false)
    } catch (err: any) {
      console.error("[v0] Error creating proposal:", err)
      alert("Failed to create proposal: " + err.message)
    }
  }

  async function handleVote(proposalId: string, direction: "for" | "against") {
    try {
      // TODO: Get actual voting power from token balances
      const votingPower = 1000 // Placeholder
      await castVote(proposalId, direction, votingPower)
    } catch (err: any) {
      console.error("[v0] Error casting vote:", err)
      alert("Failed to cast vote: " + err.message)
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "active":
        return "bg-blue-500"
      case "passed":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      case "executed":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  function getTypeLabel(type: ProposalType) {
    switch (type) {
      case "business_approval":
        return "Business Approval"
      case "bad_actor_removal":
        return "Bad Actor Removal"
      case "parameter_change":
        return "Parameter Change"
      case "district_allocation":
        return "District Allocation"
      default:
        return type
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">DAO Governance Portal</CardTitle>
              <CardDescription>Create proposals and vote on ecosystem decisions</CardDescription>
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
              <p className="text-muted-foreground">Connect your wallet to participate in governance</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <Button onClick={() => setShowCreateForm(!showCreateForm)} className="w-full sm:w-auto">
                  {showCreateForm ? "Cancel" : "Create Proposal"}
                </Button>
              </div>

              {showCreateForm && (
                <Card className="mb-6 border-2 border-primary">
                  <CardHeader>
                    <CardTitle>New Proposal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Proposal Type</Label>
                      <Select value={proposalType} onValueChange={(v) => setProposalType(v as ProposalType)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="business_approval">Business Approval</SelectItem>
                          <SelectItem value="bad_actor_removal">Bad Actor Removal</SelectItem>
                          <SelectItem value="parameter_change">Parameter Change</SelectItem>
                          <SelectItem value="district_allocation">District Allocation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Title</Label>
                      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Proposal title" />
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detailed description of the proposal"
                        rows={4}
                      />
                    </div>

                    {(proposalType === "business_approval" || proposalType === "bad_actor_removal") && (
                      <div>
                        <Label>Hook Address (if applicable)</Label>
                        <Input
                          value={hookAddress}
                          onChange={(e) => setHookAddress(e.target.value)}
                          placeholder="0x..."
                        />
                      </div>
                    )}

                    {proposalType === "bad_actor_removal" && (
                      <div>
                        <Label>Target Wallet</Label>
                        <Input
                          value={targetWallet}
                          onChange={(e) => setTargetWallet(e.target.value)}
                          placeholder="0x..."
                        />
                      </div>
                    )}

                    <Button onClick={handleCreateProposal} disabled={!title || !description} className="w-full">
                      Submit Proposal
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="active" className="flex-1">
                    Active ({activeProposals.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="flex-1">
                    Completed ({completedProposals.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4 mt-4">
                  {loading ? (
                    <p className="text-center text-muted-foreground">Loading proposals...</p>
                  ) : activeProposals.length === 0 ? (
                    <p className="text-center text-muted-foreground">No active proposals</p>
                  ) : (
                    activeProposals.map((proposal) => (
                      <ProposalCard
                        key={proposal.id}
                        proposal={proposal}
                        onVote={handleVote}
                        getStatusColor={getStatusColor}
                        getTypeLabel={getTypeLabel}
                      />
                    ))
                  )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4 mt-4">
                  {completedProposals.length === 0 ? (
                    <p className="text-center text-muted-foreground">No completed proposals</p>
                  ) : (
                    completedProposals.map((proposal) => (
                      <ProposalCard
                        key={proposal.id}
                        proposal={proposal}
                        onVote={handleVote}
                        getStatusColor={getStatusColor}
                        getTypeLabel={getTypeLabel}
                        readonly
                      />
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

function ProposalCard({ proposal, onVote, getStatusColor, getTypeLabel, readonly = false }: any) {
  const totalVotes = proposal.votes_for + proposal.votes_against
  const forPercentage = totalVotes > 0 ? (proposal.votes_for / totalVotes) * 100 : 0
  const againstPercentage = totalVotes > 0 ? (proposal.votes_against / totalVotes) * 100 : 0

  const daysRemaining = Math.ceil((new Date(proposal.voting_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(proposal.status)}>{proposal.status}</Badge>
              <Badge variant="outline">{getTypeLabel(proposal.proposal_type)}</Badge>
            </div>
            <CardTitle className="text-lg">{proposal.title}</CardTitle>
            <CardDescription className="mt-1">{proposal.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Voting Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                For: {proposal.votes_for.toLocaleString()} ({forPercentage.toFixed(1)}%)
              </span>
              <span>
                Against: {proposal.votes_against.toLocaleString()} ({againstPercentage.toFixed(1)}%)
              </span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden flex">
              <div className="bg-green-500 transition-all" style={{ width: `${forPercentage}%` }} />
              <div className="bg-red-500 transition-all" style={{ width: `${againstPercentage}%` }} />
            </div>
          </div>

          {/* Metadata */}
          {proposal.hook_address && (
            <div className="text-sm">
              <span className="text-muted-foreground">Hook: </span>
              <code className="text-xs">{proposal.hook_address}</code>
            </div>
          )}
          {proposal.target_wallet && (
            <div className="text-sm">
              <span className="text-muted-foreground">Target: </span>
              <code className="text-xs">{proposal.target_wallet}</code>
            </div>
          )}

          {/* Voting Buttons */}
          {!readonly && proposal.status === "active" && (
            <div className="flex gap-2 pt-2">
              <Button onClick={() => onVote(proposal.id, "for")} className="flex-1" variant="default">
                Vote For
              </Button>
              <Button onClick={() => onVote(proposal.id, "against")} className="flex-1" variant="destructive">
                Vote Against
              </Button>
            </div>
          )}

          {/* Time Remaining */}
          {proposal.status === "active" && (
            <p className="text-xs text-muted-foreground text-center">
              {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Voting ends soon"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
