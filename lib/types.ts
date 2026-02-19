
export interface SocialMediaTeam {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  status: "active" | "inactive"
  memberCount: number
}

export interface TeamMember {
  id: string
  teamId: string
  name: string
  email: string
  role: "member" | "lead" | "manager"
  status: "active" | "inactive"
  joinedAt: Date
}

export interface Organization {
  id: string
  name: string
  plan: "basic" | "professional" | "enterprise"
  status: "active" | "pending" | "inactive"
  teamId: string
  joinedAt: Date
  email: string
  planId: string
  createdAt: Date
  memberCount: number
  platformName: string
}

export interface Task {
  id: string
  title: string
  description: string
  organizationId: string
  organizationName: string
  assignedTo: string
  assignedToName: string
  status: "pending" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: Date
  createdAt: Date
}

export interface Template {
  id: string
  taskId?: string
  organizationId: string
  content: string
  imageUrl?: string
  status: "draft" | "pending" | "submitted" | "approved" | "rejected" | "published"
  feedback?: string
  feedbackImages?: string[]
  createdAt: Date
  createdBy: string
  publishedAt?: Date
  approvedAt?: Date
  planId?: string
}

export interface Plan {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  popular?: boolean
  postsPerMonth: number
}

export interface TaskActivity {
  id: string
  taskId: string
  type:
    | "created"
    | "template_submitted"
    | "feedback_provided"
    | "template_revised"
    | "approved"
    | "rejected"
    | "published"
    | "comment"
  performedBy: string
  performedByRole: "super_admin" | "social_media_team" | "organization"
  timestamp: Date
  details: string
  feedback?: string
  changes?: string
  images?: string[]
  comment?: string
  templateId?: string
}
