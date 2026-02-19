'use client'
import { redirect, notFound, useRouter, useParams } from "next/navigation"
import { NavHeader } from "@/components/nav-header"
import { MOCK_TEAMS, MOCK_TEAM_MEMBERS } from "@/lib/mock-data"
import { TeamDetails } from "@/components/team-details"
import { TeamMember } from "@/lib/types"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import useGetTeam from "@/hooks/useGetTeam"
import Loader from "@/components/loader"

export default  function Page() {

  const params = useParams()
  const id = params.id as string

  const { user, isLoading: authLoading, isAuthorized } = useProtectedRoute({ 
    requirePlatformRole: true,
    redirectTo: "/login"
  })

  if (authLoading) {
    return <Loader title="Loading..." subtitle="Please wait while we authenticate you" />
  }

  if (!isAuthorized) {
    return <Loader title="Unauthorized" subtitle="Redirecting to login..." />
  }

  const {team,isLoading} = useGetTeam(id)
  if (isLoading) {
    return <Loader title="Loading Team" subtitle="Please wait while we fetch the team"/>
  }



  return (
    <div className="min-h-screen bg-background">
      <NavHeader user={user} title="Team Details" />
      <main className="p-6">
        <div className="mx-auto max-w-5xl">
          <TeamDetails team={team} members={team?.members} />
        </div>
      </main>
    </div>
  )
}