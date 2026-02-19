"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Sparkles, Mail, Lock, Phone, User } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import http from "@/src/api"
import { useAuth } from "@/app/contexts/AuthContext"
import { toast } from "sonner"
import { getRouteForRoleContext } from "@/lib/role-utils"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()

  const { mutate: logIn, isPending: loadingSignIn } = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await http.api.authControllerSignIn({ email, password });
      return response;
    },
    onSuccess: (data) => {
      console.log("Login successful:", data);

      // Handle the new response structure
      login(data.user, data?.accessToken, data.roleContexts, data.requiresRoleSelection);

      if (!data?.user) {
        console.error("Invalid response from login:", data);
        return;
      }

      // If role selection is required, redirect to role selection page
      if (data.requiresRoleSelection) {
        console.log("Role selection required. Available contexts:", data.roleContexts);
        toast.info("Please select a role context to continue");
        router.push("/select-role");
        return;
      }

      // If we have a token, user can proceed directly
      if (data?.accessToken && data.roleContexts.length === 1) {
        // Navigate based on the first role context
        const route = getRouteForRoleContext(data.roleContexts[0]);
        router.push(route);
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || // NestJS-specific message
        error?.message ||
        "Login failed. Please check your credentials.";

      toast.error(errorMessage);
    },
  });


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    logIn({ email, password })
  }

  return (
    <Card className="w-full max-w-md border-none shadow-2xl bg-gradient-to-br from-card to-primary/5">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
          <Sparkles className="h-7 w-7 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-base">Enter your credentials to access your dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                placeholder="*********"
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-11"
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}
          <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loadingSignIn}>
            {loadingSignIn ? "Signing in..." : "Sign in"}
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            <Button variant="outline" type="button" className="w-full h-11" onClick={() => router.push("/login/phone")}>
              <Phone className="mr-2 h-4 w-4" />
              Continue with Phone
            </Button>
            <Button variant="outline" type="button" className="w-full h-11" onClick={() => router.push("/login/username")}>
              <User className="mr-2 h-4 w-4" />
              Continue with Username
            </Button>
          </div>

          {/* <div className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div> */}
        </form>

      </CardContent>
    </Card>
  )
}
