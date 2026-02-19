"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Template, Organization } from "@/lib/types"
import { Calendar, Send, Clock } from "lucide-react"

interface PublishTemplateFormProps {
  template: Template
  organization?: Organization
}

export function PublishTemplateForm({ template, organization }: PublishTemplateFormProps) {
  const router = useRouter()
  const [platform, setPlatform] = useState<string>("")
  const [scheduleType, setScheduleType] = useState<"now" | "scheduled">("now")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [loading, setLoading] = useState(false)

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Mock publishing - replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    router.push("/team/templates")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Preview</CardTitle>
          <CardDescription>Review content before publishing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Organization</p>
              <p className="font-medium">{organization?.name}</p>
            </div>
            <Badge variant="secondary">Approved</Badge>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{template.content}</p>
          </div>

          {template.imageUrl && (
            <div className="rounded-lg border overflow-hidden">
              <img src={template.imageUrl || "/placeholder.svg"} alt="Template" className="w-full h-auto" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publishing Options</CardTitle>
          <CardDescription>Configure how and when to publish this content</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePublish} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="platform">Social Media Platform</Label>
              <Select value={platform} onValueChange={setPlatform} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="twitter">Twitter / X</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Publishing Schedule</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="now"
                    checked={scheduleType === "now"}
                    onCheckedChange={(checked) => {
                      if (checked) setScheduleType("now")
                    }}
                  />
                  <label
                    htmlFor="now"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Publish immediately
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="scheduled"
                    checked={scheduleType === "scheduled"}
                    onCheckedChange={(checked) => {
                      if (checked) setScheduleType("scheduled")
                    }}
                  />
                  <label
                    htmlFor="scheduled"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Schedule for later
                  </label>
                </div>
              </div>

              {scheduleType === "scheduled" && (
                <div className="ml-6 space-y-3 pt-2">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <input
                        type="date"
                        id="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required={scheduleType === "scheduled"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <input
                        type="time"
                        id="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required={scheduleType === "scheduled"}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Publishing Summary</p>
                  <p className="text-sm text-muted-foreground">
                    {scheduleType === "now"
                      ? "This post will be published immediately to " + (platform || "the selected platform")
                      : scheduledDate && scheduledTime
                        ? `This post will be published on ${new Date(scheduledDate).toLocaleDateString()} at ${scheduledTime} to ${platform || "the selected platform"}`
                        : "Select a date and time to schedule this post"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Publishing..." : scheduleType === "now" ? "Publish Now" : "Schedule Post"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
