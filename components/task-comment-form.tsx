"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  X,
  Upload,
  Send,
  MessageSquare,
  FileText,
  Edit,
  MessageCircle,
  Rocket,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  File,
  Image as ImageIcon,
  Zap
} from "lucide-react"
import Image from "next/image"
import http from "@/src/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAuth } from "@/app/contexts/AuthContext"
import * as Popover from "@radix-ui/react-popover"
import useGetTeamMembers from "@/hooks/useGetTeamMembers"
import useGetTaskById from "@/hooks/useGetTaskById"
import useGetTeam from "@/hooks/useGetTeam"
import useGetUsersByTaskId from "@/hooks/useGetUsersByTask"
import { User } from "@/src/api/api"

type ActivityType =
  | "created"
  | "template_submitted"
  | "feedback_provided"
  | "template_revised"
  | "approved"
  | "rejected"
  | "published"
  | "comment"
  | "nudge"
  | "quick_action"
  | "pending"
  | "assigned_to_designer"
  | "internal_review"
  | "ready_to_publish"

interface MediaFile {
  id: string
  file: File
  preview?: string
  type: 'image' | 'document' | 'video'
}

interface UrlEmbed {
  id: string
  url: string
  kind: 'youtube' | 'image' | 'video' | 'link'
}

interface TaskCommentFormProps {
  taskId: number,
  userRole: "social_media_team" | "organization"
  isForSubmissionTemplates?: boolean
}

