"use client"

import { useAuth } from "@/app/contexts/AuthContext"
import { OrganizationCard } from "@/components/organizations/organization-card"
import Loader from "@/components/loader"
import useGetTeamMemberByUserId from "@/hooks/useGetTeamMemberByUserId"
import useGetOrganizationsByTeam from "@/hooks/useGetOrganizationsByTeam"
import { Building2, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { NavHeader } from "@/components/nav-header"

export default function TeamDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()


  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [authLoading, user, router])


  const userId = user?.id
  const { teamMember, isLoading: teamMemberLoading } = useGetTeamMemberByUserId(userId)
  const teamId = teamMember?.teamId
  const { teamOrganizations, isLoading: organizationsLoading } = useGetOrganizationsByTeam(teamId)

  if (authLoading || teamMemberLoading || organizationsLoading) {
    return (
      <Loader
        title="Loading your team data"
        subtitle="Fetching team and assigned organizations"
      />
    )
  }


  // 5️⃣ Handle no auth
  if (!authLoading && !user) {
    return null
  }

  const handleOrganizationClick = (organizationId: string) => {
    router.push(`/team/organizations/${organizationId}`)
  }


  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <NavHeader user={user} title="Team Member Dashboard" />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Team Dashboard</h1>
            <p className="text-muted-foreground">
              Manage organizations assigned to your team
            </p>
          </div>

          {teamOrganizations?.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Organizations Assigned</h2>
              <p className="text-muted-foreground">
                Your team doesn't have any organizations assigned yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamOrganizations?.map((organization) => (
                <div
                  key={organization.id}
                  onClick={() => handleOrganizationClick(organization?.id.toString())}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <OrganizationCard
                    id={organization.id.toString()}
                    name={organization.name}
                    status={organization.status}
                    email={organization.email}
                    createdAt={organization.createdAt?.toString()}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </>

  )
}