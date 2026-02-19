"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { decodeSSOToken, isTokenExpired, createMockSSOToken } from "@/lib/sso"
import { Card } from "@/components/ui/card"

interface SSORedirectState {
  status: "loading" | "error" | "success"
  message: string
  error?: string
}

export function LoginRedirectHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, setState] = useState<SSORedirectState>({
    status: "loading",
    message: "Initializing SSO login...",
  })

  useEffect(() => {
    async function handleSSORedirect() {
      try {
        // In development, if no token is provided, create a mock token
        const token =
          searchParams.get("token") ||
          (process.env.NODE_ENV === "development"
            ? createMockSSOToken({
                platformId: "platform-1",
                orgId: "org-1",
                userId: "user-1",
                role: "admin",
              })
            : null)

        if (!token) {
          setState({
            status: "error",
            message: "No SSO token provided",
            error: "Missing token parameter",
          })
          return
        }

        // Update state to show we're validating the token
        setState({
          status: "loading",
          message: "Validating SSO token...",
        })

        // Check if token is expired
        if (isTokenExpired(token)) {
          setState({
            status: "error",
            message: "SSO token has expired",
            error: "Token expired",
          })
          return
        }

        // Decode the token
        const claims = decodeSSOToken(token)

        // Update state to show we're resolving the tenant
        setState({
          status: "loading",
          message: "Resolving organization...",
        })

        // Store the token and claims in localStorage or a secure cookie
        localStorage.setItem("sso_token", token)
        localStorage.setItem("user_claims", JSON.stringify(claims))

        // Update state to show success
        setState({
          status: "success",
          message: "Login successful! Redirecting...",
        })

        // Redirect based on role and claims
        if (claims.role === "admin") {
          router.push("/admin")
        } else {
          router.push(`/organization/${claims.orgId}`)
        }
      } catch (error) {
        setState({
          status: "error",
          message: "Failed to process SSO login",
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    handleSSORedirect()
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center">
          {state.status === "loading" && (
            <>
              <div className="mb-4 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
              <h2 className="text-lg font-semibold">{state.message}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Please wait while we set up your account...
              </p>
            </>
          )}

          {state.status === "error" && (
            <>
              <svg
                className="mx-auto h-12 w-12 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="mt-4 text-lg font-semibold text-destructive">
                {state.message}
              </h2>
              {state.error && (
                <p className="mt-2 text-sm text-muted-foreground">{state.error}</p>
              )}
              <button
                onClick={() => router.push("/login")}
                className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
              >
                Return to Login
              </button>
            </>
          )}

          {state.status === "success" && (
            <>
              <svg
                className="mx-auto h-12 w-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h2 className="mt-4 text-lg font-semibold text-green-600">
                {state.message}
              </h2>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}