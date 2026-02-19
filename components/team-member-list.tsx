"use client"

import { TeamMember } from "@/src/api/api"
import { Users, Mail, Calendar, Phone, AtSign } from "lucide-react"

interface TeamMemberListProps {
  members: TeamMember[] | undefined
}

export function TeamMemberList({ members }: TeamMemberListProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Users className="h-5 w-5" />
        Team Members ({members?.length})
      </h3>
      <div className="space-y-4">
        {members?.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{member?.user?.fullName}</p>
                <div className="flex flex-col gap-1 mt-1">
                  {member?.user?.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      {member?.user?.email}
                    </div>
                  )}
                  {member?.user?.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      {member?.user?.phone}
                    </div>
                  )}
                  {member?.user?.username && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AtSign className="h-3.5 w-3.5" />
                      {member?.user?.username}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Joined {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : '-'}
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}