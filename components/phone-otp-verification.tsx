"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Lock, ArrowLeft } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import http from "@/src/api"
import { useAuth } from "@/app/contexts/AuthContext"
import { toast } from "sonner"
import { getRouteForRoleContext } from "@/lib/role-utils"

export function PhoneOtpVerification() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const phone = searchParams.get("phone")
    const [otp, setOtp] = useState("")
    const { login } = useAuth()

    useEffect(() => {
        if (!phone) {
            toast.error("Phone number missing")
            router.push("/login/phone")
        }
    }, [phone, router])

    const { mutate: verifyOtp, isPending: loading } = useMutation({
        mutationFn: async (otp: string) => {
            if (!phone) throw new Error("Phone number missing")
            return await http.api.authControllerVerifyPhoneOtp({ phone, otp });
        },
        onSuccess: (data) => {
            console.log("Phone login successful:", data);

            // Reuse the logic from LoginForm
            login(data.user, data?.accessToken, data.roleContexts, data.requiresRoleSelection);

            if (!data?.user) {
                console.error("Invalid response from login:", data);
                return;
            }

            if (data.requiresRoleSelection) {
                toast.info("Please select a role context to continue");
                router.push("/select-role");
                return;
            }

            if (data?.accessToken && data.roleContexts.length === 1) {
                const route = getRouteForRoleContext(data.roleContexts[0]);
                router.push(route);
            }
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || "Verification failed"
            toast.error(errorMessage)
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!otp) {
            toast.error("Please enter the OTP")
            return
        }
        verifyOtp(otp)
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
                    <Lock className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Verify OTP
                </CardTitle>
                <CardDescription className="text-base">
                    We've sent a 6-digit code to {phone}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="otp" className="text-sm font-semibold">
                            Verification Code
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="otp"
                                type="text"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="pl-10 h-11 tracking-[0.5em] text-center font-bold text-lg"
                                maxLength={6}
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                        {loading ? "Verifying..." : "Verify & Continue"}
                    </Button>
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            type="button"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => router.push("/login/phone")}
                        >
                            Change phone number
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
