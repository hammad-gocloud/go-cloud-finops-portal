"use client"

import { TeamMember } from "@/src/api/api"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Copy, User, Mail, Phone, AtSign, Key } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TeamMemberPasswordModalProps {
    member: TeamMember | undefined
    password?: string
    open: boolean
    onClose: () => void
}

export function TeamMemberPasswordModal({
    member,
    password,
    open,
    onClose,
}: TeamMemberPasswordModalProps) {
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
        if (!member || !password) return;
        const identifier = member.user?.username;
        const credentials = `Username: ${identifier}\nPassword: ${password}`;
        navigator.clipboard.writeText(credentials);
        toast.success("Full credentials copied to clipboard");
    }

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Team Member Added</DialogTitle>
                    <DialogDescription>
                        The team member has been successfully created. Please share these credentials with them secureley.
                    </DialogDescription>
                </DialogHeader>

                {member && (
                    <div className="space-y-4 py-4">
                        <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">{member.user?.fullName}</p>
                                    <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                                </div>
                            </div>

                            <div className="grid gap-2 text-sm">
                                {member.user?.email && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        <span>{member.user?.email}</span>
                                    </div>
                                )}
                                {member.user?.phone && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        <span>{member.user?.phone}</span>
                                    </div>
                                )}
                                {member.user?.username && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <AtSign className="h-4 w-4" />
                                        <span>{member.user?.username}</span>
                                    </div>
                                )}
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
