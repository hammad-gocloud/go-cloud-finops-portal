'use client'
import { useRouter } from "next/navigation"
import { NavHeader } from "@/components/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MOCK_TEMPLATES, MOCK_ORGANIZATIONS } from "@/lib/mock-data"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ArrowRight, FileText, MessageSquare, Sparkles, ImageIcon } from "lucide-react"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import Loader from "@/components/loader"

export default  function TemplatesPage() {
  const { user, isLoading: authLoading, isAuthorized } = useProtectedRoute()

  if (authLoading) {
    return <Loader title="Loading..." subtitle="Please wait while we authenticate you" />
  }

  if (!isAuthorized) {
    return <Loader title="Unauthorized" subtitle="Redirecting to login..." />
  }

  // Get templates created by current user
  const myTemplates = MOCK_TEMPLATES
  const draftTemplates = myTemplates.filter((t) => t.status === "draft")
  const submittedTemplates = myTemplates.filter((t) => t.status === "submitted")
  const approvedTemplates = myTemplates.filter((t) => t.status === "approved")
  const rejectedTemplates = myTemplates.filter((t) => t.status === "rejected")
  const publishedTemplates = myTemplates.filter((t) => t.status === "published")

  function TemplateList({ templates }: { templates: typeof myTemplates }) {
    if (templates.length === 0) {
      return (
        <div className="text-center py-12 space-y-3">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No templates in this category</p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {templates.map((template) => {
          const org = MOCK_ORGANIZATIONS.find((o) => o.id === template.organizationId)
          return (
            <div
              key={template.id}
              className="group rounded-xl border bg-muted/30 p-5 space-y-4 hover:bg-muted/50 hover:border-primary/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-base">{org?.name}</p>
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
                  <p className="text-sm text-muted-foreground">{template.createdAt.toLocaleDateString()}</p>
                </div>
                <Link href={`/team/templates/${template.id}`}>
                  <Button variant="ghost" size="sm" className="gap-2 group-hover:gap-3 transition-all">
                    View
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <p className="text-sm leading-relaxed line-clamp-2">{template.content}</p>
              {template.feedback && (
                <div className="rounded-lg bg-muted border p-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Organization Feedback
                  </p>
                  <p className="text-sm">{template.feedback}</p>
                  {template.feedbackImages && template.feedbackImages.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <ImageIcon className="h-3 w-3" />
                        {template.feedbackImages.length} reference image{template.feedbackImages.length > 1 ? "s" : ""}{" "}
                        attached
                      </p>
                      <div className="flex gap-2 overflow-x-auto">
                        {template.feedbackImages.slice(0, 3).map((image, index) => (
                          <div
                            key={index}
                            className="flex-shrink-0 w-16 h-16 rounded border overflow-hidden bg-background"
                          >
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Reference ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {template.feedbackImages.length > 3 && (
                          <div className="flex-shrink-0 w-16 h-16 rounded border bg-muted flex items-center justify-center">
                            <span className="text-xs font-medium text-muted-foreground">
                              +{template.feedbackImages.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {template.status === "approved" && (
                <div className="flex gap-2 pt-2">
                  <Link href={`/team/templates/${template.id}/publish`} className="flex-1">
                    <Button size="sm" className="w-full gap-2">
                      <Sparkles className="h-4 w-4" />
                      Publish Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <NavHeader user={user} title="Template Management" />
      <main className="p-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight text-balance">My Templates</h2>
              <p className="text-lg text-muted-foreground">Manage all your social media content templates</p>
            </div>
            <Link href="/team/templates/new">
              <Button size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Template
              </Button>
            </Link>
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Templates Overview</CardTitle>
              <CardDescription className="text-base">Track the status of all your created content</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-6 h-auto p-1">
                  <TabsTrigger value="all" className="text-xs sm:text-sm">
                    All
                    <Badge variant="secondary" className="ml-1.5 px-1.5 py-0.5 text-xs">
                      {myTemplates.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="draft" className="text-xs sm:text-sm">
                    Draft
                    <Badge variant="secondary" className="ml-1.5 px-1.5 py-0.5 text-xs">
                      {draftTemplates.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="submitted" className="text-xs sm:text-sm">
                    Submitted
                    <Badge variant="secondary" className="ml-1.5 px-1.5 py-0.5 text-xs">
                      {submittedTemplates.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="text-xs sm:text-sm">
                    Approved
                    <Badge variant="secondary" className="ml-1.5 px-1.5 py-0.5 text-xs">
                      {approvedTemplates.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="text-xs sm:text-sm">
                    Rejected
                    <Badge variant="secondary" className="ml-1.5 px-1.5 py-0.5 text-xs">
                      {rejectedTemplates.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="published" className="text-xs sm:text-sm">
                    Published
                    <Badge variant="secondary" className="ml-1.5 px-1.5 py-0.5 text-xs">
                      {publishedTemplates.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-6">
                  <TemplateList templates={myTemplates} />
                </TabsContent>
                <TabsContent value="draft" className="mt-6">
                  <TemplateList templates={draftTemplates} />
                </TabsContent>
                <TabsContent value="submitted" className="mt-6">
                  <TemplateList templates={submittedTemplates} />
                </TabsContent>
                <TabsContent value="approved" className="mt-6">
                  <TemplateList templates={approvedTemplates} />
                </TabsContent>
                <TabsContent value="rejected" className="mt-6">
                  <TemplateList templates={rejectedTemplates} />
                </TabsContent>
                <TabsContent value="published" className="mt-6">
                  <TemplateList templates={publishedTemplates} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
