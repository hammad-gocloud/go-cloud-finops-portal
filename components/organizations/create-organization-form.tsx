"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Plus, X } from "lucide-react"
import http from "@/src/api"
import useGetTeams from "@/hooks/useGetTeams"
import { OrganizationAdminPasswordModal } from "./organization-admin-password-modal"

const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  adminName: z.string().min(1, "Administrator name is required").max(100, "Name must be less than 100 characters"),
  adminEmail: z.string().email("Please enter a valid administrator email address").optional().or(z.literal("")),
  adminUsername: z.string().optional().or(z.literal("")),
  adminPhone: z
    .string()
    .min(11, { message: "Phone number must be 11 digits (e.g., 61443434344)" })
    .max(11, { message: "Phone number must be 11 digits" })
    .regex(/^\+?61[0-9]{9}$/, {
      message: "Please enter a valid Australian phone number (e.g., 61443434344)",
    })
    .optional()
    .or(z.literal("")),
  teamId: z.string().min(1, "Team assignment is required"),
}).refine((data) => {
  const hasEmail = !!data.adminEmail && data.adminEmail.trim().length > 0;
  const hasPhone = !!data.adminPhone && data.adminPhone.trim().length > 0;
  const hasUsername = !!data.adminUsername && data.adminUsername.trim().length > 0;
  return hasEmail || hasPhone || hasUsername;
}, {
  message: "At least one administrator contact method (Email, Phone, or Username) is required",
  path: ["adminEmail"],
});

type OrganizationFormData = z.infer<typeof organizationSchema>

interface CreateOrganizationFormProps {
  onSubmit?: (organization: any) => void
  onCancel?: () => void
  isLoading?: boolean
}

export function CreateOrganizationForm({ onSubmit, onCancel, isLoading = false }: CreateOrganizationFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [createdOrgData, setCreatedOrgData] = useState<{ organization: any; password?: string } | null>(null)

  // Get all teams from backend
  const { teams, isLoading: isLoadingTeams } = useGetTeams()

  const handleClose = () => {
    setShowPasswordModal(false)
    setCreatedOrgData(null)
    router.push("/admin/organizations")
  }

  const { mutate: createOrg, isPending: isCreatingOrg } = useMutation({
    mutationFn: (data: any) => {
      // Clean up empty strings to undefined
      const payload = {
        ...data,
        adminEmail: data.adminEmail || undefined,
        adminPhone: data.adminPhone || undefined,
        adminUsername: data.adminUsername || undefined,
      };
      return http.api.organizationControllerCreate(payload)
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] })
      toast.success("Organization created successfully!")

      const data = response?.data || response;

      if (data?.showPassword) {
        setCreatedOrgData({ organization: data.organization, password: data.password })
        setShowPasswordModal(true)
      } else {
        handleClose()
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "An error occurred while creating the organization."
      toast.error(message)
    }
  })

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      email: "",
      adminName: "",
      adminEmail: "",
      adminUsername: "",
      adminPhone: "",
      teamId: "",
    },
  })

  const handleSubmit = async (data: OrganizationFormData) => {
    if (isSubmitting || isCreatingOrg) return

    setIsSubmitting(true)

    try {
      // Map form data to API format
      const organizationData = {
        name: data.name,
        email: data.email,
        adminName: data.adminName,
        adminEmail: data.adminEmail,
        adminUsername: data.adminUsername || undefined,
        adminPhone: data.adminPhone || undefined,
        teamId: String(data.teamId), // Match DTO definition as string
      }

      createOrg(organizationData)

      // Reset form on successful submission
      form.reset()
    } catch (error) {
      console.error("Error creating organization:", error)
      const message = error instanceof Error ? error.message : "An error occurred while creating the organization."
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    form.reset()
    router.push("/admin/organizations")
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Organization
        </CardTitle>
        <CardDescription>
          Create a new organization and assign it to a team for management.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Organization Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter organization name..."
                      {...field}
                      disabled={isSubmitting || isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    The official name of the organization (max 100 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Organization Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="contact@organization.com"
                      {...field}
                      disabled={isSubmitting || isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Primary contact email for the organization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Team Assignment */}
            <FormField
              control={form.control}
              name="teamId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign to Team</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting || isLoading || isLoadingTeams}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a team to manage this organization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingTeams ? (
                        <SelectItem value="loading" disabled>
                          Loading teams...
                        </SelectItem>
                      ) : teams && teams.length > 0 ? (
                        teams.map((team) => (
                          <SelectItem key={team.id} value={team.id.toString()}>
                            <div className="flex flex-col">
                              <span>{team.name}</span>
                              {/* <span className="text-xs text-muted-foreground">
                                {team.description} • {team.memberCount} members
                              </span> */}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-teams" disabled>
                          No teams available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select which team will be responsible for managing this organization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Admin Information Section */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Administrator Information</CardTitle>
                <CardDescription>
                  Details for the organization's primary administrator
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Admin Name */}
                <FormField
                  control={form.control}
                  name="adminName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Administrator Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter administrator name..."
                          {...field}
                          disabled={isSubmitting || isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Full name of the organization administrator
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Admin Email */}
                <FormField
                  control={form.control}
                  name="adminEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Administrator Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="admin@organization.com"
                          {...field}
                          disabled={isSubmitting || isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Email address for the organization administrator
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Admin Username */}
                  <FormField
                    control={form.control}
                    name="adminUsername"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Administrator Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="johndoe"
                            {...field}
                            disabled={isSubmitting || isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional username for login
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Admin Phone */}
                  <FormField
                    control={form.control}
                    name="adminPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Administrator Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="614..."
                            {...field}
                            disabled={isSubmitting || isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          Format: 61 followed by 9 digits
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || isCreatingOrg}
                className="flex-1"
              >
                {isCreatingOrg ? "Creating..." : "Create Organization"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting || isCreatingOrg}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </Form>
        <OrganizationAdminPasswordModal
          open={showPasswordModal}
          onClose={handleClose}
          organization={createdOrgData?.organization}
          password={createdOrgData?.password}
        />
      </CardContent>
    </Card>
  )
}
