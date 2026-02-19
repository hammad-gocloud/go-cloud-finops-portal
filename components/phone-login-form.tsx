"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Phone, ArrowLeft } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import http from "@/src/api"
import { toast } from "sonner"
import Link from "next/link"

export function PhoneLoginForm() {
    const router = useRouter()
    const [phone, setPhone] = useState("")

    const { mutate: requestOtp, isPending: loading } = useMutation({
        mutationFn: async (phone: string) => {
            return await http.api.authControllerSignInWithPhone({ phone });
        },
        onSuccess: () => {
            toast.success("OTP sent successfully")
            router.push(`/login/phone/verify?phone=${encodeURIComponent(phone)}`)
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to send OTP"
            toast.error(errorMessage)
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!phone) {
            toast.error("Please enter a phone number")
            return
        }
        requestOtp(phone)
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
                    <Phone className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Sign in with Phone
                </CardTitle>
                <CardDescription className="text-base">Enter your phone number to receive a verification code</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-semibold">
                            Phone Number
                        </Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+61412345678"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="pl-10 h-11"
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                        {loading ? "Sending OTP..." : "Send Verification Code"}
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