export function TaskCommentForm({ taskId, userRole, isForSubmissionTemplates }: TaskCommentFormProps) {
  const { user } = useAuth()
  const [comment, setComment] = useState("")
  const [media, setMedia] = useState<MediaFile[]>([])
  const [urlEmbeds, setUrlEmbeds] = useState<UrlEmbed[]>([])
  const [activityType, setActivityType] = useState<ActivityType>(isForSubmissionTemplates ? "template_submitted" : "comment")
  const [isUploading, setIsUploading] = useState(false)
  const [mentionOpen, setMentionOpen] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("")
  const [mentionStartIdx, setMentionStartIdx] = useState<number | null>(null)
  const [mentionIds, setMentionIds] = useState<number[]>([])
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const queryClient = useQueryClient()
  const taskInString = String(taskId)

  const { users, isLoading } = useGetUsersByTaskId(taskInString)

  // const dummyUsers = [
  //   { id: 1, name: "Alice Johnson", username: "alice", avatarUrl: "/placeholder-user.jpg" },
  //   { id: 2, name: "Bob Smith", username: "bob", avatarUrl: "/placeholder-user.jpg" },
  //   { id: 3, name: "Charlie Lee", username: "charlie", avatarUrl: "/placeholder-user.jpg" },
  //   { id: 4, name: "Diana Prince", username: "diana", avatarUrl: "/placeholder-user.jpg" },
  // ]

  const filteredUsers = (() => {
    const q = mentionQuery.trim().toLowerCase()
    if (!q) return users
    return users?.filter(u => u.fullName.toLowerCase().includes(q) || u.fullName.toLowerCase().includes(q))
  })()

  const isDelimiter = (ch: string) => /\s|[.,;:()\[\]{}!?#]/.test(ch)
  const updateMentionState = (val: string, caret: number | null) => {
    // Only open mention popover if caret is currently within an '@' mention token
    if (caret == null) {
      setMentionOpen(false)
      setMentionQuery("")
      setMentionStartIdx(null)
      return
    }
    let i = caret - 1
    let atPos = -1
    while (i >= 0) {
      const ch = val[i]
      if (ch === "@") { atPos = i; break }
      if (isDelimiter(ch)) break
      i--
    }
    if (atPos === -1) {
      setMentionOpen(false)
      setMentionQuery("")
      setMentionStartIdx(null)
      return
    }
    // Ensure '@' starts a token (start-of-line or preceded by a delimiter)
    if (atPos > 0 && !isDelimiter(val[atPos - 1])) {
      setMentionOpen(false)
      setMentionQuery("")
      setMentionStartIdx(null)
      return
    }
    const query = val.slice(atPos + 1, caret)
    setMentionQuery(query)
    setMentionStartIdx(atPos)
    setMentionOpen(true)
  }

  const insertMention = (user: User) => {
    if (mentionStartIdx == null) return
    const before = comment.slice(0, mentionStartIdx) // exclude '@'
    const afterStart = mentionStartIdx + 1 + mentionQuery.length
    const after = comment.slice(afterStart)
    const mentionText = `@${user.fullName}`
    const newText = `${before}${mentionText} ${after}`
    setComment(newText)
    setMentionOpen(false)
    setMentionQuery("")
    setMentionStartIdx(null)
    setMentionIds((prev) => (prev.includes(user.id) ? prev : [...prev, user.id]))
    // Restore focus and set caret just after the inserted mention and trailing space
    requestAnimationFrame(() => {
      textareaRef.current?.focus()
      const pos = before.length + mentionText.length + 1
      try { textareaRef.current?.setSelectionRange(pos, pos) } catch {}
    })
  }

  // Create mutation for task activity
  const { mutate: createActivity, isPending: isSubmitting } = useMutation({
    mutationFn: async (data: any) => {
      return http.api.taskActivityControllerCreate(data, {
        type: "multipart/form-data" as any
      })
    },
    onSuccess: () => {
      toast.success("Activity added successfully!")
      // Reset form
      setComment("")
      setMedia([])
      setActivityType(isForSubmissionTemplates ? "template_submitted" : "comment")
      setUrlEmbeds([])
      setMentionIds([])
      // Invalidate queries to refresh data - convert taskId to string to match hook
      queryClient.invalidateQueries({ queryKey: ["activity", taskId.toString()] })
      queryClient.invalidateQueries({ queryKey: ["task", taskId.toString()] })
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to add activity. Please try again."
      toast.error(message)
    }
  })

  // Get available activity types based on user role
  const getActivityOptions = () => {
    if (userRole === "social_media_team") {
      return [
        { value: "created", label: "Created", icon: FileText },
        { value: "template_submitted", label: "Submit Template", icon: FileText },
        { value: "template_revised", label: "Revise Template", icon: Edit },
        { value: "published", label: "Published Content", icon: Rocket },
        { value: "comment", label: "General Comment", icon: MessageSquare },
        { value: "quick_action", label: "Quick Action", icon: Zap },
        { value: "pending", label: "Pending", icon: MessageSquare },
        { value: "assigned_to_designer", label: "Assigned to Designer", icon: MessageSquare },
        { value: "internal_review", label: "Internal Review", icon: MessageSquare },
      ]
    } else {
      return [
        { value: "feedback_provided", label: "Provide Feedback", icon: MessageSquare },
        { value: "template_revised", label: "Revise Template", icon: Edit },
        { value: "approved", label: "Approve Template", icon: ThumbsUp },
        { value: "rejected", label: "Reject Template", icon: ThumbsDown },
        { value: "published", label: "Published Content", icon: Rocket },
        { value: "comment", label: "General Comment", icon: MessageSquare },
        { value: "nudge", label: "Nudge", icon: MessageCircle },
        { value: "pending", label: "Pending", icon: MessageSquare },
        { value: "ready_to_publish", label: "Ready to Publish", icon: Rocket },
      ]
    }
  }

  const activityOptions = getActivityOptions()
  const selectedOption = activityOptions.find(option => option.value === activityType)
  const IconComponent = selectedOption?.icon || MessageSquare

  const extractUrls = (text: string): string[] => {
    const regex = /(https?:\/\/[^\s]+)/g
    const matches = text.match(regex) || []
    return Array.from(new Set(matches))
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

  const classifyUrl = (url: string): UrlEmbed['kind'] => {
    const yt = getYouTubeId(url)
    if (yt) return 'youtube'
    if (/\.(png|jpg|jpeg|gif|webp)$/i.test(url)) return 'image'
    if (/\.(mp4|webm|mov)$/i.test(url)) return 'video'
    return 'link'
  }

  const buildEmbeds = (text: string) => {
    const urls = extractUrls(text)
    const embeds: UrlEmbed[] = urls.map(u => ({ id: u, url: u, kind: classifyUrl(u) }))
    setUrlEmbeds(embeds)
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setIsUploading(true)

    const newMediaFiles: MediaFile[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileType = file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
          ? 'video'
          : 'document'

      const mediaFile: MediaFile = {
        id: `${Date.now()}-${i}`,
        file,
        type: fileType,
        preview: (fileType === 'image' || fileType === 'video') ? URL.createObjectURL(file) : undefined
      }

      newMediaFiles.push(mediaFile)
    }

    setMedia([...media, ...newMediaFiles])
    setIsUploading(false)

    // Reset the input
    e.target.value = ''
  }

  const removeMedia = (id: string) => {
    setMedia(media.filter(item => item.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() && media.length === 0) return

    // Create data object matching CreateTaskActivityDto
    const activityData: any = {
      taskId: taskId,
      type: activityType,
      performedBy: user?.id, // This should come from auth context - using number as per DTO
      performedByRole: userRole === "social_media_team" ? "social_media_team" : "organization",
      comment: comment || undefined,
      // Add media files - they will be handled by FilesInterceptor('media')
      media: media.map(mediaItem => mediaItem.file),
      mentions: mentionIds.length > 0 ? mentionIds : undefined
    }
    
    // Add embedded URLs as an array if any exist
    if (urlEmbeds.length > 0) {
      activityData.embeddedUrl = urlEmbeds.map(embed => embed.url)
    }


    createActivity(activityData)
  }

  const handleNudge = () => {
    const activityData = {
      taskId: taskId,
      type: 'nudge' as ActivityType,
      performedBy: user?.id,
      performedByRole: userRole === "social_media_team" ? "social_media_team" : "organization",
      comment: 'Just a friendly reminder about the task — please take a look when you can.'
    }
    createActivity(activityData)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }



  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <IconComponent className="h-5 w-5" />
          Add Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activity-type">Activity Type</Label>
            <Select value={activityType} onValueChange={(value: ActivityType) => setActivityType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                {activityOptions.map((option) => {
                  const OptionIcon = option.icon
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <OptionIcon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">
              {activityType === "comment" ? "Comment" : "Message"}
            </Label>
            <Popover.Root
              open={mentionOpen}
              onOpenChange={(next) => {
                // Only allow closing via outside click/escape; ignore open toggles from clicks
                if (!next) setMentionOpen(false)
              }}
            >
              <Popover.Trigger asChild>
                <Textarea
                  ref={textareaRef}
                  id="comment"
                  placeholder={
                    activityType === "feedback_provided"
                      ? "Provide detailed feedback..."
                      : activityType === "approved"
                        ? "Add approval notes (optional)..."
                        : activityType === "rejected"
                          ? "Explain why this was rejected..."
                          : "Type your message here..."
                  }
                  value={comment}
                  onChange={(e) => {
                    const val = e.target.value
                    setComment(val)
                    updateMentionState(val, e.target.selectionStart)
                  }}
                  className="min-h-[100px] resize-none"
                />
              </Popover.Trigger>
              <Popover.Content side="bottom" align="start" className="z-50 w-64 rounded-md border bg-popover p-2 shadow-md" onOpenAutoFocus={(e) => e.preventDefault()}>
                <div className="space-y-1">
                  {filteredUsers?.length === 0 ? (
                    <div className="px-2 py-1 text-sm text-muted-foreground">No matches</div>
                  ) : (
                    filteredUsers?.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => insertMention(u)}
                        className="flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-muted"
                      >
                        <div className="relative h-6 w-6 overflow-hidden rounded-full">
                          <Image src={u?.profile?.url || "/placeholder-user.jpg"} alt={u.fullName} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{u.fullName}</p>
                     
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </Popover.Content>
            </Popover.Root>
          </div>

          <div className="space-y-2">
            <Label htmlFor="embed-url">Embed URL</Label>
            <div className="flex items-center gap-2">
              <Input
                id="embed-url"
                placeholder="Paste a link to embed (YouTube, image, video) and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const val = e.currentTarget.value.trim()
                    if (val && !urlEmbeds.some(embed => embed.url === val)) {
                      setUrlEmbeds([...urlEmbeds, { id: `${Date.now()}-${val}`, url: val, kind: classifyUrl(val) }])
                      e.currentTarget.value = ''
                    }
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  const input = document.getElementById('embed-url') as HTMLInputElement
                  const val = input?.value.trim()
                  if (val && !urlEmbeds.some(embed => embed.url === val)) {
                    setUrlEmbeds([...urlEmbeds, { id: `${Date.now()}-${val}`, url: val, kind: classifyUrl(val) }])
                    input.value = ''
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>

          {urlEmbeds.length > 0 && (
            <div className="space-y-3">
              <Label>Link Previews ({urlEmbeds.length})</Label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {urlEmbeds.map((emb) => (
                  <div key={emb.id} className="relative rounded-lg border p-3 group">
                    <button
                      type="button"
                      onClick={() => setUrlEmbeds(urlEmbeds.filter(e => e.id !== emb.id))}
                      className="absolute top-2 right-2 z-10 rounded-full p-1.5 bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shadow-sm"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {emb.kind === 'youtube' ? (
                      <iframe
                        className="w-full h-48 rounded"
                        src={`https://www.youtube.com/embed/${getYouTubeId(emb.url)}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : emb.kind === 'image' ? (
                      <img src={emb.url} alt="Embedded image" className="w-full h-48 object-cover rounded" />
                    ) : emb.kind === 'video' ? (
                      <video controls src={emb.url} className="w-full h-48 rounded" />
                    ) : (
                      <a href={emb.url} target="_blank" rel="noreferrer" className="text-sm break-all text-blue-600 hover:underline">
                        {emb.url}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {media.length > 0 && (
            <div className="space-y-3">
              <Label>Attached Files</Label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {media.map((item) => (
                  <div key={item.id} className="group relative rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {item.type === 'image' ? (
                          <div className="relative w-12 h-12 rounded overflow-hidden">
                            <Image
                              src={item.preview || "/placeholder.svg"}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : item.type === 'video' ? (
                          <div className="w-12 h-12 rounded bg-muted flex items-center justify-center overflow-hidden">
                            <video src={item.preview || ''} className="w-12 h-12 object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                            <File className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(item.file.size)} • {item.type === 'image' ? 'Image' : item.type === 'video' ? 'Video' : 'Document'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedia(item.id)}
                        className="flex-shrink-0 rounded-full p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="media-upload"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx"
                onChange={handleMediaUpload}
                className="hidden"
              />
              <label htmlFor="media-upload">
                <Button type="button" variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
                  <span className="cursor-pointer">
                    <Paperclip className="h-4 w-4" />
                    {isUploading ? "Uploading..." : "Attach Files"}
                  </span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground">
                {media.length > 0 && `${media.length} file${media.length > 1 ? "s" : ""} attached`}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  (activityType !== "approved" && !comment.trim() && media.length === 0) ||
                  (activityType === "rejected" && !comment.trim())
                }
                className="gap-2"
              >
                <IconComponent className="h-4 w-4" />
                {isSubmitting ? "Submitting..." :
                  activityType === "approved" ? "Approve" :
                    activityType === "rejected" ? "Reject" :
                      activityType === "published" ? "Mark as Published" :
                        activityType === "template_submitted" ? "Submit Template" :
                          activityType === "template_revised" ? "Submit Revision" :
                            activityType === "feedback_provided" ? "Send Feedback" :
                              activityType === "created" ? "Create" :
                                activityType === "pending" ? "Mark as Pending" :
                                  activityType === "assigned_to_designer" ? "Assign to Designer" :
                                    activityType === "internal_review" ? "Mark for Internal Review" :
                                      activityType === "ready_to_publish" ? "Mark Ready to Publish" :
                                        activityType === "quick_action" ? "Quick Action" :
                                          activityType === "nudge" ? "Send Nudge" :
                                            "Send"}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={handleNudge}
                className="gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Nudge
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
