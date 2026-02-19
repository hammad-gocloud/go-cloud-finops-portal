'use client'
import { redirect, notFound, useParams } from "next/navigation"
import { NavHeader } from "@/components/nav-header"
import { MOCK_TEAMS } from "@/lib/mock-data"
import { AddTeamMemberForm } from "@/components/add-team-member-form"
import { useAuth } from "@/app/contexts/AuthContext"
import useGetTeam from "@/hooks/useGetTeam"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default  function AddTeamMemberPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const {team,isLoading} = useGetTeam(id)
  const { user } = useAuth()
  if ( !user) {
    redirect("/login")
  }



  return (
    <div className="min-h-screen bg-background">
      <NavHeader user={user} title="Add Team Member" />
       <div className="ml-8 mt-8">
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      <main className="p-6">
        <div className="mx-auto max-w-2xl">
          <AddTeamMemberForm teamId={team?.id} teamName={team?.name} />
        </div>
      </main>
    </div>
  )
}