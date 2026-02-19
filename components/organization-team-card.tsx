"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import useGetTeamMembers from "@/hooks/useGetTeamMembers";
import { TeamMemberList } from "@/components/team-member-list";

interface OrganizationTeamCardProps {
  team: any;
  orgId: string;
}

export default function OrganizationTeamCard({ team, orgId }: OrganizationTeamCardProps) {
  const { teamMembers, isLoading } = useGetTeamMembers(String(team?.id));

  return (
    <div className="space-y-4 rounded-xl border bg-muted/30 p-4 hover:bg-muted/50 hover:border-primary/50 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            <Link href={`/organization/${orgId}/teams/${team?.id}`}>{team?.name}</Link>
          </h3>
          <p className="text-sm text-muted-foreground">{team?.description}</p>
        </div>
        <Link href={`/organization/${orgId}/teams/${team?.id}/members/add`}>
          <Button className="gap-2">
            <Users className="h-4 w-4" />
            Add Team Member
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading members...</div>
      ) : (
        <TeamMemberList members={teamMembers} />
      )}
    </div>
  );
}