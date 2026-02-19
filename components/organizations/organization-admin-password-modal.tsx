"use client"

import { User as UserType, Organization } from "@/src/api/api"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Copy, User, Mail, Phone, AtSign, Key, Globe } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OrganizationAdminPasswordModalProps {
    organization: Organization | undefined
    password?: string
    open: boolean
    onClose: () => void
}

export function OrganizationAdminPasswordModal({
    organization,
    password,
    open,
    onClose,
}: OrganizationAdminPasswordModalProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        if (password) {
            navigator.clipboard.writeText(password)
            setCopied(true)
            toast.success("Password copied to clipboard")
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleCopyFull = () => {
        if (!admin || !password) return;
        const identifier = admin.username || admin.email || admin.phone || "Admin";
        const credentials = `Organization: ${organization?.name}\nUsername/Email/Phone: ${identifier}\nPassword: ${password}`;
        navigator.clipboard.writeText(credentials);
        toast.success("Full credentials copied to clipboard");
    }

    const admin = organization?.admin;

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Organization Created</DialogTitle>
                    <DialogDescription>
                        The organization and its administrator have been successfully created. Please share these credentials with the administrator securely.
                    </DialogDescription>
                </DialogHeader>

                {organization && (
                    <div className="space-y-4 py-4">
                        <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Globe className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">{organization.name}</p>
                                    <p className="text-sm text-muted-foreground">{organization.email}</p>
                                </div>
                            </div>

                            <div className="pt-2 border-t">
                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Administrator Details</p>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                                        <User className="h-4 w-4 text-secondary-foreground" />
                                    </div>
                                    <p className="text-sm font-medium">{admin?.fullName || "Administrator"}</p>
                                </div>

                                <div className="grid gap-2 text-sm">
                                    {admin?.email && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-4 w-4" />
                                            <span>{admin.email}</span>
                                        </div>
                                    )}
                                    {admin?.phone && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="h-4 w-4" />
                                            <span>{admin.phone}</span>
                                        </div>
                                    )}
                                    {admin?.username && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <AtSign className="h-4 w-4" />
                                            <span>{admin.username}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {password && (
                            <div className="space-y-2">
                                <Label>Temporary Password</Label>
                                <div className="relative">
                                    <div className="absolute left-3 top-2.5 text-muted-foreground">
                                        <Key className="h-4 w-4" />
                                    </div>
                                    <Input
                                        readOnly
                                        value={password}
                                        className="pl-9 pr-12 font-mono"
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute right-1 top-1 h-7 w-7"
                                        onClick={handleCopy}
                                    >
                                        {copied ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">Copy password</span>
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    This password will not be shown again.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter className="flex sm:justify-between items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCopyFull}
                        className="flex-1 sm:flex-none"
                    >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Full Credentials
                    </Button>
                    <Button type="button" onClick={onClose} className="flex-1 sm:flex-none">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
