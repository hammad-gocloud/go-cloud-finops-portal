'use client'
import { redirect, notFound } from "next/navigation"
import { NavHeader } from "@/components/nav-header"
import { MOCK_TEMPLATES, MOCK_ORGANIZATIONS } from "@/lib/mock-data"
import { TemplateDetailView } from "@/components/template-detail-view"
import { useAuth } from "@/app/contexts/AuthContext"

export default async function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth()

  if ( !user) {
    redirect("/login")
  }

  const { id } = await params
  const template = MOCK_TEMPLATES.find((t) => t.id === id)

  if (!template) {
    notFound()
  }


  const organization = MOCK_ORGANIZATIONS.find((org) => org.id === template.organizationId)

  return (
    <div className="min-h-screen bg-background">
      <NavHeader user={user} title="Template Details" />
      <main className="p-6">
        <div className="mx-auto max-w-3xl">
          <TemplateDetailView template={template} organization={organization} />
        </div>
      </main>
    </div>
  )
}
