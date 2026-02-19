"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Template, Organization } from "@/lib/types"
import { Calendar, Building2, FileText, ImageIcon } from "lucide-react"
import Link from "next/link"

interface TemplateDetailViewProps {
  template: Template
  organization?: Organization
}

export function TemplateDetailView({ template, organization }: TemplateDetailViewProps) {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Back to Templates
        </Button>
        {template.status === "rejected" && (
          <Link href={`/team/templates/${template.id}/edit`}>
            <Button>Edit Template</Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Template Details</CardTitle>
            <Badge
              variant={
                template.status === "published"
                  ? "default"
                  : template.status === "approved"
                    ? "secondary"
                    : template.status === "rejected"
                      ? "destructive"
                      : "outline"
              }
            >
              {template.status}
            </Badge>
          </div>
          <CardDescription>View complete template information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Organization</p>
                <p className="font-medium">{organization?.name || "Unknown"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="font-medium">{template.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <p className="font-medium">Post Content</p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{template.content}</p>
            </div>
          </div>

          {template.imageUrl && (
            <div>
              <p className="font-medium mb-2">Attached Image</p>
              <div className="rounded-lg border overflow-hidden">
                <img src={template.imageUrl || "/placeholder.svg"} alt="Template" className="w-full h-auto" />
              </div>
            </div>
          )}

          {template.feedback && (
            <div>
              <p className="font-medium mb-2">Organization Feedback</p>
              <div className="rounded-lg border bg-destructive/10 p-4 space-y-4">
                <p className="text-sm leading-relaxed">{template.feedback}</p>

                {template.feedbackImages && template.feedbackImages.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-destructive/20">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <ImageIcon className="h-3.5 w-3.5" />
                      Reference Images ({template.feedbackImages.length})
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {template.feedbackImages.map((image, index) => (
                        <div
                          key={index}
                          className="group relative aspect-square overflow-hidden rounded-lg border bg-background"
                        >
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Feedback reference ${index + 1}`}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {template.approvedAt && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>Approved on {template.approvedAt.toLocaleDateString()}</span>
            </div>
          )}

          {template.publishedAt && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>Published on {template.publishedAt.toLocaleDateString()}</span>
            </div>
          )}

          {template.status === "approved" && (
            <div className="pt-4 border-t">
              <Link href={`/team/templates/${template.id}/publish`}>
                <Button className="w-full">Publish This Template</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
