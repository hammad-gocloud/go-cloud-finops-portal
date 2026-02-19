'use client'
import { NavHeader } from "@/components/nav-header"
import { Card } from "@/components/ui/card"
import { CreateOrganizationForm } from "@/components/organizations/create-organization-form"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import Loader from "@/components/loader"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"



export default function NewOrganizationPage() {
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
      <NavHeader user={user} title="Add New Organization" />
      <main className="p-8">
        <div className="mb-4">
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 space-y-2">
            <h2 className="text-4xl font-bold tracking-tight">Add New Organization</h2>
            <p className="text-lg text-muted-foreground">
              Create a new organization and set up their initial configuration
            </p>
          </div>
          <Card className="p-6">
            <CreateOrganizationForm />
          </Card>
        </div>
      </main>
    </div>
  )
}