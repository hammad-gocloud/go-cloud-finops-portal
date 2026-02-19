'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { useAuth } from "../contexts/AuthContext"
import { getRouteForRoleContext } from "@/lib/role-utils"

export default function LoginPage() {
  const { user, selectedRoleContext, roleContexts, requiresRoleSelection } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) return

    // If user has multiple roles and hasn't selected one yet, redirect to role selection
    if (requiresRoleSelection && roleContexts.length > 1 && !selectedRoleContext) {
      console.log("🔀 User needs to select a role, redirecting to /select-role")
      router.replace("/select-role")
      return
    }

    // If user has selected a role context, navigate to it
    if (selectedRoleContext) {
      const route = getRouteForRoleContext(selectedRoleContext)
      console.log("✅ User has selected role context, redirecting to:", route)
      router.replace(route)
      return
    }

    // If user has only one role context, use it
    if (roleContexts && roleContexts.length === 1) {
      const route = getRouteForRoleContext(roleContexts[0])
      console.log("✅ User has single role context, redirecting to:", route)
      router.replace(route)
      return
    }

    // If user has multiple roles but no selected context, go to role selection
    if (roleContexts && roleContexts.length > 1) {
      console.log("🔀 User has multiple roles, redirecting to /select-role")
      router.replace("/select-role")
      return
    }

    // Fallback to home page if no role contexts
    console.log("⚠️ No role contexts available, redirecting to home")
    router.replace("/")
  }, [user, selectedRoleContext, roleContexts, requiresRoleSelection, router])

  if (user) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <LoginForm />
    </div>
  )
}
