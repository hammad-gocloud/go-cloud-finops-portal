"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { NavHeader } from "@/components/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as Dialog from "@radix-ui/react-dialog"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Building2,
  Users,
  FileText,
  Filter,
  Plus,
  ImageIcon,
  Video,
  File,
  Download,
  X
} from "lucide-react"
import Link from "next/link"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import Loader from "@/components/loader"
import useGetOrganization from "@/hooks/useGetOrganization"
import useGetTasksByOrganization from "@/hooks/useGetTasksByOrganization"
import useGetMediaOfOrganization from "@/hooks/useGetMediaOfOrganization"
import useUploadOrganizationMedia from "@/hooks/useUploadOrganizationMedia"
import { Task } from "@/lib/types"
import { Input } from "@/components/ui/input"

export default function OrganizationDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { user, isLoading: authLoading, isAuthorized } = useProtectedRoute()
  const [statusFilter, setStatusFilter] = useState<string | null>("")
  const [search, setSearch] = useState('')

  const { organization, isLoading: loadingOrganization } = useGetOrganization(id)
  const { TasksByOrganization: tasks, isLoading: loadingTasks } = useGetTasksByOrganization(id, statusFilter, search)
  const { organization: orgMedia, isLoading: loadingMedia } = useGetMediaOfOrganization(Number(id))

  // Media upload state
  const uploadMutation = useUploadOrganizationMedia()
  const [open, setOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  // Media upload handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const newFiles = Array.from(e.target.files)
    setSelectedFiles((prev) => {
      const existing = new Set(prev.map(f => `${f.name}-${f.size}`))
      const unique = newFiles.filter(f => !existing.has(`${f.name}-${f.size}`))
      return [...prev, ...unique]
    })
    e.target.value = ""
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return
    try {
      await uploadMutation.mutateAsync({
        organizationId: Number(id),
        files: selectedFiles,
      })
      setSelectedFiles([])
      setOpen(false)
    } catch (err) {
      console.error("Upload failed", err)
    }
  }

  // Media helper functions
  const cleanUrl = (url: string) => (url || '').trim().replace(/^`+|`+$/g, '').replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '')
  const getFileName = (key: string) => {
    if (!key) return 'file'
    const parts = key.split('/')
    return parts[parts.length - 1]
  }
  const resolveUrl = (item: any) => {
    if (!item) return ''
    if (typeof item === 'string') return cleanUrl(item)
    return cleanUrl(item.url ?? item.key ?? '')
  }
  const resolveName = (item: any) => {
    if (!item) return 'file'
    if (typeof item === 'string') return getFileName(item)
    return getFileName(item.key ?? item.url ?? '')
  }

  const images = orgMedia?.images || []
  const videos = orgMedia?.videos || []
  const pdfs = orgMedia?.pdfs || []
  const others = orgMedia?.other || []

  if (authLoading) {
    return <Loader title="Loading..." subtitle="Please wait while we load the organization details" />
  }

  if (!isAuthorized) {
    return <Loader title="Unauthorized" subtitle="Redirecting to login..." />
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <NavHeader user={user} title="Organization Not Found" />
        <main className="p-8">
          <div className="mx-auto max-w-4xl">
            <Card className="border-none shadow-lg">
              <CardContent className="p-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Organization Not Found</h2>
                <p className="text-muted-foreground mb-6">The organization you're looking for doesn't exist.</p>
                <Link href="/team">
                  <Button>Back to Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }




  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <NavHeader user={user} title={`${organization.name} - Dashboard`} />
      <main className="p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header with back button */}
          <div className="flex items-center gap-4">
            <Link href="/team">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-tight">{organization.name}</h1>
              <p className="text-lg text-muted-foreground">Manage tasks and content for this organization</p>
            </div>
          </div>

          <Tabs defaultValue="tasks" className="w-full">
            <TabsList>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
              <Card className="border-none shadow-lg">
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold">Tasks List</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Manage and track organization tasks
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select
                          value={statusFilter ?? "all"}
                          onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Tasks</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="assigned_to_designer">Assigned to Designer</SelectItem>
                            <SelectItem value="internal_review">Internal Review</SelectItem>
                            <SelectItem value="ready_to_publish">Ready to Publish</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                      </div>
                      <Link href={`/team/organizations/${id}/tasks/new`}>
                        <Button className="gap-2">
                          <Plus className="h-4 w-4" />
                          Create Task
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {loadingTasks ? (
                    <Loader
                      title="Loading Tasks"
                      subtitle="Please wait while we fetch the tasks..."
                    />
                  ) : tasks?.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {!statusFilter || statusFilter === "all"
                          ? "No tasks found for this organization."
                          : `No ${statusFilter.replace("_", " ")} tasks found.`}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tasks?.map((task) => (
                        <div
                          key={task.id}
                          className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold">{task.title}</h3>
                                <Badge
                                  variant={
                                    task.status === "approved"
                                      ? "default"
                                      : task.status === "pending"
                                        ? "secondary"
                                        : "outline"
                                  }
                                  className={
                                    task.status === "approved"
                                      ? "bg-green-500 hover:bg-green-600"
                                      : task.status === "pending"
                                        ? "bg-blue-500 hover:bg-blue-600"
                                        : "border-orange-500 text-orange-500"
                                  }
                                >
                                  {task.status.replace("_", " ").toUpperCase()}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={
                                    task.priority === "high"
                                      ? "border-red-500 text-red-500"
                                      : task.priority === "medium"
                                        ? "border-yellow-500 text-yellow-500"
                                        : "border-green-500 text-green-500"
                                  }
                                >
                                  {task.priority?.toUpperCase() || "MEDIUM"}
                                </Badge>
                              </div>

                              <p className="text-sm text-muted-foreground mb-2">
                                {task.description}
                              </p>

                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>
                                  Created: {new Date(task.createdAt).toLocaleDateString()}
                                </span>
                                {task.dueDate && (
                                  <span>
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>

                            <Link href={`/team/organizations/${id}/tasks/${task.id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media">
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex items-center justify-between flex-row">
                  <div>
                    <CardTitle className="text-xl">Organization Media</CardTitle>
                    <CardDescription className="text-base">Grouped by type from task activities and gallery</CardDescription>
                  </div>

                  <div>
                    <Button
                      variant="default"
                      onClick={() => setOpen(true)}
                      disabled={uploadMutation.isPending}
                      className="gap-2"
                    >
                      {uploadMutation.isPending ? "Uploading..." : "Upload Media"}
                    </Button>

                    <Dialog.Root open={open} onOpenChange={setOpen}>
                      <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
                        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg focus:outline-none">
                          <div className="flex justify-between items-center mb-4">
                            <Dialog.Title className="text-lg font-semibold">
                              Upload Media Files
                            </Dialog.Title>
                            <Dialog.Close asChild>
                              <button className="p-1 rounded-full hover:bg-gray-100">
                                <X className="h-5 w-5 text-gray-600" />
                              </button>
                            </Dialog.Close>
                          </div>

                          <div className="space-y-4">
                            <input
                              type="file"
                              multiple
                              onChange={handleFileSelect}
                              className="block w-full text-sm text-gray-600 border border-dashed border-gray-300 rounded-md p-3 cursor-pointer"
                            />

                            {selectedFiles.length > 0 ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {selectedFiles.map((file, idx) => (
                                  <div
                                    key={idx}
                                    className="relative rounded-md overflow-hidden border bg-gray-100 p-1 flex flex-col items-center"
                                  >
                                    {file.type.startsWith("image/") ? (
                                      <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="h-24 w-full object-cover rounded-md"
                                      />
                                    ) : file.type.startsWith("video/") ? (
                                      <video
                                        src={URL.createObjectURL(file)}
                                        className="h-24 w-full object-cover rounded-md"
                                      />
                                    ) : (
                                      <div className="flex flex-col items-center justify-center h-24 w-full text-xs text-gray-500">
                                        <File className="h-6 w-6 mb-1" /> {file.name}
                                      </div>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => handleRemoveFile(idx)}
                                      className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-red-500 hover:text-white"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 text-center py-8">
                                No files selected yet
                              </p>
                            )}
                          </div>

                          <div className="mt-4 flex justify-end gap-2">
                            <Dialog.Close asChild>
                              <button className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
                                Cancel
                              </button>
                            </Dialog.Close>
                            <button
                              onClick={handleUpload}
                              disabled={selectedFiles.length === 0}
                              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                              {uploadMutation.isPending ? "Uploading..." : "Upload"}
                            </button>
                          </div>
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>
                  </div>
                </CardHeader>

                <CardContent>
                  {loadingMedia ? (
                    <div className="text-sm text-muted-foreground">Loading media...</div>
                  ) : (images.length === 0 && videos.length === 0 && pdfs.length === 0 && others.length === 0) ? (
                    <div className="col-span-full text-center py-12 space-y-3">
                      <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <File className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">No media found</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {images.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Images</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((img: any, idx: number) => (
                              <div key={idx} className="relative group overflow-hidden rounded-lg border bg-muted/30">
                                <img src={resolveUrl(img)} alt={resolveName(img)} className="h-40 w-full object-cover" />
                                <a href={resolveUrl(img)} download className="absolute top-2 right-2">
                                  <Button size="icon" variant="secondary">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {videos.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Videos</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {videos.map((vid: any, idx: number) => (
                              <div key={idx} className="rounded-lg border bg-muted/30 p-2">
                                <video src={resolveUrl(vid)} controls className="w-full rounded-md" />
                                <div className="flex justify-end mt-2">
                                  <a href={resolveUrl(vid)} download>
                                    <Button size="sm" variant="secondary" className="gap-2">
                                      <Download className="h-4 w-4" /> Download
                                    </Button>
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {pdfs.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">PDFs</span>
                          </div>
                          <div className="space-y-2">
                            {pdfs.map((pdf: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{resolveName(pdf)}</span>
                                </div>
                                <a href={resolveUrl(pdf)} download>
                                  <Button size="sm" variant="secondary" className="gap-2">
                                    <Download className="h-4 w-4" /> Download
                                  </Button>
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {others.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Other Files</span>
                          </div>
                          <div className="space-y-2">
                            {others.map((file: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                                <div className="flex items-center gap-2">
                                  <File className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{resolveName(file)}</span>
                                </div>
                                <a href={resolveUrl(file)} download>
                                  <Button size="sm" variant="secondary" className="gap-2">
                                    <Download className="h-4 w-4" /> Download
                                  </Button>
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}


// <div className="space-y-3">
//               {organizationTasks.length === 0 ? (
//                 <div className="text-center py-12 space-y-3">
//                   <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
//                     <FileText className="h-8 w-8 text-muted-foreground" />
//                   </div>
//                   <p className="text-sm text-muted-foreground">No tasks found for this organization</p>
//                 </div>
//               ) : (
//                 organizationTasks.map((task) => (
//                   <div
//                     key={task.id}
//                     className="group flex items-start justify-between rounded-xl border bg-muted/30 p-4 hover:bg-muted/50 hover:border-primary/50 transition-all"
//                   >
//                     <div className="space-y-2 flex-1">
//                       <div className="flex items-start justify-between">
//                         <div>
//                           <p className="font-semibold text-base">{task.title}</p>
//                           <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                         <div className="flex items-center gap-1">
//                           <Calendar className="h-3.5 w-3.5" />
//                           Due: {task.dueDate.toLocaleDateString()}
//                         </div>
//                         <div className="flex items-center gap-1">
//                           Assigned to: {task.assignedToName}
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <Badge
//                           variant={
//                             task.status === "completed"
//                               ? "default"
//                               : task.status === "in_progress"
//                                 ? "secondary"
//                                 : "outline"
//                           }
//                         >
//                           {task.status.replace("_", " ")}
//                         </Badge>
//                         <Badge
//                           variant={
//                             task.priority === "high"
//                               ? "destructive"
//                               : task.priority === "medium"
//                                 ? "default"
//                                 : "secondary"
//                           }
//                         >
//                           {task.priority}
//                         </Badge>
//                       </div>
//                     </div>
//                     <Link href={`/team/organizations/${organization.id}/tasks/${task.id}`}>
//                       <Button variant="ghost" size="sm" className="gap-2 group-hover:gap-3 transition-all">
//                         View Details
//                         <ArrowRight className="h-4 w-4" />
//                       </Button>
//                     </Link>
//                   </div>
//                 ))
//               )}
//             </div>
