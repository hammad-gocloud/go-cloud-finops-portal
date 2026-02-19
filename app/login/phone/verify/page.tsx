import { PhoneOtpVerification } from "@/components/phone-otp-verification"
import { Suspense } from "react"

export default function PhoneVerifyPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
            <Suspense fallback={<div>Loading...</div>}>
                <PhoneOtpVerification />
            </Suspense>
        </div>
    )
}
