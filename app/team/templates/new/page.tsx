'use client'
import { redirect } from "next/navigation"

import { NavHeader } from "@/components/nav-header"
import { CreateTemplateForm } from "@/components/create-template-form"
import { useAuth } from "@/app/contexts/AuthContext"

export default async function NewTemplatePage() {
  const { user } = useAuth()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader user={user} title="Create Template" />
      <main className="p-6">
        <div className="mx-auto max-w-3xl">
          <CreateTemplateForm userId={user.id} />
        </div>
      </main>
    </div>
  )
}
