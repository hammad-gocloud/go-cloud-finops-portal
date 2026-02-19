"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { Template } from "@/lib/types"
import { CheckCircle2, XCircle, Upload, X } from "lucide-react"

interface TemplateReviewFormProps {
  template: Template
}

export function TemplateReviewForm({ template }: TemplateReviewFormProps) {
  const router = useRouter()
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false)
  const [feedbackImages, setFeedbackImages] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setFeedbackImages((prev) => [...prev, ...newImages])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setFeedbackImages((prev) => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setFeedbackImages((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleApprove() {
    setLoading(true)
    // Mock approval - replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/organization")
  }

  async function handleReject(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Mock rejection - replace with real API call
    // In real implementation, send feedback and feedbackImages to API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/organization")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Template Review</CardTitle>
            <Badge variant="outline">{template.status}</Badge>
          </div>
          <CardDescription>Review the content and provide feedback or approval</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Post Content</Label>
            <div className="mt-2 rounded-lg border bg-muted/50 p-4">
              <p className="text-sm leading-relaxed">{template.content}</p>
            </div>
          </div>

          {template.imageUrl && (
            <div>
              <Label>Attached Image</Label>
              <div className="mt-2 rounded-lg border overflow-hidden">
                <img src={template.imageUrl || "/placeholder.svg"} alt="Template" className="w-full h-auto" />
              </div>
            </div>
          )}

          <div>
            <Label className="text-xs text-muted-foreground">Created on</Label>
            <p className="text-sm">{template.createdAt.toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Decision</CardTitle>
          <CardDescription>Approve this template or request changes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleReject} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback (optional for approval, required for rejection)</Label>
              <Textarea
                id="feedback"
                placeholder="Provide feedback or suggestions..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Attach Reference Images (optional)</Label>
              <div
                className={`relative rounded-lg border-2 border-dashed transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="feedback-images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="feedback-images"
                  className="flex cursor-pointer flex-col items-center justify-center p-6 text-center"
                >
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-primary">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                </label>
              </div>

              {feedbackImages.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {feedbackImages.map((image, index) => (
                    <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Feedback ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="button" onClick={handleApprove} disabled={loading} className="flex-1">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {loading ? "Processing..." : "Approve"}
              </Button>
              <Button type="submit" variant="destructive" disabled={loading || !feedback.trim()} className="flex-1">
                <XCircle className="mr-2 h-4 w-4" />
                Request Changes
              </Button>
            </div>
          </form>

          <Button variant="outline" onClick={() => router.back()} className="w-full">
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
