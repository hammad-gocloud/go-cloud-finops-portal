"use client"

import { useParams } from "next/navigation"
import { NavHeader } from "@/components/nav-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import Loader from "@/components/loader"
import useGetTeam from "@/hooks/useGetTeam"
import { AddTeamMemberForm } from "@/components/add-team-member-form"

export default function AddTeamMemberPage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <NavHeader user={user} title="Add Team Member" />
      <main className="p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href={`/organization/${orgId}`} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Organization
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <Loader title="Loading Team..." subtitle="Fetching team details" />
          ) : (
            <AddTeamMemberForm teamId={Number(teamId)} teamName={team?.name} organizationId={Number(orgId)} />
          )}
        </div>
      </main>
    </div>
  )
}