'use client'
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { NavHeader } from "@/components/nav-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
    Building,
    Bell,
    Zap,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { AuthContext, AuthProvider, useAuth } from "@/app/contexts/AuthContext"
import useGetTaskById from "@/hooks/useGetTaskById"
import useGetActivityByTask from "@/hooks/useGetActivityByTask"
import useGetUsersByTaskId from "@/hooks/useGetUsersByTask"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useGetTeamMembers from "@/hooks/useGetTeamMembers"
import http from "@/src/api"
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import useGetTeamMemberByUserId from "@/hooks/useGetTeamMemberByUserId"
import useGetTaskHistory from "@/hooks/useGetTaskHistory"
import useGetUser from "@/hooks/useGetUser"
import useGetTeamMembersOfTask from "@/hooks/useGetTeamMembersOfATask"
export const taskStatusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Assigned to Designer", value: "assigned_to_designer" },
    { label: "Internal Review", value: "internal_review" },
    { label: "Ready to Publish", value: "ready_to_publish" },
    { label: "Published", value: "published" },
];


export default function TeamTaskDetailsPage() {
    const router = useRouter();
    const { setToken, token: authToken, setUser, selectedRoleContext } = useAuth();
    const params = useParams();
    const searchParams = useSearchParams();
    const taskId = params.id as string;
    const token = searchParams.get("token");
    const userId = searchParams.get('userId')
    const isPublic = !!token;
    const { user: userData, isLoading: loadingUser } = useGetUser(userId as string)


    useEffect(() => {
        if (isPublic && userData) {
            setUser(userData as any);
        }
    }, [isPublic, userData, setUser]);
    useEffect(() => {
        if (token) setToken(token);
    }, [token, setToken, userId, setUser]);

    const { user, isAuthorized, isLoading: authLoading } = useProtectedRoute({
        skip: isPublic,
        redirectTo: "/login",
    });


    const { history, isLoading: loadingTaskHistory } = useGetTaskHistory(taskId);
    const { task, isLoading: taskLoading } = useGetTaskById(taskId);
    const { activity, isLoading: activityLoading } = useGetActivityByTask(taskId);
    const { users } = useGetUsersByTaskId(taskId);
    const { teamMembersOfTask, isLoading: teamMembersLoading } = useGetTeamMembersOfTask(taskId);
    const queryClient = useQueryClient();

    // ✅ Hooks must be declared before any conditional return
    const [showReassign, setShowReassign] = useState(false);
    const [showStatusChange, setShowStatusChange] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState<string>("");
    const [status, setStatus] = useState<string>("");

    const { mutate: reassignTask, isPending: reassigning } = useMutation({
        mutationFn: (payload: { memberId: number }) =>
            http.api.taskControllerAssignToMember(taskId, {
                memberId: payload.memberId,
                userId: user?.id || 0,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["task", taskId] });
            queryClient.invalidateQueries({ queryKey: ["task-activities", taskId] });
            queryClient.invalidateQueries({ queryKey: ["task-history", taskId] });
            toast.success("Task has been assigned to new team member");
            setShowReassign(false);
        },
    });

    const { mutate: updateStatus, isPending: updatingStatus } = useMutation({
        mutationFn: (payload: { status: any }) =>
            http.api.taskControllerUpdateStatus(taskId, {
                status: payload.status,
                userId: user?.id || 0,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["task", taskId] });
            queryClient.invalidateQueries({ queryKey: ["task-activities", taskId] });
            queryClient.invalidateQueries({ queryKey: ["task-history", taskId] });
            toast.success("Task status has been changed");
            setShowStatusChange(false);
        },
    });

    // ✅ Now you can safely have conditional returns
    if (token && !authToken && loadingUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
                <NavHeader title="Setting token..." />
                <main className="p-8">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Preparing access...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
                <NavHeader user={user} title="Loading..." />
                <main className="p-8">
                    <div className="mx-auto max-w-4xl text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Verifying authentication...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
                <NavHeader user={user} title="Redirecting..." />
                <main className="p-8">
                    <div className="mx-auto max-w-4xl text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Redirecting to login...</p>
                    </div>
                </main>
            </div>
        );
    }

    const isLoading =
        taskLoading ||
        activityLoading ||
        loadingTaskHistory ||
        teamMembersLoading;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
                <NavHeader user={user} title="Loading..." />
                <main className="p-8">
                    <div className="mx-auto max-w-7xl text-center py-12">
                        <p>Loading task details...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
                <NavHeader user={user} title="Task Not Found" />
                <main className="p-8">
                    <div className="mx-auto max-w-7xl text-center py-12">
                        <p>Task not found.</p>
                    </div>
                </main>
            </div>
        );
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
            case "nudge":
                return <Bell className="h-5 w-5" />
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
            case "nudge":
                return "bg-amber-500/10 text-amber-600"
            default:
                return "bg-muted text-muted-foreground"
        }


    }

    const getActivityBgColor = (type: string) => {
        switch (type) {
            // case "created":
            //     return "bg-muted text-muted-foreground"
            // case "template_submitted":
            //     return "bg-secondary/10 text-secondary"
            // case "feedback_provided":
            //     return "bg-chart-5/10 text-chart-5"
            // case "template_revised":
            //     return "bg-accent/10 text-accent"
            // case "approved":
            //     return "bg-primary/10 text-primary"
            // case "rejected":
            //     return "bg-destructive/10 text-destructive"
            // case "published":
            //     return "bg-emerald-500/10 text-emerald-600"
            // case "comment":
            //     return "bg-blue-500/10 text-blue-600"
            case "nudge":
                return "bg-amber-500/10 text-amber-600"
            case "quick_action":
                return "bg-indigo-500/10 text-indigo-600"
            default:
                return "bg-muted text-muted-foreground"
        }


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

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
            <NavHeader user={user} title="Task Details" />
            <main className="p-8">
                <div className="mx-auto max-w-6xl space-y-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="gap-2" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
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
                                            <Building className="h-4 w-4 text-primary" />
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
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">Assigned By</p>
                                            <p className="font-semibold">{task?.assignedByMember?.user?.fullName || 'Social Media Team'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-secondary/10 p-2">
                                            <User className="h-4 w-4 text-secondary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                Assigned To
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    aria-label="Reassign task"
                                                    onClick={() => setShowReassign((prev) => !prev)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </p>
                                            <p className="font-semibold">{task?.assignedToMember?.user?.fullName || 'Social Media Team'}</p>
                                        </div>
                                    </div>
                                    {/* Reassign Task */}
                                    {showReassign && (
                                        <Card className="border-none shadow-lg lg:col-span-1">
                                            <CardHeader>
                                                <CardTitle className="text-xl">Reassign Task</CardTitle>
                                                <CardDescription>Change assignee and keep history clean</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <p className="text-sm text-muted-foreground">Assigned To</p>
                                                    <Select
                                                        value={selectedMemberId}
                                                        onValueChange={(val) => setSelectedMemberId(val)}
                                                        disabled={!teamMembersOfTask || teamMembersLoading}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder={teamMembersLoading ? "Loading members..." : "Select a team member"} />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-64">
                                                            {teamMembersOfTask?.map((member: any) => (
                                                                <SelectItem key={member.id} value={member.id.toString()}>
                                                                    {member?.user?.fullName || `Member #${member.id}`} – {member.role}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <Separator />

                                                <div className="flex items-center justify-end gap-3">
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => {
                                                            setSelectedMemberId("")
                                                            setShowReassign(false)
                                                        }}
                                                        disabled={reassigning}
                                                    >
                                                        Reset
                                                    </Button>
                                                    <Button
                                                        onClick={() => selectedMemberId && reassignTask({ memberId: Number(selectedMemberId) })}
                                                        disabled={!selectedMemberId || reassigning}
                                                    >
                                                        {reassigning ? "Reassigning..." : "Reassign Task"}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
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
                                            <p className="text-sm text-muted-foreground">Status
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    aria-label="Reassign task"
                                                    onClick={() => setShowStatusChange((prev) => !prev)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </p>
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
                                    {/* status update  */}
                                    {
                                        showStatusChange && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-lg font-bold">Change Status</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <Select
                                                        value={status}
                                                        onValueChange={(val) => setStatus(val)}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder={"Select a status"} />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-64">
                                                            {taskStatusOptions?.map((status: any) => (
                                                                <SelectItem key={status.value} value={status.value}>
                                                                    {status.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                        {/* <SelectValue /> */}

                                                    </Select>
                                                </CardContent>
                                                <CardFooter className="flex justify-end gap-2">
                                                    <Button variant="outline" onClick={() => setShowStatusChange(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            updateStatus({
                                                                status: status
                                                            })
                                                            setShowStatusChange(false);
                                                        }}
                                                    >
                                                        {
                                                            updatingStatus ? 'Updating...' : "Update"
                                                        }
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        )
                                    }
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

                                    {/* Task History */}
                                    <Separator className="my-4" />
                                    <div className="space-y-3">
                                        <p className="text-sm text-muted-foreground">History</p>
                                        {loadingTaskHistory ? (
                                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                                <Clock className="h-4 w-4" />
                                                <span>Loading history...</span>
                                            </div>
                                        ) : !history || history.length === 0 ? (
                                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                                <Clock className="h-4 w-4" />
                                                <span>No history recorded</span>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {history.map((h: any) => {
                                                    const changedByName = h?.changedBy?.fullName || "Unknown"
                                                    const when = h?.createdAt ? new Date(h.createdAt).toLocaleString() : ""
                                                    const type = h?.type

                                                    let title = ""
                                                    let icon = <FileText className="h-4 w-4" />
                                                    let color = "bg-muted text-muted-foreground"

                                                    if (type === "created") {
                                                        title = `Task created by ${changedByName} on ${when}`
                                                        icon = <Clock className="h-4 w-4" />
                                                        color = "bg-muted/30 text-muted-foreground"
                                                    } else if (type === "status_change") {
                                                        const oldS = h?.oldStatus ? h.oldStatus.replace(/_/g, " ") : ""
                                                        const newS = h?.newStatus ? h.newStatus.replace(/_/g, " ") : ""
                                                        title = `Status changed from ${oldS || "-"} to ${newS || "-"} by ${changedByName} on ${when}`
                                                        icon = <AlertCircle className="h-4 w-4" />
                                                        color = "bg-chart-5/10 text-chart-5"
                                                    } else if (type === "member_change") {
                                                        const oldA = h?.oldAssignee?.user?.fullName || "Unassigned"
                                                        const newA = h?.newAssignee?.user?.fullName || "Unassigned"
                                                        title = `Assignee changed from ${oldA} to ${newA} by ${changedByName} on ${when}`
                                                        icon = <User className="h-4 w-4" />
                                                        color = "bg-secondary/10 text-secondary"
                                                    }

                                                    return (
                                                        <div key={h.id} className="flex items-start gap-3">
                                                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}>
                                                                {icon}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm">{title}</p>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
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
                                                                    <div className={`rounded-lg border p-4 space-y-2 ${getActivityBgColor(act.type)}`}>
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
                                                                            {(Array.isArray(act.embeddedUrl) ? act.embeddedUrl : [act.embeddedUrl]).map((url: string, idx: number) => {
                                                                                const cleanUrl = url.trim().replace(/^`+|`+$/g, '').replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '')
                                                                                return (
                                                                                    <div key={idx} className="rounded-lg border bg-amber-500/5 p-4">
                                                                                        {renderEmbedPreview(cleanUrl)}
                                                                                    </div>
                                                                                )
                                                                            })}
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
                                userRole={selectedRoleContext?.role?.title === 'Team Member' ? 'social_media_team' : 'organization'}
                                isForSubmissionTemplates={false}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
