"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { KeyRound, Mail, ArrowLeft, Sparkles } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import http from "@/src/api"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")

    const { mutate: requestOtp, isPending } = useMutation({
        mutationFn: async (email: string) => {
            return await http.api.authControllerForgotPassword({ email });
        },
        onSuccess: () => {
            toast.success("OTP sent to your email");
            router.push(`/forgot-password/verify-otp?email=${encodeURIComponent(email)}`);
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to send OTP. Please try again.";
            toast.error(errorMessage);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        requestOtp(email)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
            <Card className="w-full max-w-md border-none shadow-2xl bg-gradient-to-br from-card to-primary/5">
                <CardHeader className="space-y-3 text-center pb-6">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                        <KeyRound className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Forgot Password?
                    </CardTitle>
                    <CardDescription className="text-base">
                        Enter your email address and we'll send you an OTP to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold">
                                Email Address
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

                        <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isPending}>
                            {isPending ? "Sending OTP..." : "Send OTP"}
                        </Button>

                        <div className="text-center">
                            <Link
                                href="/login"
                                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
