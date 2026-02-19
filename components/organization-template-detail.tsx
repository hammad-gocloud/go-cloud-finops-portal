"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, XCircle, Clock, ArrowLeft, FileText, MessageSquare, ImageIcon } from "lucide-react"
import Link from "next/link"
import { TaskCommentForm } from "@/components/task-comment-form"
import type { Template, TaskActivity, TeamMember } from "@/lib/types"
import type { User } from "@/src/api/api"

interface OrganizationTemplateDetailProps {
  template: Template
  activities: TaskActivity[]
  teamMembers: TeamMember[]
  user: User
}

export function OrganizationTemplateDetail({
  template,
  activities,
  teamMembers,
  user,
}: OrganizationTemplateDetailProps) {
  const handleCommentSubmit = (comment: string, images: string[]) => {
    // TODO: Will implement server action for comment submission
    console.log("Submitting comment:", { comment, images })
  }
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "published":
        return <CheckCircle2 className="h-5 w-5" />
      case "rejected":
        return <XCircle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
      case "published":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
      case "rejected":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
      case "submitted":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "template_submitted":
      case "template_revised":
        return <FileText className="h-4 w-4" />
      case "feedback_provided":
      case "comment":
        return <MessageSquare className="h-4 w-4" />
      case "approved":
        return <CheckCircle2 className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getActivityTitle = (activity: TaskActivity) => {
    const performer =
      activity.performedByRole === "organization"
        ? "You"
        : teamMembers.find((m) => m.id === activity.performedBy)?.name || "Team Member"

    switch (activity.type) {
      case "template_submitted":
        return `${performer} submitted template`
      case "template_revised":
        return `${performer} revised template`
      case "feedback_provided":
        return `${performer} provided feedback`
      case "comment":
        return `${performer} added a comment`
      case "approved":
        return `${performer} approved template`
      case "rejected":
        return `${performer} rejected template`
      case "published":
        return `${performer} published template`
      default:
        return activity.details
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/organization/templates">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Templates
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl">Template #{template.id}</CardTitle>
              <CardDescription>Created {template.createdAt.toLocaleDateString()}</CardDescription>
            </div>
            <Badge className={`${getStatusColor(template.status)} border`} variant="secondary">
              <span className="flex items-center gap-1.5">
                {getStatusIcon(template.status)}
                {template.status}
              </span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-medium">Content</h3>
            <p className="text-sm text-muted-foreground">{template.content}</p>
          </div>

          {template.imageUrl && (
            <div>
              <h3 className="mb-2 text-sm font-medium">Image</h3>
              <img
                src={template.imageUrl || "/placeholder.svg"}
                alt="Template"
                className="max-h-64 w-auto rounded-md border object-cover"
              />
            </div>
          )}

          {template.publishedAt && (
            <div className="rounded-md bg-blue-500/10 p-3 text-sm">
              <p className="font-medium text-blue-700 dark:text-blue-400">
                Published on {template.publishedAt.toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Lifecycle</CardTitle>
          <CardDescription>Complete history of all feedback, revisions, and status changes</CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No activity history available</p>
          ) : (
            <div className="space-y-6">
              {activities.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        {getActivityIcon(activity.type)}
                      </div>
                      {index < activities.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-2 min-h-[40px]" />
                      )}
                    </div>

                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{getActivityTitle(activity)}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.timestamp.toLocaleDateString()} at{" "}
                            {activity.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      {activity.feedback && (
                        <div className="mt-2 rounded-md bg-muted p-3">
                          <p className="text-sm font-medium mb-1">Feedback:</p>
                          <p className="text-sm text-muted-foreground">{activity.feedback}</p>
                        </div>
                      )}

                      {activity.comment && (
                        <div className="mt-2 rounded-md bg-muted p-3">
                          <p className="text-sm text-muted-foreground">{activity.comment}</p>
                        </div>
                      )}

                      {activity.changes && (
                        <div className="mt-2 rounded-md border border-dashed p-3">
                          <p className="text-sm font-medium mb-1">Changes:</p>
                          <p className="text-sm text-muted-foreground">{activity.changes}</p>
                        </div>
                      )}

                      {activity.images && activity.images.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                            <ImageIcon className="h-4 w-4" />
                            Attached Images ({activity.images.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {activity.images.map((img, idx) => (
                              <img
                                key={idx}
                                src={img || "/placeholder.svg"}
                                alt={`Attachment ${idx + 1}`}
                                className="h-24 w-auto rounded-md border object-cover"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <TaskCommentForm taskId={template.taskId || template.id} userRole="organization" onSubmit={handleCommentSubmit} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Revisions:</span>
            <span className="font-medium">
              {activities.filter((a) => a.type === "template_revised").length}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Feedback Rounds:</span>
            <span className="font-medium">
              {activities.filter((a) => a.type === "feedback_provided").length}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Comments:</span>
            <span className="font-medium">{activities.filter((a) => a.type === "comment").length}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Status:</span>
            <Badge className={getStatusColor(template.status)} variant="secondary">
              {template.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}