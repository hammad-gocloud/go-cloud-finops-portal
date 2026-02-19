"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import http from "@/src/api"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { AlertCircle } from "lucide-react"
import { useState } from "react"
import { TeamMember } from "@/src/api/api"
import { TeamMemberPasswordModal } from "@/components/team-member-password-modal"

interface AddTeamMemberFormProps {
  teamId: number | any
  teamName: string | undefined
  organizationId?: number
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.enum(["member", "lead", "manager"], {
    required_error: "Role is required",
  }),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z
    .string()
    .min(11, { message: "Phone number must be 11 digits (e.g., 61443434344)" })
    .max(11, { message: "Phone number must be 11 digits" })
    .regex(/^\+?61[0-9]{9}$/, {
      message: "Please enter a valid Australian phone number (e.g., 61443434344)",
    })
    .optional()
    .or(z.literal("")),
  username: z.string().optional().or(z.literal("")),
}).refine((data) => {
  const hasEmail = !!data.email && data.email.trim().length > 0;
  const hasPhone = !!data.phone && data.phone.trim().length > 0;
  const hasUsername = !!data.username && data.username.trim().length > 0;
  return hasEmail || hasPhone || hasUsername;
}, {
  message: "At least one contact method (Email, Phone, or Username) is required",
  path: ["email"],
});

type FormValues = z.infer<typeof formSchema>

export function AddTeamMemberForm({ teamId, teamName, organizationId }: AddTeamMemberFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient();
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [createdMemberData, setCreatedMemberData] = useState<{ member: TeamMember; password?: string } | null>(null)

  const handleClose = () => {
    setShowPasswordModal(false)
    setCreatedMemberData(null)
    if (organizationId) {
      router.push(`/organization/${organizationId}`)
    } else {
      router.push(`/admin/teams/${teamId}`)
    }
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      username: "",
      role: "member",
    },
  })

  const { mutate: createTeamMember, isPending: creatingTeam } = useMutation({
    mutationFn: ({ data }: { data: any }) => {
      // Clean up empty strings to undefined
      const payload = {
        ...data,
        email: data.email || undefined,
        phone: data.phone || undefined,
        username: data.username || undefined,
        teamId: String(teamId)
      };
      return http.api.teamMemberControllerCreate(payload)
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['team', teamId] })
      toast.success("Team member added successfully")

      console.log("Team Member Create Response:", response);

      // Handle potential response wrapping (e.g. NestJS interceptors)
      const data = response?.data || response;

      if (data?.showPassword) {
        setCreatedMemberData({ member: data.member, password: data.password })
        setShowPasswordModal(true)
      } else {
        handleClose()
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to add team member"
      toast.error(message)
    }
  });

  function onSubmit(data: FormValues) {
    createTeamMember({ data });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Team Member</CardTitle>
        <CardDescription>Add a new member to {teamName}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {form.formState.errors.root && (
              <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-2 text-destructive text-sm font-medium">
                <AlertCircle className="h-4 w-4" />
                <p>{form.formState.errors.root.message}</p>
              </div>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter member name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select member role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="member">Team Member</SelectItem>
                      <SelectItem value="lead">Team Lead</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (organizationId) {
                    router.push(`/organization/${organizationId}`)
                  } else {
                    router.push(`/admin/teams/${teamId}`)
                  }
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creatingTeam}>
                {creatingTeam ? "Adding..." : "Add Member"}
              </Button>
            </div>
          </form>
        </Form>
        <TeamMemberPasswordModal
          open={showPasswordModal}
          onClose={handleClose}
          member={createdMemberData?.member}
          password={createdMemberData?.password}
        />
      </CardContent>
    </Card>
  )
}