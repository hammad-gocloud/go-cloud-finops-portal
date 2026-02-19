'use client'
import { redirect } from "next/navigation"
import Link from "next/link"
import { NavHeader } from "@/components/nav-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Building2, Calendar, FileText, Mail, Users } from "lucide-react"
import { MOCK_ORGANIZATIONS, MOCK_PLANS, MOCK_TEMPLATES, MOCK_TEAM_MEMBERS } from "@/lib/mock-data"
import { useAuth } from "@/app/contexts/AuthContext"

interface PageProps {
  params: {
    id: string
  }
}

export default async function OrganizationDetailsPage({ params }: PageProps) {
  const { user } = useAuth()

  if ( !user) {
    redirect("/login")
  }

  const organization = MOCK_ORGANIZATIONS.find((org) => org.id === params.id)
  if (!organization) {
    redirect("/admin/organizations")
  }

  const plan = MOCK_PLANS.find((p) => p.id === organization.planId)
  const templates = MOCK_TEMPLATES.filter((t) => t.organizationId === organization.id)
  const teamMembers = MOCK_TEAM_MEMBERS.filter((m) => m.teamId === organization.teamId)

  const statusColor = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    inactive: "bg-gray-100 text-gray-800",
  }[organization.status]

  return (
    <div className="min-h-screen bg-background">
      <NavHeader user={user} title={organization.name} />
      <main className="p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/organizations">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl font-bold tracking-tight">{organization.name}</h2>
                  <Badge variant="secondary" className={statusColor}>
                    {organization.status.charAt(0).toUpperCase() + organization.status.slice(1)}
                  </Badge>
                </div>
                <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {organization.email}
                </p>
              </div>
            </div>
            <div className="space-x-3">
              <Button variant="outline">Edit Organization</Button>
              {organization.status === "active" ? (
                <Button variant="destructive">Deactivate</Button>
              ) : (
                <Button variant="default">Activate</Button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Plan</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{plan?.name || "Unknown"}</div>
                <p className="text-xs text-muted-foreground">${plan?.price}/month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organization.memberCount}</div>
                <p className="text-xs text-muted-foreground">
                  {teamMembers.length} active team members
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Templates</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{templates.length}</div>
                <p className="text-xs text-muted-foreground">
                  {templates.filter((t) => t.status === "published").length} published
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {organization.joinedAt.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.floor(
                    (new Date().getTime() - organization.joinedAt.getTime()) /
                      (1000 * 60 * 60 * 24 * 30)
                  )}{" "}
                  months
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Manage organization settings and view activity</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="team">Team Members</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Subscription Details</h4>
                      <div className="rounded-lg border p-4">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Plan</p>
                            <p className="font-medium">{plan?.name || "Unknown"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Monthly Cost</p>
                            <p className="font-medium">${plan?.price || 0}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Posts Per Month</p>
                            <p className="font-medium">{plan?.postsPerMonth || 0}</p>
                          </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Plan Features</h5>
                          <ul className="list-inside list-disc space-y-1">
                            {plan?.features.map((feature) => (
                              <li key={feature} className="text-sm text-muted-foreground">
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-medium">Platform Settings</h4>
                      <div className="rounded-lg border p-4">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Platform</p>
                            <p className="font-medium">{organization.platformName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant="secondary" className={statusColor}>
                              {organization.status}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Team Size</p>
                            <p className="font-medium">{organization.memberCount} members</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="team" className="space-y-4">
                  {/* Add team members list here */}
                  <div className="rounded-lg border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-3 text-left text-sm">Name</th>
                          <th className="p-3 text-left text-sm">Email</th>
                          <th className="p-3 text-left text-sm">Role</th>
                          <th className="p-3 text-left text-sm">Status</th>
                          <th className="p-3 text-left text-sm">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamMembers.map((member) => (
                          <tr key={member.id} className="border-b">
                            <td className="p-3">{member.name}</td>
                            <td className="p-3 text-muted-foreground">{member.email}</td>
                            <td className="p-3">
                              <Badge variant="outline">{member.role}</Badge>
                            </td>
                            <td className="p-3">
                              <Badge
                                variant={member.status === "active" ? "default" : "secondary"}
                              >
                                {member.status}
                              </Badge>
                            </td>
                            <td className="p-3 text-muted-foreground">
                              {member.joinedAt.toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="templates" className="space-y-4">
                  {/* Add templates list here */}
                  <div className="rounded-lg border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-3 text-left text-sm">Content</th>
                          <th className="p-3 text-left text-sm">Status</th>
                          <th className="p-3 text-left text-sm">Created</th>
                          <th className="p-3 text-left text-sm">Published</th>
                        </tr>
                      </thead>
                      <tbody>
                        {templates.map((template) => (
                          <tr key={template.id} className="border-b">
                            <td className="p-3">
                              {template.content.length > 50
                                ? template.content.slice(0, 50) + "..."
                                : template.content}
                            </td>
                            <td className="p-3">
                              <Badge
                                variant={
                                  template.status === "published"
                                    ? "default"
                                    : template.status === "rejected"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {template.status}
                              </Badge>
                            </td>
                            <td className="p-3 text-muted-foreground">
                              {template.createdAt.toLocaleDateString()}
                            </td>
                            <td className="p-3 text-muted-foreground">
                              {template.publishedAt
                                ? template.publishedAt.toLocaleDateString()
                                : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="billing" className="space-y-4">
                  {/* Add billing information here */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Current Plan</CardTitle>
                        <CardDescription>
                          Your subscription plan and billing details
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Plan</p>
                              <p className="font-medium">{plan?.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Monthly Cost</p>
                              <p className="font-medium">${plan?.price}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Billing Cycle</p>
                              <p className="font-medium">Monthly</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Next Invoice</p>
                              <p className="font-medium">
                                {new Date(
                                  new Date().setMonth(new Date().getMonth() + 1)
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Separator />
                          <Button variant="outline">Change Plan</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}