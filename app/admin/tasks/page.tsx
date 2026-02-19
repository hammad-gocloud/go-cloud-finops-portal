'use client'

import { useRouter } from "next/navigation"
import { NavHeader } from "@/components/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar, User, Building2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/app/contexts/AuthContext"
import useGetTasks from "@/hooks/useGetTasks"
import useGetOrganizations from "@/hooks/useGetOrganizations"
import useGetTeamMembers from "@/hooks/useGetTeamMembers"
import Loader from "@/components/loader"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"

export default function AdminTasksPage() {
  const { user, isLoading: authLoading, isAuthorized } = useProtectedRoute({ 
    requirePlatformRole: true
  })

  // Fetch real data from the database
  const { tasks, isLoading: loadingTasks } = useGetTasks()
  const {organizations, isLoading: loadingOrganizations } = useGetOrganizations()

  // Show loading while authentication is being determined
  if (authLoading) {
    return <Loader title="Loading..." subtitle="Please wait while we verify your authentication" />
  }

  // If not authorized, the hook will handle the redirect
  if (!isAuthorized) {
    return <Loader title="Redirecting..." subtitle="Please wait while we redirect you to login" />
  }

  // Show loading state while data is being fetched
  if (loadingTasks || loadingOrganizations ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <NavHeader user={user} title="Task Management" />
        <main className="p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Loading tasks, organizations, and team members...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Filter tasks by status
  const pendingTasks = tasks?.filter(task => task.status === "pending") || []
  const inProgressTasks = tasks?.filter(task => task.status === "approved") || []
  const completedTasks = tasks?.filter(task => task.status === "approved") || []

  const getOrganizationName = (orgId: number) => {
    const org = organizations?.find(o => o.id === orgId)
    return org?.name || "Unknown Organization"
  }



  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200"
      case "in_progress": return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending": return "bg-gray-100 text-gray-800 border-gray-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const TaskCard = ({ task }: { task: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg">{task.title}</h3>
            <div className="flex gap-2">
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Badge className={getStatusColor(task.status)}>
                {task.status}
              </Badge>
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm line-clamp-2">
            {task.description}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {getOrganizationName(task.organizationId)}
            </div>
            {task.assignedToTeamMember && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {task.assignedToTeamMember?.user?.fullName || "Unknown Member"}
              </div>
            )}
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <NavHeader user={user} title="Task Management" />
      <main className="p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Task Management</h1>
              <p className="text-lg text-muted-foreground">
                View and manage all tasks across organizations
              </p>
            </div>
            <Link href="/admin/tasks/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Task
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Pending Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pendingTasks.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{inProgressTasks.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{completedTasks.length}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Tasks ({tasks?.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress ({inProgressTasks.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {tasks?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first task to get started</p>
                  <Link href="/admin/tasks/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Task
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tasks?.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {pendingTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No pending tasks</h3>
                  <p className="text-muted-foreground mb-4">Create your first task to get started</p>
                  <Link href="/admin/tasks/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Task
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pendingTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="in_progress" className="space-y-4">
              {inProgressTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No tasks in progress</h3>
                  <p className="text-muted-foreground mb-4">Create your first task to get started</p>
                  <Link href="/admin/tasks/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Task
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {inProgressTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No completed tasks</h3>
                  <p className="text-muted-foreground mb-4">Create your first task to get started</p>
                  <Link href="/admin/tasks/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Task
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {completedTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}