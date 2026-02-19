'use client'
import { useRouter } from "next/navigation"
import { NavHeader } from "@/components/nav-header"
import { CreateTeamForm } from "@/components/create-team-form"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import Loader from "@/components/loader"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"


export default function NewTeamPage() {
  const { user, isLoading: authLoading, isAuthorized } = useProtectedRoute({ 
    requirePlatformRole: true,
    redirectTo: "/login"
  })
  const router = useRouter()

  if (authLoading) {
    return <Loader title="Loading..." subtitle="Please wait while we authenticate you" />
  }

  if (!isAuthorized) {
    return <Loader title="Unauthorized" subtitle="Redirecting to login..." />
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader user={user} title="Create New Team" />
      <main className="p-6">
        <div className="mb-4">
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="mx-auto max-w-2xl">
          <CreateTeamForm />
        </div>
      </main>
    </div>
  )
}
