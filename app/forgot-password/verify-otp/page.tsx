"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, ArrowLeft } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import http from "@/src/api"
import { toast } from "sonner"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/otp-input"

function VerifyOtpContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email")
    const [otp, setOtp] = useState("")

    useEffect(() => {
        if (!email) {
            router.replace("/forgot-password")
        }
    }, [email, router])

    const { mutate: verifyOtp, isPending } = useMutation({
        mutationFn: async (otp: string) => {
            if (!email) throw new Error("Email is missing")
            return await http.api.authControllerVerifyOtp({ email, otp });
        },
        onSuccess: () => {
            toast.success("OTP verified successfully");
            router.push(`/forgot-password/reset-password?email=${encodeURIComponent(email || "")}&otp=${encodeURIComponent(otp)}`);
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Invalid OTP. Please try again.";
            toast.error(errorMessage);
        },
    });

    const { mutate: resendOtp, isPending: isResending } = useMutation({
        mutationFn: async () => {
            if (!email) throw new Error("Email is missing")
            return await http.api.authControllerForgotPassword({ email });
        },
        onSuccess: () => {
            toast.success("OTP resent to your email");
        },
        onError: (error: any) => {
            toast.error("Failed to resend OTP");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (otp.length !== 6) {
            toast.error("Please enter a 6-digit OTP")
            return
        }
        verifyOtp(otp)
    }

    if (!email) return null

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
            <Card className="w-full max-w-md border-none shadow-2xl bg-gradient-to-br from-card to-primary/5">
                <CardHeader className="space-y-3 text-center pb-6">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                        <ShieldCheck className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Verify OTP
                    </CardTitle>
                    <CardDescription className="text-base">
                        We've sent a 6-digit verification code to <span className="font-semibold text-foreground">{email}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={(value) => setOtp(value)}
                            >
                                <InputOTPGroup className="gap-2">
                                    <InputOTPSlot index={0} className="h-14 w-14 text-2xl rounded-xl border-2 border-primary/20 focus:border-primary transition-all ring-offset-background" />
                                    <InputOTPSlot index={1} className="h-14 w-14 text-2xl rounded-xl border-2 border-primary/20 focus:border-primary transition-all ring-offset-background" />
                                    <InputOTPSlot index={2} className="h-14 w-14 text-2xl rounded-xl border-2 border-primary/20 focus:border-primary transition-all ring-offset-background" />
                                    <InputOTPSlot index={3} className="h-14 w-14 text-2xl rounded-xl border-2 border-primary/20 focus:border-primary transition-all ring-offset-background" />
                                    <InputOTPSlot index={4} className="h-14 w-14 text-2xl rounded-xl border-2 border-primary/20 focus:border-primary transition-all ring-offset-background" />
                                    <InputOTPSlot index={5} className="h-14 w-14 text-2xl rounded-xl border-2 border-primary/20 focus:border-primary transition-all ring-offset-background" />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isPending || otp.length !== 6}>
                            {isPending ? "Verifying..." : "Verify OTP"}
                        </Button>

                        <div className="space-y-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                Didn't receive the code?{" "}
                                <button
                                    type="button"
                                    onClick={() => resendOtp()}
                                    disabled={isResending}
                                    className="text-primary hover:underline font-medium disabled:opacity-50"
                                >
                                    {isResending ? "Resending..." : "Resend"}
                                </button>
                            </p>

                            <Link
                                href="/forgot-password"
                                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Change email
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        }>
            <VerifyOtpContent />
        </Suspense>
    )
}
