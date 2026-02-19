import { redirect, notFound } from "next/navigation"

import { NavHeader } from "@/components/nav-header"
import { MOCK_TEMPLATES, MOCK_ORGANIZATIONS } from "@/lib/mock-data"
import { PublishTemplateForm } from "@/components/publish-template-form"
import { useAuth } from "@/app/contexts/AuthContext"

export default async function PublishTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { user} = useAuth()

  if (!user) {
    redirect("/login")
  }

  const { id } = await params
  const template = MOCK_TEMPLATES.find((t) => t.id === id)

  if (!template) {
    notFound()
  }


  if (template.status !== "approved") {
    redirect(`/team/templates/${template.id}`)
  }

  const organization = MOCK_ORGANIZATIONS.find((org) => org.id === template.organizationId)

  return (
    <div className="min-h-screen bg-background">
      <NavHeader user={user} title="Publish Template" />
      <main className="p-6">
        <div className="mx-auto max-w-3xl">
          <PublishTemplateForm template={template} organization={organization} />
        </div>
      </main>
    </div>
  )
}
