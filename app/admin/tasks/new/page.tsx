'use client'

import { useRouter } from "next/navigation"
import { NavHeader } from "@/components/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useProtectedRoute } from "@/hooks/useProtectedRoute"
import Loader from "@/components/loader"

import CreateTaskForm from "@/components/create-task-form"
import { toast } from "sonner"

export default function NewTaskPage() {
  const { user, isLoading: authLoading, isAuthorized } = useProtectedRoute({ 
    requirePlatformRole: true,
    redirectTo: "/login"
  })
  const router = useRouter()
  if (authLoading) {
    return <Loader title="Loading..." subtitle="Please wait while we authenticate you" />
  }

  if (!isAuthorized) {
    return <Loader title="Unauthorized" subtitle="Redirecting to login..." />
  }

  const handleTaskSubmit = async (taskData: any) => {
    try {
      // Here you would typically make an API call to create the task
      console.log("Creating task:", taskData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Task created successfully!")
      router.push("/admin")
    } catch (error) {
      console.error("Error creating task:", error)
      toast.error("Failed to create task. Please try again.")
    }
  }

  const handleCancel = () => {
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <NavHeader user={user} title="Create New Task" />
      <main className="p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Create New Task</h1>
              <p className="text-muted-foreground">
                Create and assign tasks to teams across organizations
              </p>
            </div>
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>
                Fill in the task information and assign it to a team member
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateTaskForm 
                onSubmit={handleTaskSubmit}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}