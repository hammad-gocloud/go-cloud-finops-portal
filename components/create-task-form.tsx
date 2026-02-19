"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CalendarIcon, Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MOCK_ORGANIZATIONS } from "@/lib/mock-data"
import { toast } from "sonner"
import http from "@/src/api"
import type { Task } from "@/lib/types"
import useGetOrganizations from "@/hooks/useGetOrganizations"
import useGetTeams from "@/hooks/useGetTeams"
import useGetTeamMembers from "@/hooks/useGetTeamMembers"
import useGetTeamMemberByUserId from "@/hooks/useGetTeamMemberByUserId"
import { useAuth } from "@/app/contexts/AuthContext"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import Loader from "./loader"

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  organizationId: z.string().min(1, "Organization is required"),
  assignedTo: z.string().min(1, "Assignee is required"),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().min(1, "Due date is required"),
})

type TaskFormData = z.infer<typeof taskSchema>

interface CreateTaskFormProps {
  organizationId?: string
  onSubmit?: (task: Omit<Task, "id" | "createdAt" | "status" | "organizationName" | "assignedToName">) => void
  onCancel?: () => void
  isLoading?: boolean
}

export function CreateTaskForm({ organizationId, onSubmit, onCancel, isLoading = false }: CreateTaskFormProps) {
  const { user, isLoading: isLoadingUser } = useProtectedRoute()
  
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Get real organizations from backend
  const { organizations, isLoading: isLoadingOrganizations } = useGetOrganizations()
  const { teamMember, isLoading: isLoadingTeamMember } = useGetTeamMemberByUserId(user?.id)
  console.log(teamMember,'team member found')

  const { mutate: createTask, isPending: isCreatingTask } = useMutation({
    mutationFn: (data: any) => {
      return http.api.taskControllerCreate(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["tasks", "organization", organizationId] })
      toast.success("Task created successfully!")
      if (organizationId) {
        router.push(`/team/organizations/${organizationId}`)
      } else {
        router.push("/admin")
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "An error occurred while creating the task."
      toast.error(message)
    }
  })

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      organizationId: organizationId || "",
      assignedTo: "",
      priority: "medium",
      dueDate: "",
    },
  })

  const selectedOrganizationId = form.watch("organizationId")
  
  // Get the selected organization to find its assigned team
  const selectedOrganization = organizations?.find(org => org.id.toString() === selectedOrganizationId)
  const assignedTeamId = selectedOrganization?.assignedToTeam
  
  // Get team members for the organization's assigned team
  const { teamMembers, isLoading: isLoadingTeamMembers } = useGetTeamMembers(assignedTeamId?.toString() || "")

  const handleSubmit = async (data: TaskFormData) => {
    if (isSubmitting || isCreatingTask) return

    setIsSubmitting(true)
    
    try {
      // Get the organization's assigned team
      if (!assignedTeamId) {
        throw new Error("Selected organization does not have an assigned team")
      }

      // Map form data to API format according to CreateTaskDto
      // Convert string IDs to numbers as expected by the backend
      const taskData = {
        title: data.title,
        description: data.description,
        organizationId: parseInt(data.organizationId, 10),
        assignedToTeam: assignedTeamId, // Use the organization's assigned team
        assignedToTeamMember: parseInt(data.assignedTo, 10),
        assignedByTeamMember: teamMember?.id,
        priority: data.priority as "low" | "medium" | "high",
        status: "pending" as const,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      }

      // Validate that the conversions were successful
      if (isNaN(taskData.organizationId) || isNaN(taskData.assignedToTeamMember)) {
        throw new Error("Invalid ID values provided")
      }

      createTask(taskData)
      
      // Reset form on successful submission
      form.reset()
    } catch (error) {
      console.error("Error creating task:", error)
      const message = error instanceof Error ? error.message : "An error occurred while creating the task."
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    form.reset()
    if (onCancel) {
      onCancel()
    } else {
      router.push("/admin")
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  if (isLoadingUser || isLoadingOrganizations || isLoadingTeamMember || isLoadingTeamMembers) {
    return <Loader />
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Task
        </CardTitle>
        <CardDescription>
          Create a new task and assign it to a team member from an organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Task Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter task title..." 
                      {...field}
                      disabled={isSubmitting || isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    A clear, concise title for the task (max 100 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Task Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the task in detail..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={isSubmitting || isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed description of what needs to be accomplished (max 500 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Organization Selection */}
            <FormField
              control={form.control}
              name="organizationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value)
                      // Reset assignedTo when organization changes
                      form.setValue("assignedTo", "")
                    }} 
                    value={field.value}
                    disabled={isSubmitting || isLoading || isLoadingOrganizations || !!organizationId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an organization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingOrganizations ? (
                        <SelectItem value="loading-orgs" disabled>
                          Loading organizations...
                        </SelectItem>
                      ) : organizations?.length ? (
                        organizations?.map((org: any) => (
                          <SelectItem key={org.id} value={org.id.toString()}>
                            <div className="flex flex-col">
                              <span>{org.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {org.email} • {org.status}
                                {org.teamId && (
                                  <span className="ml-1">• Team Assigned</span>
                                )}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-orgs" disabled>
                          No organizations available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the organization this task belongs to (team members will be from the organization's assigned team)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Team Member Assignment */}
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign To</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isSubmitting || isLoading || isLoadingTeamMembers || !selectedOrganization?.assignedToTeam}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          selectedOrganization?.assignedToTeam
                            ? "Select a team member" 
                            : "Select an organization first"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingTeamMembers ? (
                        <SelectItem value="loading" disabled>
                          Loading team members...
                        </SelectItem>
                      ) : teamMembers && teamMembers.length > 0 ? (
                        teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id.toString()}>
                            <div className="flex flex-col">
                              <span>{member.user?.fullName || 'Unknown'}</span>
                              <span className="text-xs text-muted-foreground">
                                {member.user?.email || 'No email'} • {member.role}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      ) : selectedOrganization?.assignedToTeam ? (
                        <SelectItem value="no-members" disabled>
                          No team members available
                        </SelectItem>
                      ) : (
                        <SelectItem value="select-organization" disabled>
                          Select an organization first
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {selectedOrganization?.assignedToTeam
                      ? "Assign to a member from the organization's assigned team"
                      : "Select an organization to see available team members"
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Priority */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isSubmitting || isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          Low Priority
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          Medium Priority
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          High Priority
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Set the priority level for this task
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Due Date */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date"
                      min={today}
                      {...field}
                      disabled={isSubmitting || isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    When should this task be completed?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting || isCreatingTask}
                className="flex-1"
              >
                {isCreatingTask ? "Creating..." : "Create Task"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={isSubmitting || isCreatingTask}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default CreateTaskForm