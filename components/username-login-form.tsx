"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Lock, ArrowLeft } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import http from "@/src/api"
import { useAuth } from "@/app/contexts/AuthContext"
import { toast } from "sonner"
import { getRouteForRoleContext } from "@/lib/role-utils"
import Link from "next/link"

export function UsernameLoginForm() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const { login } = useAuth()

    const { mutate: logIn, isPending: loading } = useMutation({
        mutationFn: async (data: { username: string; password: string }) => {
            const response = await http.api.authControllerSignInWithUsername(data);
            return response;
        },
        onSuccess: (data) => {
            console.log("Login successful:", data);

            // Handle the response structure
            login(data.user, data?.accessToken, data.roleContexts, data.requiresRoleSelection);

            if (!data?.user) {
                console.error("Invalid response from login:", data);
                return;
            }

            // If role selection is required, redirect to role selection page
            if (data.requiresRoleSelection) {
                toast.info("Please select a role context to continue");
                router.push("/select-role");
                return;
            }

            // If we have a token and single role, navigate directly
            if (data?.accessToken && data.roleContexts.length === 1) {
                const route = getRouteForRoleContext(data.roleContexts[0]);
                router.push(route);
            }
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Login failed. Please check your credentials.";

            toast.error(errorMessage);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        logIn({ username, password })
    }

    return (
        <Card className="w-full max-w-md border-none shadow-2xl bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="space-y-3 text-center pb-6">
                <div className="flex justify-start">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </div>
                <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                    <User className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Sign in with Username
                </CardTitle>
                <CardDescription className="text-base">Enter your username and password</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm font-semibold">
                            Username
                        </Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="username"
                                type="text"
                                placeholder="johndoe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                                placeholder="*********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 h-11"
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>
                    <div className="text-center">
                        <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Back to regular login
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
