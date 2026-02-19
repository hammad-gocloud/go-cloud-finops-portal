"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, ArrowRight } from "lucide-react"
import Link from "next/link"

interface OrganizationCardProps {
  id: string
  name: string
  status: "active" | "inactive" | "pending"
  email?: string
  createdAt?: string
}

export function OrganizationCard({
  id,
  name,
  status,
  email,
  createdAt,
}: OrganizationCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{name}</CardTitle>
              <Badge
                variant={
                  status === "active"
                    ? "default"
                    : status === "inactive"
                    ? "secondary"
                    : "destructive"
                }
              >
                {status}
              </Badge>
            </div>
            <CardDescription className="mt-1.5">
              {email && `Contact: ${email}`}
              {createdAt && ` • Created: ${new Date(createdAt).toLocaleDateString()}`}
            </CardDescription>
          </div>
          <Link href={`/admin/organizations/${id}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              View Details
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Organization ID: {id}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}