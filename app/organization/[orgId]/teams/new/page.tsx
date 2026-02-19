'use client'
import { useRouter, useParams } from "next/navigation"
import { NavHeader } from "@/components/nav-header"
import { CreateTeamForm } from "@/components/create-team-form"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import Loader from "@/components/loader"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import useGetOrganization from "@/hooks/useGetOrganization"

export default function NewOrganizationTeamPage() {
  const { user, isLoading: authLoading, isAuthorized } = useProtectedRoute("/login")
  const router = useRouter()
  const params = useParams()
  const orgId = params.orgId as string
  const { organization, isLoading: loadingOrganization } = useGetOrganization(orgId)

  if (authLoading || loadingOrganization) {
    return <Loader title="Loading..." subtitle="Please wait while we authenticate you" />
  }

  if (!isAuthorized) {
    return <Loader title="Unauthorized" subtitle="Redirecting to login..." />
  }

  if (!organization) {
    return <Loader title="Organization not found" subtitle="The requested organization could not be found" />
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader user={user} title={`Create Team for ${organization.name}`} />
      <main className="p-6">
        <div className="mb-4">
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back to {organization.name}
          </Button>
        </div>
        <div className="mx-auto max-w-2xl">
          <CreateTeamForm organizationId={organization.id} organizationName={organization.name} />
        </div>
      </main>
    </div>
  )
}