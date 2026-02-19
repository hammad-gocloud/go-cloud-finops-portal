"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MOCK_ORGANIZATIONS } from "@/lib/mock-data"

interface CreateTemplateFormProps {
  userId: number
}

export function CreateTemplateForm({ userId }: CreateTemplateFormProps) {
  const router = useRouter()
  const [organizationId, setOrganizationId] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Mock template creation - replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    router.push("/team")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Social Media Template</CardTitle>
        <CardDescription>Design content for organization approval</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Select value={organizationId} onValueChange={setOrganizationId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_ORGANIZATIONS.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Post Content</Label>
            <Textarea
              id="content"
              placeholder="Write your social media post content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              required
            />
            <p className="text-xs text-muted-foreground">{content.length} characters</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          {imageUrl && (
            <div className="rounded-lg border p-4">
              <p className="mb-2 text-sm font-medium">Preview</p>
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="Template preview"
                className="h-48 w-full rounded object-cover"
              />
            </div>
          )}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Submit for Approval"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
