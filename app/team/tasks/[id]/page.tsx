'use client'
import { useParams, useRouter } from "next/navigation"
import { NavHeader } from "@/components/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TaskCommentForm } from "@/components/task-comment-form"
import { MentionText } from "@/components/mention-text"
import {
  Clock,
  AlertCircle,
  FileText,
  User,
  Calendar,
  ArrowLeft,
  MessageSquare,
  Edit,
  Send,
  ThumbsUp,
  ThumbsDown,
  Rocket,
  ImageIcon,
  File,
  Download,
  Zap,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/app/contexts/AuthContext"
import useGetTaskById from "@/hooks/useGetTaskById"
import useGetActivityByTask from "@/hooks/useGetActivityByTask"
import useGetUsersByTaskId from "@/hooks/useGetUsersByTask"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"

export default function TaskDetailsPage() {
  const params = useParams()
  const taskId = params.id as string
  const { user, isLoading: authLoading, isAuthorized } = useProtectedRoute()

  const { task, isLoading: taskLoading } = useGetTaskById(taskId)
  const { activity, isLoading: activityLoading } = useGetActivityByTask(taskId)
  const { users } = useGetUsersByTaskId(taskId)

  // Show loading while authentication is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <NavHeader user={user} title="Loading..." />
        <main className="p-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Verifying authentication...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // If not authorized, the hook will handle the redirect
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <NavHeader user={user} title="Redirecting..." />
        <main className="p-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Redirecting to login...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const isLoading = taskLoading || activityLoading

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <NavHeader user={user} title="Loading..." />
        <main className="p-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center py-12">
              <p>Loading task details...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <NavHeader user={user} title="Task Not Found" />
        <main className="p-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center py-12">
              <p>Task not found.</p>
            </div>
          </div>
        </main>
      </div>
    )
  }



  const getActivityIcon = (type: string) => {
    switch (type) {
      case "created":
        return <Clock className="h-5 w-5" />
      case "template_submitted":
        return <Send className="h-5 w-5" />
      case "feedback_provided":
        return <MessageSquare className="h-5 w-5" />
      case "template_revised":
        return <Edit className="h-5 w-5" />
      case "approved":
        return <ThumbsUp className="h-5 w-5" />
      case "rejected":
        return <ThumbsDown className="h-5 w-5" />
      case "published":
        return <Rocket className="h-5 w-5" />
      case "quick_action":
        return <Zap className="h-5 w-5" />
      case "comment":
        return <ImageIcon className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "created":
        return "bg-muted text-muted-foreground"
      case "template_submitted":
        return "bg-secondary/10 text-secondary"
      case "feedback_provided":
        return "bg-chart-5/10 text-chart-5"
      case "template_revised":
        return "bg-accent/10 text-accent"
      case "approved":
        return "bg-primary/10 text-primary"
      case "rejected":
        return "bg-destructive/10 text-destructive"
      case "published":
        return "bg-emerald-500/10 text-emerald-600"
      case "quick_action":
        return "bg-indigo-500/10 text-indigo-600"
      case "comment":
        return "bg-blue-500/10 text-blue-600"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getYouTubeId = (url: string): string | null => {
    try {
      const u = new URL(url)
      if (u.hostname.includes('youtube.com')) return u.searchParams.get('v')
      if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
      return null
    } catch {
      return null
    }
  }

  const classifyUrl = (url: string): 'youtube' | 'image' | 'video' | 'link' => {
    const yt = getYouTubeId(url)
    if (yt) return 'youtube'
    if (/\.(png|jpg|jpeg|gif|webp)$/i.test(url)) return 'image'
    if (/\.(mp4|webm|mov)$/i.test(url)) return 'video'
    return 'link'
  }

  const normalizeUrl = (raw: string): string => {
    return raw
      ?.trim()
      .replace(/^`+|`+$/g, '')
      .replace(/^"+|"+$/g, '')
      .replace(/^'+|'+$/g, '')
  }

  const renderEmbedPreview = (url: string) => {
    const kind = classifyUrl(url)
    if (kind === 'youtube') {
      const ytId = getYouTubeId(url)
      return (
        <iframe
          className="w-full h-48 rounded"
          src={`https://www.youtube.com/embed/${ytId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )
    }
    if (kind === 'image') {
      return <img src={url} alt="Embedded image" className="w-full h-48 object-cover rounded" />
    }
    if (kind === 'video') {
      return <video controls src={url} className="w-full h-48 rounded" />
    }
    return (
      <a href={url} target="_blank" rel="noreferrer" className="text-sm break-all text-blue-600 hover:underline">
        {url}
      </a>
    )
  }

  const renderMediaFile = (mediaItem: any, index: number) => {
    const isImage = mediaItem.fileType?.startsWith('image/')
    const fileName = mediaItem.key?.split('/').pop() || `file-${index + 1}`
    
    if (isImage) {
      return (
        <div
          key={index}
          className="group relative aspect-square overflow-hidden rounded-lg border bg-muted hover:border-primary transition-colors w-full"
        >
          <Image
            src={mediaItem.url || "/placeholder.svg"}
            alt={fileName}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Button
              size="sm"
              variant="secondary"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => window.open(mediaItem.url, '_blank')}
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      )
    } else {
      return (
        <div
          key={index}
          className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <File className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium truncate">{fileName}</p>
            <p className="text-xs text-muted-foreground truncate">{mediaItem.fileType}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 sm:h-9 sm:w-9 p-0"
            onClick={() => window.open(mediaItem.url, '_blank')}
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <NavHeader user={user} title="Task Details" />
      <main className="p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex items-center gap-4">
            <Link href="/team">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight text-balance">Task Details</h2>
            <p className="text-lg text-muted-foreground">Complete workflow history and activity timeline</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border-none shadow-lg lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-xl">Task Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Organization</p>
                      <p className="font-semibold">{task?.organization?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-secondary/10 p-2">
                      <User className="h-4 w-4 text-secondary" />
                    </div>
                   
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-accent/10 p-2">
                      <Calendar className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-semibold">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-chart-5/10 p-2">
                      <AlertCircle className="h-4 w-4 text-chart-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge
                        variant={
                          task.status === "approved"
                            ? "default"
                            : task.status === "pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {task.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-destructive/10 p-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Priority</p>
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "destructive"
                            : task.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 lg:col-span-2">
              <Card className="border-none shadow-lg overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl">Activity Timeline</CardTitle>
                  <CardDescription className="text-base">
                    Complete history of interactions between team and organization
                  </CardDescription>
                </CardHeader>
                <CardContent className="max-h-[800px] overflow-y-auto">
                  <div className="space-y-6 pr-2">
                    {activityLoading ? (
                      <div className="text-center py-12 space-y-3">
                        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                          <Clock className="h-8 w-8 text-muted-foreground animate-spin" />
                        </div>
                        <p className="text-sm text-muted-foreground">Loading activities...</p>
                      </div>
                    ) : !activity || activity.length === 0 ? (
                      <div className="text-center py-12 space-y-3">
                        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                          <Clock className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">No activity yet</p>
                      </div>
                    ) : (
                      <div className="relative space-y-6 before:absolute before:left-[23px] before:top-8 before:bottom-8 before:w-px before:bg-border">
                        {activity.map((act: any) => {
                          return (
                            <div key={act.id} className="relative flex gap-4">
                              <div
                                className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${getActivityColor(act.type)}`}
                              >
                                {getActivityIcon(act.type)}
                              </div>
                              <div className="flex-1 min-w-0 space-y-3 pb-6">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                                  <div className="space-y-1 min-w-0 flex-1">
                                    <p className="font-semibold text-base">
                                      {act.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                    </p>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-muted-foreground">
                                      <span className="truncate">
                                        {act.user?.fullName || 
                                          (act.performedByRole === "organization"
                                            ? task?.organization?.name || "Organization"
                                            : act.performedByRole === "social_media_team" 
                                              ? "Social Media Team"
                                              : "System")}
                                      </span>
                                      <span className="hidden sm:inline">•</span>
                                      <span className="text-xs sm:text-sm">{new Date(act.timestamp).toLocaleString()}</span>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="shrink-0 self-start">
                                    {act.performedByRole.replace("_", " ")}
                                  </Badge>
                                </div>

                                {act.comment && (
                                  <div className={`rounded-lg border p-4 space-y-2`}>
                                    <p className="text-sm font-semibold text-muted-foreground">Message:</p>
                                    <MentionText text={act.comment} users={users || []} mentionIds={(act.mentions as number[] | undefined)} />
                                  </div>
                                )}

                                {act.embeddedUrl && act.embeddedUrl.length > 0 && (
                                  <div className="space-y-3">
                                    <p className="text-sm font-semibold text-muted-foreground">
                                      Embedded Links ({Array.isArray(act.embeddedUrl) ? act.embeddedUrl.length : 1}):
                                    </p>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                      {(Array.isArray(act.embeddedUrl) ? act.embeddedUrl : [act.embeddedUrl]).map((url: string, idx: number) => (
                                        <div key={idx} className="rounded-lg border bg-amber-500/5 p-4">
                                          {renderEmbedPreview(normalizeUrl(url))}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {act.media && act.media.length > 0 && (
                                  <div className="space-y-3">
                                    <p className="text-sm font-semibold text-muted-foreground">
                                      Attached Files ({act.media.length}):
                                    </p>
                                    <div className="space-y-3">
                                      {/* Images Grid - Always 2 columns on mobile, 2-3 on larger screens */}
                                      {act.media.filter((item: any) => item.fileType?.startsWith('image/')).length > 0 && (
                                        <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-full">
                                          {act.media
                                            .filter((item: any) => item.fileType?.startsWith('image/'))
                                            .map((mediaItem: any, index: number) => renderMediaFile(mediaItem, index))}
                                        </div>
                                      )}
                                      
                                      {/* Documents List */}
                                      {act.media.filter((item: any) => !item.fileType?.startsWith('image/')).length > 0 && (
                                        <div className="space-y-2">
                                          {act.media
                                            .filter((item: any) => !item.fileType?.startsWith('image/'))
                                            .map((mediaItem: any, index: number) => renderMediaFile(mediaItem, index))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <TaskCommentForm 
                taskId={task.id} 
                userRole="social_media_team"
                isForSubmissionTemplates={activity?.length === 0 ? true : false}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
