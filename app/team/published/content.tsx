"use client"

import { NavHeader } from "@/components/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ExternalLink } from "lucide-react"
import type { Organization, Template, } from "@/lib/types"
import { User } from "@/src/api/api"

interface PublishedPostsContentProps {
  user: User
  publishedTemplates: Template[]
  organizations: Organization[]
}

export function PublishedPostsContent({ user, publishedTemplates, organizations }: PublishedPostsContentProps) {
  return (
    <div className="min-h-screen bg-background">
      <NavHeader user={user} title="Published Posts" />
      <main className="p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Published Content</h2>
            <p className="text-muted-foreground">View all your live social media posts</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Published Posts History</CardTitle>
              <CardDescription>All content that has been published to social media platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {publishedTemplates.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No published posts yet. Publish approved templates to see them here.
                  </p>
                ) : (
                  publishedTemplates.map((template) => {
                    const org = organizations.find((o) => o.id === template.organizationId)
                    return (
                      <div key={template.id} className="rounded-lg border p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{org?.name}</p>
                              <Badge>Published</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {template.publishedAt?.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <a
                            href="#"
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                            onClick={(e) => e.preventDefault()}
                          >
                            View Post
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <p className="text-sm">{template.content}</p>
                        {template.imageUrl && (
                          <div className="rounded-lg border overflow-hidden">
                            <img
                              src={template.imageUrl || "/placeholder.svg"}
                              alt="Published content"
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}