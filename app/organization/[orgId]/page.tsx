'use client'
import { redirect, useRouter } from "next/navigation"
import { NavHeader } from "@/components/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import * as Dialog from "@radix-ui/react-dialog";

import { FileText, ArrowRight, Calendar, AlertCircle, ArrowLeft, Users, Filter } from "lucide-react"
import Link from "next/link"
import useGetOrganizationByUser from "@/hooks/useGetOrganizationsByUser"
import useGetTasksByOrganization from "@/hooks/useGetTasksByOrganization"
import Loader from "@/components/loader"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import useGetMediaOfOrganization from "@/hooks/useGetMediaOfOrganization"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, Video, File, Download } from "lucide-react"
import { useParams } from "next/navigation"
import useGetOrganization from "@/hooks/useGetOrganization"
import useGetTeamsByOrganization from "@/hooks/useGetTeamsByOrganization"
import OrganizationTeamCard from "@/components/organization-team-card"
import useUploadOrganizationMedia from "@/hooks/useUploadOrganizationMedia"
import { useState } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



export default function OrganizationDashboard() {
  const uploadMutation = useUploadOrganizationMedia()
  const [statusFilter, setStatusFilter] = useState<string | null>("")
  const [search, setSearch] = useState('')
  const [userId, setUserId] = useState<number | null>(null)

  const { user, isLoading: authLoading, isAuthorized } = useProtectedRoute()
  const params = useParams()
  const orgId = params.orgId as string
  const { organization, isLoading: loadingOrganization } = useGetOrganization(orgId)
  const { TasksByOrganization, isLoading: loadingTasks } = useGetTasksByOrganization(organization?.id || "", statusFilter, search, userId ? String(userId) : undefined)
  const { organization: orgMedia, isLoading: loadingMedia } = useGetMediaOfOrganization(Number(organization?.id ?? 0))
  const { organizationTeams, isLoading: loadingOrgTeams } = useGetTeamsByOrganization(Number(organization?.id ?? 0))

  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  // handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const newFiles = Array.from(e.target.files)
    // prevent duplicates by name + size
    setSelectedFiles((prev) => {
      const existing = new Set(prev.map(f => `${f.name}-${f.size}`))
      const unique = newFiles.filter(f => !existing.has(`${f.name}-${f.size}`))
      return [...prev, ...unique]
    })
    e.target.value = "" // reset input
  }

  // remove a file from selection
  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // upload selected files
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return
    try {
      await uploadMutation.mutateAsync({
        organizationId: Number(orgId),
        files: selectedFiles,
      })
      setSelectedFiles([])
      setOpen(false)
    } catch (err) {
      console.error("Upload failed", err)
    }
  }

  // Show loading while authentication is being determined
  if (authLoading) {
    return <Loader title="Loading..." subtitle="Please wait while we verify your authentication" />
  }

  // If not authorized, the hook will handle the redirect
  if (!isAuthorized) {
    return <Loader title="Redirecting..." subtitle="Please wait while we redirect you to login" />
  }



  if (!organization) {
    return <div>Organization not found</div>
  }


  const handleFilterChange = (value: string) => {
    if (value === "assginedToMe") {
      setUserId(user?.id || null)
      setStatusFilter("")
    }
    else if (value === "all") {
      setUserId(null)
      setStatusFilter("")
    }
    else {
      setUserId(null)
      setStatusFilter(value)
    }
  }

  const organizationTasks = TasksByOrganization || []

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




  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <NavHeader user={user} title="Organization Portal" />
      <main className="p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/organization" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Organizations
                  </Link>
                </Button>
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-balance">{organization.name}</h2>
              <p className="text-lg text-muted-foreground">Each organization has a single team. Manage tasks, media, and members.</p>
            </div>
            {!loadingOrgTeams && (!organizationTeams || organizationTeams.length === 0) && (
              <div className="flex gap-2">
                <Button asChild>
                  <Link href={`/organization/${orgId}/teams/new`} className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Create Team
                  </Link>
                </Button>
              </div>
            )}
          </div>



          <Tabs defaultValue="tasks" className="w-full">
            <TabsList>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="teams">Team</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <CardTitle className="text-xl">Organization Tasks</CardTitle>
                      <CardDescription className="text-base">
                        Tasks assigned to your organization
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <Tabs 
                    value={statusFilter || "all"} 
                    onValueChange={(value) => handleFilterChange(value)}
                    className="w-full"
                  >
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <TabsList className="flex-1 justify-start flex-wrap h-auto">
                        <TabsTrigger value="all">All Tasks</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                        <TabsTrigger value="internal_review">Internal Review</TabsTrigger>
                        <TabsTrigger value="ready_to_publish">Ready to Publish</TabsTrigger>
                        <TabsTrigger value="published">Published</TabsTrigger>
                        <TabsTrigger value="assigned_to_designer">Assigned to Designer</TabsTrigger>
                      </TabsList>
                      
                      <Input
                        placeholder="Search in tasks"
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-[250px]"
                      />
                    </div>

                    <div>
                      {loadingOrganization || loadingTasks ? (
                        <div className="py-10">
                          <Loader
                            title="Loading Dashboard..."
                            subtitle="Please wait while we fetch your data"
                          />
                        </div>
                      ) : organizationTasks.length === 0 ? (
                        <div className="text-center py-12 space-y-3">
                          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">No tasks found</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left border-collapse">
                            <thead>
                              <tr className="border-b text-muted-foreground">
                                <th className="py-3 px-4 font-medium">Title</th>
                                <th className="py-3 px-4 font-medium">Description</th>
                                <th className="py-3 px-4 font-medium">Assigned To</th>
                                <th className="py-3 px-4 font-medium">Due Date</th>
                                <th className="py-3 px-4 font-medium">Status</th>
                                <th className="py-3 px-4 font-medium">Priority</th>
                              </tr>
                            </thead>
                            <tbody>
                              {organizationTasks.map((task) => (
                                <tr
                                  key={task.id}
                                  onClick={() => router.push(`/organization/tasks/${task.id}`)}
                                  className="border-b hover:bg-muted/40 transition-colors cursor-pointer"
                                >
                                  <td className="py-3 px-4 font-semibold">{task.title}</td>
                                  <td className="py-3 px-4 text-muted-foreground truncate max-w-xs">
                                    {task.description}
                                  </td>
                                  <td className="py-3 px-4 text-muted-foreground">
                                    {task?.assignedToMember?.user?.fullName || "Unassigned"}
                                  </td>
                                  <td className="py-3 px-4 text-muted-foreground flex items-center gap-2">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {task.dueDate
                                      ? new Date(task.dueDate).toLocaleDateString()
                                      : "No due date"}
                                  </td>
                                  <td className="py-3 px-4">
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
                                  </td>
                                  <td className="py-3 px-4">
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
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </Tabs>
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
                      {/* <Dialog.Trigger asChild>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                          Upload Media
                        </button>
                      </Dialog.Trigger> */}

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
                              // disabled={isUploading || selectedFiles.length === 0}
                              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                              {/* {isUploading ? "Uploading..." : "Upload"} */}
                              upload
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
                  ) : (images.length === 0 ? (
                    <div className="col-span-full text-center py-12 space-y-3">
                      <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <File className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">No media found</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="flex items-center gap-2">
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
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="teams">
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">Organization Team</CardTitle>
                  <CardDescription className="text-base">This organization can have only one team. Create it and manage members.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingOrgTeams ? (
                    <div className="text-sm text-muted-foreground">Loading teams...</div>
                  ) : organizationTeams && organizationTeams.length > 0 ? (
                    <div className="space-y-4">
                      {organizationTeams.map((team: any) => (
                        <OrganizationTeamCard key={team.id} team={team} orgId={String(orgId)} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-3">
                      <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">No team exists for this organization</p>
                      <div className="flex justify-center">
                        <Link href={`/organization/${orgId}/teams/new`}>
                          <Button>Create Team</Button>
                        </Link>
                      </div>
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
