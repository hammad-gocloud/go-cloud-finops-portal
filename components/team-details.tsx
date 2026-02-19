"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { UserPlus } from "lucide-react"
import { TeamMemberList } from "@/components/team-member-list"
import { Team, TeamMember } from "@/src/api/api"

interface TeamDetailsProps {
  team: Team | undefined
  members: TeamMember[] | undefined
  backHref?: string
  addMemberHref?: string
}

export function TeamDetails({ team, members, backHref, addMemberHref }: TeamDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href={backHref ?? "/admin"}>← Back to Teams</Link>
        </Button>
        <Button asChild>
          <Link href={addMemberHref ?? `/admin/teams/${team?.id}/members/add`}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Team Member
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{team?.name}</CardTitle>
              <CardDescription>{team?.description}</CardDescription>
            </div>
            <Badge variant="outline" className="capitalize">
              {team?.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <TeamMemberList members={members} />

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Created On</p>
              <p className="font-medium">
                {team?.createdAt ? new Date(team.createdAt).toLocaleDateString() : '-'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">
                {team?.updatedAt ? new Date(team.updatedAt).toLocaleDateString() : '-'}
              </p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}