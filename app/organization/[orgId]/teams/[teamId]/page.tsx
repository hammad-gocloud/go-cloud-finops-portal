"use client"
import { useParams } from "next/navigation"
import { NavHeader } from "@/components/nav-header"
import Loader from "@/components/loader"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import useGetTeam from "@/hooks/useGetTeam"
import { TeamDetails } from "@/components/team-details"

export default function OrganizationTeamDetailsPage() {
  const { user, isLoading: authLoading, isAuthorized } = useProtectedRoute()
  const params = useParams()
  const orgId = params.orgId as string
  const teamId = params.teamId as string

  const { team, isLoading } = useGetTeam(teamId)

  if (authLoading) {
    return <Loader title="Loading..." subtitle="Please wait while we verify your authentication" />
  }

  if (!isAuthorized) {
    return <Loader title="Redirecting..." subtitle="Please wait while we redirect you to login" />
  }

  if (isLoading) {
    return <Loader title="Loading Team" subtitle="Please wait while we fetch the team" />
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader user={user} title="Team Details" />
      <main className="p-6">
        <div className="mx-auto max-w-5xl">
          <TeamDetails
            team={team}
            members={team?.members}
            backHref={`/organization/${orgId}`}
            addMemberHref={`/organization/${orgId}/teams/${team?.id}/members/add`}
          />
        </div>
      </main>
    </div>
  )
}