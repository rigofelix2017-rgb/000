"use client"

import { useState } from "react"
import { useBusinessSubmissions, type BusinessType } from "@/lib/hooks/use-business-submissions"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
  { value: "defi", label: "DeFi / Trading" },
  { value: "gaming", label: "Gaming" },
  { value: "social", label: "Social / Community" },
  { value: "art_culture", label: "Art & Culture" },
  { value: "entertainment", label: "Entertainment" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "other", label: "Other" },
]

const AGENCY_SERVICES = [
  { id: "marketing", label: "Marketing & Growth" },
  { id: "development", label: "Technical Development" },
  { id: "design", label: "UI/UX Design" },
  { id: "tokenomics", label: "Tokenomics Consulting" },
]

const SUBMISSION_FEE = 100 // 100 VOID

export function BusinessSubmissionPortal({ onClose }: { onClose?: () => void }) {
  const { address } = useAccount()
  const { submissions, mySubmissions, loading, submitBusiness, paySubmissionFee } = useBusinessSubmissions()

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    business_name: "",
    business_type: "defi" as BusinessType,
    description: "",
    hook_address: "",
    hook_deployed: false,
    estimated_volume: 0,
    requesting_agency_support: false,
    agency_services: [] as string[],
    budget_range: "under_10k",
    preferred_district: "",
    property_size: "20x20",
    website_url: "",
    twitter_url: "",
    discord_url: "",
    whitepaper_url: "",
    submitter_email: "",
  })

  async function handleSubmit() {
    try {
      if (!address) {
        alert("Please connect your wallet")
        return
      }

      // Submit the business
      const submission = await submitBusiness(formData)

      // Record fee payment (in real app, this would be after actual payment)
      await paySubmissionFee(submission.id, SUBMISSION_FEE)

      alert("Business submitted successfully! It will be reviewed by the DAO.")

      // Reset form
      setFormData({
        business_name: "",
        business_type: "defi",
        description: "",
        hook_address: "",
        hook_deployed: false,
        estimated_volume: 0,
        requesting_agency_support: false,
        agency_services: [],
        budget_range: "under_10k",
        preferred_district: "",
        property_size: "20x20",
        website_url: "",
        twitter_url: "",
        discord_url: "",
        whitepaper_url: "",
        submitter_email: "",
      })
      setShowForm(false)
    } catch (err: any) {
      console.error("[v0] Submission error:", err)
      alert("Failed to submit: " + err.message)
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "under_review":
        return "bg-blue-500"
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Business Submission Portal</CardTitle>
              <CardDescription>Apply for property allocation and Agency support</CardDescription>
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
              <p className="text-muted-foreground">Connect your wallet to submit a business application</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto">
                  {showForm ? "Cancel" : "Submit New Business"}
                </Button>
                {!showForm && (
                  <p className="text-sm text-muted-foreground mt-2">Submission fee: {SUBMISSION_FEE} VOID</p>
                )}
              </div>

              {showForm && (
                <Card className="mb-6 border-2 border-primary">
                  <CardHeader>
                    <CardTitle>New Business Application</CardTitle>
                    <CardDescription>Fee: {SUBMISSION_FEE} VOID (anti-spam measure)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Business Name *</Label>
                        <Input
                          value={formData.business_name}
                          onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                          placeholder="Your Project Name"
                        />
                      </div>

                      <div>
                        <Label>Business Type *</Label>
                        <Select
                          value={formData.business_type}
                          onValueChange={(v) => setFormData({ ...formData, business_type: v as BusinessType })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {BUSINESS_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Description *</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your project, its goals, and how it fits into the PSX ecosystem"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>V4 Hook Address (if deployed)</Label>
                        <Input
                          value={formData.hook_address}
                          onChange={(e) => setFormData({ ...formData, hook_address: e.target.value })}
                          placeholder="0x..."
                        />
                      </div>

                      <div>
                        <Label>Estimated Trading Volume</Label>
                        <Input
                          type="number"
                          value={formData.estimated_volume}
                          onChange={(e) =>
                            setFormData({ ...formData, estimated_volume: Number.parseInt(e.target.value) || 0 })
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agency"
                        checked={formData.requesting_agency_support}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, requesting_agency_support: checked as boolean })
                        }
                      />
                      <Label htmlFor="agency" className="font-semibold">
                        Request Agency Support (marketing, development, design)
                      </Label>
                    </div>

                    {formData.requesting_agency_support && (
                      <div className="space-y-3 pl-6 border-l-2 border-primary">
                        <Label>Services Needed</Label>
                        {AGENCY_SERVICES.map((service) => (
                          <div key={service.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={service.id}
                              checked={formData.agency_services.includes(service.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({
                                    ...formData,
                                    agency_services: [...formData.agency_services, service.id],
                                  })
                                } else {
                                  setFormData({
                                    ...formData,
                                    agency_services: formData.agency_services.filter((s) => s !== service.id),
                                  })
                                }
                              }}
                            />
                            <Label htmlFor={service.id}>{service.label}</Label>
                          </div>
                        ))}

                        <div>
                          <Label>Budget Range</Label>
                          <Select
                            value={formData.budget_range}
                            onValueChange={(v) => setFormData({ ...formData, budget_range: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under_10k">Under $10k</SelectItem>
                              <SelectItem value="10k_50k">$10k - $50k</SelectItem>
                              <SelectItem value="50k_100k">$50k - $100k</SelectItem>
                              <SelectItem value="over_100k">Over $100k</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Preferred District</Label>
                        <Input
                          value={formData.preferred_district}
                          onChange={(e) => setFormData({ ...formData, preferred_district: e.target.value })}
                          placeholder="Gaming, DeFi, Social, etc."
                        />
                      </div>

                      <div>
                        <Label>Property Size</Label>
                        <Select
                          value={formData.property_size}
                          onValueChange={(v) => setFormData({ ...formData, property_size: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="20x20">20×20 (Standard)</SelectItem>
                            <SelectItem value="40x40">40×40 (+100 VOID)</SelectItem>
                            <SelectItem value="60x60">60×60 (+300 VOID)</SelectItem>
                            <SelectItem value="80x80">80×80 (+600 VOID)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Email (for updates)</Label>
                        <Input
                          type="email"
                          value={formData.submitter_email}
                          onChange={(e) => setFormData({ ...formData, submitter_email: e.target.value })}
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <Label>Website</Label>
                        <Input
                          value={formData.website_url}
                          onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                          placeholder="https://"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={!formData.business_name || !formData.description}
                      className="w-full"
                    >
                      Submit Application ({SUBMISSION_FEE} VOID)
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Tabs defaultValue="my-submissions">
                <TabsList className="w-full">
                  <TabsTrigger value="my-submissions" className="flex-1">
                    My Submissions ({mySubmissions.length})
                  </TabsTrigger>
                  <TabsTrigger value="all-submissions" className="flex-1">
                    All Submissions ({submissions.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="my-submissions" className="space-y-4 mt-4">
                  {loading ? (
                    <p className="text-center text-muted-foreground">Loading...</p>
                  ) : mySubmissions.length === 0 ? (
                    <p className="text-center text-muted-foreground">No submissions yet</p>
                  ) : (
                    mySubmissions.map((sub) => (
                      <SubmissionCard key={sub.id} submission={sub} getStatusColor={getStatusColor} />
                    ))
                  )}
                </TabsContent>

                <TabsContent value="all-submissions" className="space-y-4 mt-4">
                  {loading ? (
                    <p className="text-center text-muted-foreground">Loading...</p>
                  ) : submissions.length === 0 ? (
                    <p className="text-center text-muted-foreground">No submissions yet</p>
                  ) : (
                    submissions.map((sub) => (
                      <SubmissionCard key={sub.id} submission={sub} getStatusColor={getStatusColor} />
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

function SubmissionCard({ submission, getStatusColor }: any) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
              <Badge variant="outline">{submission.business_type}</Badge>
              {submission.requesting_agency_support && <Badge variant="secondary">Agency Support Requested</Badge>}
            </div>
            <CardTitle className="text-lg">{submission.business_name}</CardTitle>
            <CardDescription className="mt-1">{submission.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {submission.hook_address && (
            <div>
              <span className="text-muted-foreground">Hook: </span>
              <code className="text-xs">{submission.hook_address}</code>
            </div>
          )}
          {submission.estimated_volume > 0 && (
            <div>
              <span className="text-muted-foreground">Est. Volume: </span>$
              {submission.estimated_volume.toLocaleString()}
            </div>
          )}
          {submission.preferred_district && (
            <div>
              <span className="text-muted-foreground">Preferred District: </span>
              {submission.preferred_district}
            </div>
          )}
          <div>
            <span className="text-muted-foreground">Property Size: </span>
            {submission.property_size}
          </div>
          {submission.review_notes && (
            <div className="mt-2 p-2 bg-muted rounded">
              <span className="text-muted-foreground font-semibold">Review Notes: </span>
              {submission.review_notes}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
