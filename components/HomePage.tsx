'use client'

import { useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Loader from "@/components/loader"
import { useMutation } from "@tanstack/react-query"
import http from "@/src/api"
import { useAuth } from "@/app/contexts/AuthContext"
import { getRouteForRoleContext } from "@/lib/role-utils"

export default function HomePage() {
  const { user, isLoading, login, selectedRoleContext, roleContexts, setToken, setSelectedRoleContext } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ✅ Check if current path is one of the public task routes
  const isOrganizationTaskPage =
    pathname?.startsWith("/organization/tasks/") && searchParams.toString().length > 0

  const isTeamTaskPage =
    pathname?.startsWith("/team/organizations/") &&
    pathname?.includes("/tasks/") &&
    searchParams.toString().length > 0

  // ✅ If true, skip all auth logic
  const isPublicTaskPage = isOrganizationTaskPage || isTeamTaskPage

  const { mutate: refreshToken } = useMutation({
    mutationFn: async ({ id }: { id: any }) => {
      console.log("🔄 Refreshing token for user:", id)
      const res = await http.api.authControllerRefreshToken({ id })
      console.log("✅ Refresh response:", res)
      return res
    },
    onSuccess: (data: any) => {
      const userData = data?.user || data?.data?.user
      const accessToken = data?.accessToken || data?.data?.accessToken
      const responseRoleContexts = data?.roleContexts || data?.data?.roleContexts || []
      const requiresRoleSelection = data?.requiresRoleSelection || data?.data?.requiresRoleSelection || false

      if (!userData) {
        console.log("⚠️ Invalid refresh token response - no user data", data)
        localStorage.clear()
        router.replace("/login")
        return
      }

      // Store user and role contexts
      login(userData, accessToken, responseRoleContexts, requiresRoleSelection)

      // Handle navigation based on the response
      if (requiresRoleSelection) {
        // User has multiple roles - redirect to role selection
        console.log("🔀 Multiple roles detected, redirecting to role selection")
        router.replace("/select-role")
      } else if (accessToken && responseRoleContexts.length > 0) {
        // User has single role or token already provided - navigate to dashboard
        handleRedirect(responseRoleContexts[0])
      } else if (selectedRoleContext) {
        // Use stored selected role context
        handleRedirect(selectedRoleContext)
      } else if (roleContexts.length > 0) {
        // Use first available role context
        handleRedirect(roleContexts[0])
      } else {
        // No role contexts available
        console.log("⚠️ No role contexts available")
        router.replace("/login")
      }
    },
    onError: (err: any) => {
      console.log("❌ Token refresh failed:", err)
      localStorage.clear()
      router.replace("/login")
    },
  })

  const handleRedirect = (context: any) => {
    const route = getRouteForRoleContext(context)
    console.log("🚀 Redirecting to:", route)
    router.replace(route)
  }

  useEffect(() => {
    // ✅ Skip everything if it's a public shared task page
    if (isPublicTaskPage) return

    // ✅ Skip if user is on select-role page (let that page handle its own logic)
    if (pathname === "/select-role") {
      console.log("🔀 User is on select-role page, skipping HomePage logic")
      return
    }

    // ✅ Skip if user is on login page
    if (pathname === "/login") {
      console.log("🔒 User is on login page, skipping HomePage logic")
      return
    }

    if (isLoading) return

    if (!user) {
      console.log("🔒 No user found, redirecting to login")
      router.replace("/login")
      return
    }

    console.log("🔄 HomePage: Attempting token refresh for user:", user.id)
    refreshToken({
      id: user.id
    })
  }, [user, isLoading, router, isPublicTaskPage, pathname])

  return <Loader />
}
