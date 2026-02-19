'use client'
import { useRouter } from "next/navigation"
import { NavHeader } from "@/components/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MOCK_ORGANIZATIONS, MOCK_TEAMS, MOCK_TEAM_MEMBERS } from "@/lib/mock-data"
import { Users, Building2, Briefcase, TrendingUp, Plus, ArrowRight, CheckSquare } from "lucide-react"
import Link from "next/link"
import { useAuth } from "../contexts/AuthContext"
import useGetOrganizations from "@/hooks/useGetOrganizations"
import Loader from "@/components/loader"
import useGetTeams from "@/hooks/useGetTeams"
import useGetTasks from "@/hooks/useGetTasks"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"


export default function AdminDashboard() {
  const { user, isLoading: authLoading, isAuthorized } = useProtectedRoute({ 
    requirePlatformRole: true 
  })
  const { organizations, isLoading: loadingOrganizations } = useGetOrganizations()
  const { teams, isLoading: loadingTeams } = useGetTeams()
  // const { tasks, isLoading: loadingTasks } = useGetTasks()
  
  console.log("Authenticated user:", user)
  
  // Show loading while authentication is being determined
  if (authLoading) {
    return <Loader title="Loading..." subtitle="Please wait while we verify your authentication" />
  }

  // If not authorized, the hook will handle the redirect
  if (!isAuthorized) {
    return <Loader title="Redirecting..." subtitle="Please wait while we redirect you to login" />
  }
  if (loadingOrganizations || loadingTeams) {
    return <Loader title="Loading dashboard data..." subtitle="Please wait while we fetch the organizations, teams, and tasks" />
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <NavHeader user={user} title="Super Admin Dashboard" />
      <main className="p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight text-balance">Platform Overview</h2>
            <p className="text-lg text-muted-foreground">Manage your social media platform and teams</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-none shadow-lg bg-gradient-to-br from-card to-primary/5 hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Total Organizations</CardTitle>
                <div className="rounded-full bg-primary/10 p-2.5">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold tracking-tight">0</div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
                  0 active
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-card to-secondary/5 hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Social Media Teams</CardTitle>
                <div className="rounded-full bg-secondary/10 p-2.5">
                  <Briefcase className="h-5 w-5 text-secondary" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold tracking-tight">0</div>
                <p className="text-sm text-muted-foreground">Active teams</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-card to-accent/5 hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Team Members</CardTitle>
                <div className="rounded-full bg-accent/10 p-2.5">
                  <Users className="h-5 w-5 text-accent" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold tracking-tight">0</div>
                <p className="text-sm text-muted-foreground">Total members</p>
              </CardContent>
            </Card>

            {/* <Card className="border-none shadow-lg bg-gradient-to-br from-card to-chart-5/5 hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Total Tasks</CardTitle>
                <div className="rounded-full bg-chart-5/10 p-2.5">
                  <CheckSquare className="h-5 w-5 text-chart-5" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold tracking-tight text-chart-5">{tasks?.length || 0}</div>
                <p className="text-sm text-muted-foreground">
                  {tasks?.filter(task => task.status === 'approved').length || 0} completed
                </p>
              </CardContent>
            </Card> */}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Social Media Teams</CardTitle>
                    <CardDescription className="text-base">Manage your content creation teams</CardDescription>
                  </div>
                  <Link href="/admin/teams/new">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      New Team
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teams && teams.length > 0 ? (
                    teams.map((team) => {

                      return (
                        <div
                          key={team.id}
                          className="group flex items-center justify-between rounded-xl border bg-muted/30 p-4 hover:bg-muted/50 hover:border-primary/50 transition-all"
                        >
                          <div className="space-y-1">
                            <p className="font-semibold text-base">{team.name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5" />
                              {team.memberCount} {team.memberCount === 1 ? "member" : "members"}
                            </p>
                          </div>
                          <Link href={`/admin/teams/${team.id}`}>
                            <Button variant="ghost" size="sm" className="gap-2 group-hover:gap-3 transition-all">
                              View
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No teams yet</p>
                      <p className="text-sm">Create your first team to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Recent Organizations</CardTitle>
                    <CardDescription className="text-base">Organizations using the platform</CardDescription>
                  </div>
                  <Link href="/admin/organizations/new">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      New Organization
                    </Button>
                  </Link>
                </div>

              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {organizations && organizations.length > 0 ? (
                    organizations.map((org) => (
                      <div
                        key={org.id}
                        className="group flex items-center justify-between rounded-xl border bg-muted/30 p-4 hover:bg-muted/50 hover:border-primary/50 transition-all"
                      >
                        <div className="space-y-1">
                          <p className="font-semibold text-base">{org.name}</p>
                          <p className="text-sm text-muted-foreground">{org.email}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${org.status === "active" ? "bg-primary/10 text-primary" : "bg-chart-5/10 text-chart-5"
                            }`}
                        >
                          {org.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No organizations yet</p>
                      <p className="text-sm">Create your first organization to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Task Management</CardTitle>
                    <CardDescription className="text-base">Manage tasks across all organizations</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/admin/tasks">
                      <Button variant="outline" size="sm" className="gap-2">
                        View All
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/admin/tasks/new">
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Task
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks && tasks.length > 0 ? (
                    tasks.slice(0, 3).map((task) => {
                      const getStatusColor = (status: string) => {
                        switch (status) {
                          case "completed": return "bg-green-100 text-green-800"
                          case "in_progress": return "bg-blue-100 text-blue-800"
                          case "pending": return "bg-gray-100 text-gray-800"
                          default: return "bg-gray-100 text-gray-800"
                        }
                      }

                      return (
                        <div
                          key={task.id}
                          className="group flex items-center justify-between rounded-xl border bg-muted/30 p-4 hover:bg-muted/50 hover:border-primary/50 transition-all"
                        >
                          <div className="space-y-1">
                            <p className="font-semibold text-base">{task.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusColor(task.status)}`}
                          >
                            {task.status}
                          </span>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No tasks yet</p>
                      <p className="text-sm">Create your first task to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </main>
    </div>
  )
}
