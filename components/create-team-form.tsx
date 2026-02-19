"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import http from "@/src/api"
import { toast } from "sonner"

interface CreateTeamFormProps {
  organizationId?: number
  organizationName?: string
}

export function CreateTeamForm({ organizationId, organizationName }: CreateTeamFormProps) {
  const router = useRouter()
  const [teamName, setTeamName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const { mutate: createTeam, isPending: laodingCreation } = useMutation({
    mutationFn: ({ name, description, organizationId }: { name: string, description: string, organizationId?: number }) => { 
      return http.api.teamControllerCreate({ 
        name: name, 
        description: description,
        ...(organizationId && { organizationId })
      }) 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] })
      toast.success("Team created successfully!")
      if (organizationId) {
        router.push(`/organization/${organizationId}`)
      } else {
        router.push("/admin")
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "An error occurred while creating the team."
      toast.error(message)

    }
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    createTeam({ name: teamName, description: description, organizationId })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {organizationName ? `Create Team for ${organizationName}` : "Create Social Media Team"}
        </CardTitle>
        <CardDescription>
          {organizationName 
            ? `Set up a new team to manage social media content for ${organizationName}` 
            : "Set up a new team to manage social media content for organizations"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              placeholder="e.g., Content Creation Team"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the team's responsibilities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {laodingCreation ? "Creating..." : "Create Team"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
