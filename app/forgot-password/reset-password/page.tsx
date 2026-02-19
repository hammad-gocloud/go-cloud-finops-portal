"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import http from "@/src/api"
import { toast } from "sonner"

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email")
    const otp = searchParams.get("otp")

    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        if (!email || !otp) {
            router.replace("/forgot-password")
        }
    }, [email, otp, router])

    const { mutate: resetPassword, isPending } = useMutation({
        mutationFn: async () => {
            if (!email || !otp) throw new Error("Missing parameters")
            return await http.api.authControllerResetPassword({
                email,
                otp,
                newPassword,
            });
        },
        onSuccess: () => {
            setIsSuccess(true)
            toast.success("Password reset successfully")
            setTimeout(() => {
                router.push("/login")
            }, 3000)
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to reset password. Please try again.";
            toast.error(errorMessage);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters")
            return
        }
        resetPassword()
    }

    if (!email || !otp) return null

    if (isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
                <Card className="w-full max-w-md border-none shadow-2xl bg-gradient-to-br from-card to-primary/5">
                    <CardContent className="pt-10 pb-10 text-center space-y-6">
                        <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-inner">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">All Set!</h2>
                            <p className="text-muted-foreground text-base">
                                Your password has been successfully reset. Redirecting you to the login page...
                            </p>
                        </div>
                        <Button asChild className="w-full h-11 text-base font-semibold">
                            <Link href="/login">Go to Login</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
            <Card className="w-full max-w-md border-none shadow-2xl bg-gradient-to-br from-card to-primary/5">
                <CardHeader className="space-y-3 text-center pb-6">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                        <Lock className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Reset Password
                    </CardTitle>
                    <CardDescription className="text-base">
                        Choose a strong password for your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-sm font-semibold">
                                New Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="pl-10 pr-10 h-11"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                                Confirm New Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-10 h-11"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isPending}>
                            {isPending ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}
