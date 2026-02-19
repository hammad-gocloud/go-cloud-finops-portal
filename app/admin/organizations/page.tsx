'use client'
import {  useRouter } from "next/navigation"
import { NavHeader } from "@/components/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Plus, Users, FileText, TrendingUp, ArrowLeft } from "lucide-react"
import { OrganizationCard } from "@/components/organizations/organization-card"
import Link from "next/link"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import useGetOrganizations from "@/hooks/useGetOrganizations"
import Loader from "@/components/loader"
import http from "@/src/api"
import axios from "axios"

export default function OrganizationsPage() {


  const { user, isLoading: authLoading, isAuthorized } = useProtectedRoute({ 
    requirePlatformRole: true,
    redirectTo: "/login"
  })
  const { organizations, isLoading } = useGetOrganizations()

  if (authLoading) {
    return <Loader title="Loading..." subtitle="Please wait while we authenticate you" />
  }

  if (!isAuthorized) {
    return <Loader title="Unauthorized" subtitle="Redirecting to login..." />
  }

  if (isLoading) {
    return <Loader />
  }

  // Group organizations by status
  const activeOrgs = organizations?.filter((org) => org.status === "active") || []
  const inactiveOrgs = organizations?.filter((org) => org.status === "inactive") || []
  const pendingOrgs = organizations?.filter((org) => org.status === "pending") || []
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <NavHeader user={user} title="Organizations" />

         <div className="mt-4 ml-16">
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

      <main className="p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight">Organizations</h2>
              <p className="text-lg text-muted-foreground">
                Manage organizations and their content plans
              </p>
            </div>
            <div className="flex items-center gap-2">
             
              <Link href="/admin/organizations/new">
                <Button size="lg" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Organization
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organizations?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {activeOrgs.length} active, {pendingOrgs.length} pending
                </p>
              </CardContent>
            </Card>
            {/* Add more stat cards as needed */}
          </div>

          {/* Organizations List */}
          <Card>
            <CardHeader>
              <CardTitle>All Organizations</CardTitle>
              <CardDescription>View and manage all connected organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="active">
                    Active ({activeOrgs.length})
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({pendingOrgs.length})
                  </TabsTrigger>
                  <TabsTrigger value="inactive">
                    Inactive ({inactiveOrgs.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                  {activeOrgs.length > 0 ? (
                    activeOrgs.map((org) => (
                      <OrganizationCard
                        key={org.id}
                        id={org.id.toString()}
                        name={org.name}
                        status={org.status}
                        email={org.email}
                        createdAt={org.createdAt}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No active organizations yet</p>
                      <p className="text-sm">Create your first organization to get started</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="pending" className="space-y-4">
                  {pendingOrgs.length > 0 ? (
                    pendingOrgs.map((org) => (
                      <OrganizationCard
                        key={org.id}
                        id={org.id.toString()}
                        name={org.name}
                        status={org.status}
                        email={org.email}
                        createdAt={org.createdAt}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No pending organizations yet</p>
                      <p className="text-sm">Organizations awaiting approval will appear here</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="inactive" className="space-y-4">
                  {inactiveOrgs.length > 0 ? (
                    inactiveOrgs.map((org) => (
                      <OrganizationCard
                        key={org.id}
                        id={org.id.toString()}
                        name={org.name}
                        status={org.status}
                        email={org.email}
                        createdAt={org.createdAt}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No inactive organizations yet</p>
                      <p className="text-sm">Deactivated organizations will appear here</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}