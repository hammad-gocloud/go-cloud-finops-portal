/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SignUpDto {
  /** @example "John Doe" */
  fullName: string;
  /** @example "john@example.com" */
  email?: string;
  /** @example "03001234567" */
  phone?: string;
  /** @example "john_doe" */
  username?: string;
  /** @example "StrongP@ssw0rd" */
  password?: string;
  /** @example "System User" */
  role: string;
}

export interface FileDTO {
  url: string;
  key: string;
  fileType: string;
}

export interface TeamMember {
  /**
   * Unique ID of the user
   * @example 1
   */
  id: number;
  /** @example "member" */
  role: "member" | "lead" | "manager";
  /** @example "active" */
  status: "active" | "inactive";
  /**
   * References Team.id
   * @example 1
   */
  teamId: number;
  /**
   * @format date-time
   * @example "2024-06-25T12:34:56.789Z"
   */
  joinedAt: string;
  /**
   * References User.id
   * @example 1
   */
  userId: number;
  /** The user associated with this member */
  user?: User;
  /** The team this member belongs to */
  team?: Team;
  /**
   * @format date-time
   * @example "2024-06-25T12:34:56.789Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2024-06-25T12:34:56.789Z"
   */
  updatedAt: string;
}

export interface Organization {
  /**
   * Unique ID of the user
   * @example 1
   */
  id: number;
  /** @example "Acme Corp" */
  name: string;
  /** @example "pending" */
  status: "active" | "pending" | "inactive";
  /** @example "info@acme.com" */
  email: string;
  /**
   * References User.id
   * @example 1
   */
  adminId: number;
  /** @example 1 */
  assignedToTeam?: number;
  team: Team;
  /** The user associated with this organization */
  admin?: User;
  /**
   * Array of media files associated with the organization (gallery)
   * @example [{"url":"https://cdn.example.com/image1.jpg","key":"orgs/1/gallery/image1.jpg","fileType":"image/jpeg"},{"url":"https://cdn.example.com/image2.jpg","key":"orgs/1/gallery/image2.jpg","fileType":"image/jpeg"}]
   */
  gallery?: FileDTO[];
  /**
   * @format date-time
   * @example "2024-06-25T12:34:56.789Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2024-06-25T12:34:56.789Z"
   */
  updatedAt: string;
}

export interface Team {
  /**
   * Unique ID of the user
   * @example 1
   */
  id: number;
  /**
   * Team name
   * @example "Engineering"
   */
  name: string;
  /**
   * Description
   * @example "Platform and infra team"
   */
  description: string;
  /** @example "active" */
  status: "active" | "inactive";
  /**
   * Number of members in the team
   * @example 0
   */
  memberCount: number;
  /** Members of the team */
  members?: TeamMember[];
  /** Organization of the team */
  organization?: Organization;
  /**
   * @format date-time
   * @example "2024-06-25T12:34:56.789Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2024-06-25T12:34:56.789Z"
   */
  updatedAt: string;
}

export interface Permission {
  /**
   * Unique ID of the permission
   * @example 1
   */
  id: number;
  /**
   * Unique slug/name of the permission
   * @example "CREATE_USER"
   */
  name: string;
  /**
   * Description of the permission
   * @example "Allows creating a new user"
   */
  description: string;
}

export interface Role {
  /**
   * Unique ID of the role
   * @example 1
   */
  id: number;
  /**
   * Title of the role
   * @example "Organization Admin"
   */
  title: string;
  /**
   * Description of the role
   * @example "Has full access to organization settings"
   */
  description: string;
  /**
   * Scope of the role (Platform, Organization, School)
   * @example "Organization"
   */
  scope: "Organization" | "Platform";
  /**
   * Indicates if the role is active
   * @example true
   */
  isActive: boolean;
  /**
   * Record creation timestamp
   * @format date-time
   * @example "2024-06-25T12:34:56.789Z"
   */
  createdAt: string;
  /**
   * Record update timestamp
   * @format date-time
   * @example "2024-06-25T12:34:56.789Z"
   */
  updatedAt: string;
  /** Role contexts associated with the role */
  roleContexts: any[][];
  /** Permissions associated with this role */
  permissions: Permission[];
}

export interface RoleContext {
  /**
   * Unique ID of the role context
   * @example 1
   */
  id: number;
  /**
   * ID of the role
   * @example 1
   */
  roleId: number;
  /**
   * ID of the user
   * @example 1
   */
  userId: number;
  /**
   * ID of the organization (optional, for organization-scoped roles)
   * @example 5
   */
  organizationId: number | null;
  /**
   * ID of the team (optional, for team-scoped roles)
   * @example 3
   */
  teamId: number | null;
  /** Associated team details */
  team: Team;
  /** Associated organization details */
  organization: Organization;
  /** Associated role details */
  role: Role;
  /** Associated user details */
  user: User;
  /**
   * Record creation timestamp
   * @format date-time
   * @example "2024-06-25T12:34:56.789Z"
   */
  createdAt: string;
  /**
   * Record update timestamp
   * @format date-time
   * @example "2024-06-25T12:34:56.789Z"
   */
  updatedAt: string;
}

export interface User {
  /**
   * Unique ID of the user
   * @example 1
   */
  id: number;
  /**
   * Full name of the user
   * @example "John Doe"
   */
  fullName: string;
  /**
   * Username of the user
   * @example "samiullah"
   */
  username: string;
  /**
   * Email address of the user
   * @example "john@example.com"
   */
  email: string;
  /**
   * Phone number of the user
   * @example "6123456789"
   */
  phone: string;
  /**
   * Hashed password
   * @example "hashedpassword123"
   */
  password: string;
  /**
   * Date of birth in YYYY-MM-DD format
   * @example "1990-05-20"
   */
  dob: string | null;
  /** Profile picture or file details */
  profile: FileDTO | null;
  /**
   * Indicates if the user is verified
   * @example true
   */
  isVerified: boolean;
  /**
   * Legacy role column (DEPRECATED - Use roleContexts)
   * @example "Platform Admin"
   */
  role?: string;
  /** User role contexts in the system */
  roleContexts: RoleContext[];
  /**
   * OTP for password reset
   * @example "123456"
   */
  resetPasswordOtp: string | null;
  /**
   * Expiry time for password reset OTP
   * @format date-time
   * @example "2024-06-25T12:34:56.789Z"
   */
  resetPasswordOtpExpires: string | null;
  /**
   * OTP for phone-based sign-in
   * @example "123456"
   */
  phoneOtp: string | null;
  /**
   * Expiry time for phone OTP
   * @format date-time
   * @example "2024-06-25T12:34:56.789Z"
   */
  phoneOtpExpires: string | null;
  /**
   * Indicates if the user account is active
   * @example true
   */
  isActive: boolean;
  /**
   * Record creation timestamp
   * @format date-time
   * @example "2024-06-25T12:34:56.789Z"
   */
  createdAt: string;
  /**
   * Record update timestamp
   * @format date-time
   * @example "2024-06-25T12:34:56.789Z"
   */
  updatedAt: string;
}

export interface SignInResponseDto {
  user: User;
  /** Available role contexts for the user */
  roleContexts: RoleContext[];
  /**
   * Access token (only present if user has single role context)
   * @example "jwt.token.here"
   */
  accessToken?: string;
  /**
   * Whether role context selection is required
   * @example false
   */
  requiresRoleSelection: boolean;
}

export interface RefreshTokenDto {
  id: string;
}

export interface SignInDto {
  /** @example "john@example.com" */
  email: string;
  /** @example "StrongP@ssw0rd" */
  password: string;
}

export interface SelectContextDto {
  /**
   * User ID
   * @example 1
   */
  userId: number;
  /**
   * Role context ID to select
   * @example 5
   */
  roleContextId: number;
}

export interface SelectRoleContextResponseDto {
  /** @example "jwt.token.here" */
  accessToken: string;
  user: User;
  selectedRoleContext: RoleContext;
}

export interface ResetPasswordByEmailDto {
  /** @example "user@example.com" */
  email: string;
}

export interface ForgotPasswordDto {
  /**
   * Email of the user
   * @example "user@example.com"
   */
  email: string;
}

export interface VerifyOtpDto {
  /**
   * Email of the user
   * @example "user@example.com"
   */
  email: string;
  /**
   * OTP received via email
   * @example "123456"
   */
  otp: string;
}

export interface ResetPasswordDto {
  /**
   * Email of the user
   * @example "user@example.com"
   */
  email: string;
  /**
   * OTP received via email
   * @example "123456"
   */
  otp: string;
  /**
   * New password for the user
   * @example "newPassword123"
   */
  newPassword: string;
}

export interface SignInWithPhoneDto {
  /**
   * Phone number to send OTP to
   * @example "+61412345678"
   */
  phone: string;
}

export interface VerifyPhoneOtpDto {
  /**
   * Phone number that received the OTP
   * @example "+61412345678"
   */
  phone: string;
  /**
   * 6-digit OTP code
   * @example "123456"
   */
  otp: string;
}

export interface SignInWithUsernameDto {
  /**
   * Username of the user
   * @example "samiullah"
   */
  username: string;
  /**
   * Password of the user
   * @example "password123"
   */
  password: string;
}

export interface UpdateUserDto {
  /** @example "John Doe" */
  fullName: string;
  /** @example "+923001234567" */
  phone: string;
  /** @example "1990-05-20" */
  dob: string;
}

export interface CreateRoleContextDto {
  /**
   * ID of the role
   * @example 1
   */
  roleId: number;
  /**
   * ID of the user
   * @example 1
   */
  userId: number;
  /**
   * ID of the organization (optional, for organization-scoped roles)
   * @example 5
   */
  organizationId?: number;
  /**
   * ID of the school (optional, for school-scoped roles)
   * @example 10
   */
  teamId?: number;
}

export interface UpdateRoleContextDto {
  /**
   * ID of the role
   * @example 1
   */
  roleId?: number;
  /**
   * ID of the user
   * @example 1
   */
  userId?: number;
  /**
   * ID of the organization (optional, for organization-scoped roles)
   * @example 5
   */
  organizationId?: number;
  /**
   * ID of the school (optional, for school-scoped roles)
   * @example 10
   */
  teamId?: number;
}

export interface CreateRoleDto {
  /**
   * Title of the role
   * @example "Organization Admin"
   */
  title: string;
  /**
   * Description of the role
   * @example "Has full access to organization settings"
   */
  description?: string;
  /**
   * Scope of the role
   * @example "Organization"
   */
  scope: "Organization" | "Platform";
  /**
   * Indicates if the role is active
   * @default true
   * @example true
   */
  isActive?: boolean;
}

export interface UpdateRoleDto {
  /**
   * Title of the role
   * @example "Organization Admin"
   */
  title?: string;
  /**
   * Description of the role
   * @example "Has full access to organization settings"
   */
  description?: string;
  /**
   * Scope of the role
   * @example "Organization"
   */
  scope?: "Organization" | "Platform";
  /**
   * Indicates if the role is active
   * @default true
   * @example true
   */
  isActive?: boolean;
}

export interface CreateTeamDto {
  /** @example "Engineering" */
  name: string;
  /** @example "Platform and infra team" */
  description: string;
  /**
   * Optional organization ID
   * @example 1
   */
  organizationId?: number;
}

export interface UpdateTeamDto {
  /** @example "Engineering" */
  name?: string;
  /** @example "Platform and infra team" */
  description?: string;
  /** @example "active" */
  status?: string;
  /**
   * Member count
   * @example 0
   */
  memberCount?: number;
}

export interface CreateTeamMemberDto {
  /** @example "team-uuid" */
  teamId: string;
  /** @example "John Doe" */
  name: string;
  /** @example "john@example.com" */
  email?: string;
  /** @example "+923001234567" */
  phone?: string;
  /** @example "samiullah" */
  username?: string;
  /** @example "member" */
  role: "member" | "lead" | "manager";
  /** @example "active" */
  optionalStatus?: "active" | "inactive";
  /**
   * @format date-time
   * @example "2024-06-25T12:34:56.789Z"
   */
  joinedAt?: string;
}

export interface TeamMemberResponseDto {
  member: TeamMember;
  /** @example true */
  showPassword?: boolean;
  /** @example "password" */
  password?: string;
}

export interface UpdateTeamMemberDto {
  /** @example "John Doe" */
  name?: string;
  /** @example "john@example.com" */
  email?: string;
  /** @example "member" */
  role?: "member" | "lead" | "manager";
  /** @example "active" */
  status?: "active" | "inactive";
  /**
   * @format date-time
   * @example "2024-06-25T12:34:56.789Z"
   */
  joinedAt?: string;
}

export interface CreateOrganizationDto {
  /** @example "Acme Corp" */
  name: string;
  /** @example "info@acme.com" */
  email: string;
  /** @example "info@acme.com" */
  adminEmail?: string;
  /** @example "john-doe" */
  adminUsername?: string;
  /** @example "6478901234" */
  adminPhone?: string;
  /** @example "john doe" */
  adminName: string;
  /** @example "john doe" */
  teamId: string;
  /** @example "pending" */
  status?: "active" | "pending" | "inactive";
}

export interface OrganizationResponseDto {
  organization: Organization;
  /** @example true */
  showPassword?: boolean;
  /** @example "password" */
  password?: string;
}

export interface UpdateOrganizationDto {
  /** @example "Acme Corp" */
  name?: string;
  /** @example "info@acme.com" */
  email?: string;
  /** @example "active" */
  status?: "active" | "pending" | "inactive";
}

export interface MediaDto {
  /** URL of the media file */
  url: string;
  /** S3 key of the media file */
  key: string;
  /** Type of the file */
  fileType: "image" | "video" | "pdf" | "other";
}

export interface OrganizationFilesDto {
  /** List of image files */
  images?: MediaDto[];
  /** List of video files */
  videos?: MediaDto[];
  /** List of PDF files */
  pdfs?: MediaDto[];
  /** List of other files */
  other?: MediaDto[];
}

export interface CreateTaskDto {
  /**
   * Title of the task
   * @example "Fix login bug"
   */
  title: string;
  /**
   * Description of the task
   * @example "Detailed description"
   */
  description: string;
  /**
   * Numeric ID of the organization
   * @example 1
   */
  organizationId: number;
  /**
   * Numeric ID of the team (optional)
   * @example 2
   */
  assignedToTeam?: number;
  /**
   * Numeric ID of the team member (optional)
   * @example 5
   */
  assignedToTeamMember?: number;
  /**
   * Numeric ID of the team member (optional)
   * @example 5
   */
  assignedByTeamMember?: number;
  /**
   * Current status of the task
   * @example "pending"
   */
  status?: "pending" | "in_progress" | "completed";
  /**
   * Priority level of the task
   * @example "medium"
   */
  priority?: "low" | "medium" | "high";
  /**
   * Due date for completing the task
   * @format date-time
   * @example "2024-07-01T00:00:00.000Z"
   */
  dueDate?: string;
}

export interface Task {
  /**
   * Unique ID of the task
   * @example 1
   */
  id: number;
  /** @example "Fix login bug" */
  title: string;
  /** @example "Description of the task" */
  description: string;
  /** @example 1 */
  organizationId: number;
  organization: Organization;
  /** @example 1 */
  assignedToTeam?: number;
  team: Team;
  /** @example 1 */
  assignedToTeamMember?: number;
  assignedToMember: TeamMember;
  /** @example 1 */
  assignedByTeamMember?: number;
  assignedByMember: TeamMember;
  /** @example 1 */
  clientTeamId?: number;
  clientTeam: Team;
  /** @example "pending" */
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "assigned_to_designer"
    | "internal_review"
    | "ready_to_publish"
    | "published";
  /** @example "medium" */
  priority: "low" | "medium" | "high";
  /**
   * @format date-time
   * @example "2025-10-20T00:00:00.000Z"
   */
  dueDate?: string;
  /**
   * @format date-time
   * @example "2025-10-13T12:00:00.000Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2025-10-13T12:00:00.000Z"
   */
  updatedAt: string;
}

export interface TaskHistory {
  /**
   * Unique ID of the task history entry
   * @example 1
   */
  id: number;
  /**
   * ID of the related task
   * @example 12
   */
  taskId: number;
  /**
   * User ID who performed the change
   * @example 5
   */
  changedById: number;
  changedBy: User;
  /**
   * Type of activity recorded in the history
   * @example "status_change"
   */
  type: "created" | "status_change" | "member_change";
  /** @example "pending" */
  oldStatus?: string;
  /** @example "approved" */
  newStatus?: string;
  /**
   * Old assignee team member ID
   * @example 3
   */
  oldAssigneeId?: number;
  /**
   * New assignee team member ID
   * @example 7
   */
  newAssigneeId?: number;
  /**
   * @format date-time
   * @example "2025-10-14T10:00:00.000Z"
   */
  createdAt: string;
}

export interface UpdateTaskDto {
  /** @example "Fix login bug" */
  title?: string;
  /** @example "Detailed description" */
  description?: string;
  /** @example "org-uuid" */
  organizationId?: string;
  /** @example "team-uuid" */
  assignedToTeam?: string;
  /** @example "member-uuid" */
  assignedToTeamMember?: string;
  /** @example "pending" */
  status?: "pending" | "in_progress" | "completed";
  /** @example "medium" */
  priority?: "low" | "medium" | "high";
  /**
   * @format date-time
   * @example "2024-07-01T00:00:00.000Z"
   */
  dueDate?: string;
}

export type Notification = object;

export interface CreateTaskActivityDto {
  /** @example 1 */
  taskId: number;
  /** @example "created" */
  type:
    | "created"
    | "template_submitted"
    | "feedback_provided"
    | "template_revised"
    | "approved"
    | "rejected"
    | "published"
    | "comment"
    | "nudge"
    | "quick_action"
    | "pending"
    | "assigned_to_designer"
    | "internal_review"
    | "ready_to_publish";
  /** @example 1 */
  performedBy: number;
  /** @example "social_media_team" */
  performedByRole: "super_admin" | "social_media_team" | "organization";
  /** @example "A comment" */
  comment?: string;
  /** @example ["https://example.com/embed1","https://example.com/embed2"] */
  embeddedUrl?: any[][];
  /**
   * Array of user IDs mentioned in this activity
   * @example [1,2,3]
   */
  mentions?: number[];
}

export interface TaskActivity {
  /**
   * Unique ID of the user
   * @example 1
   */
  id: number;
  /** @example "created" */
  type:
    | "created"
    | "template_submitted"
    | "feedback_provided"
    | "template_revised"
    | "approved"
    | "rejected"
    | "published"
    | "comment"
    | "nudge"
    | "quick_action"
    | "pending"
    | "assigned_to_designer"
    | "internal_review"
    | "ready_to_publish";
  /** @example "social_media_team" */
  performedByRole: "super_admin" | "social_media_team" | "organization";
  /**
   * @format date-time
   * @example "2024-07-01T12:00:00.000Z"
   */
  timestamp: string;
  media?: FileDTO[];
  /** @example "A comment" */
  comment?: string;
  /** @example ["https://example.com/embed1","https://example.com/embed2"] */
  embeddedUrl?: any[][];
  /** @example 1 */
  performedBy?: number;
  /** @example 1 */
  taskId: number;
  user: User;
  task: Task;
  /**
   * Array of user IDs mentioned in this activity
   * @example [1,2,3]
   */
  mentions?: number[];
}

export interface UpdateTaskActivityDto {
  /** @example "created" */
  type?:
    | "created"
    | "template_submitted"
    | "feedback_provided"
    | "template_revised"
    | "approved"
    | "rejected"
    | "published"
    | "comment";
  /** @example "user-uuid" */
  performedBy?: string;
  /** @example "social_media_team" */
  performedByRole?: "super_admin" | "social_media_team" | "organization";
  /** @example "Details about activity" */
  details?: string;
  /** @example "Feedback text" */
  feedback?: string;
  /** @example "Change summary" */
  changes?: string;
  images?: FileDTO[];
  organizationImages?: FileDTO[];
  teamImages?: FileDTO[];
  /** @example "A comment" */
  comment?: string;
  /** @example "template-uuid" */
  templateId?: string;
  /**
   * @format date-time
   * @example "2024-07-01T12:00:00.000Z"
   */
  timestamp?: string;
}

export interface CreateTemplateDto {
  /** @example "task-uuid" */
  taskId?: string;
  /** @example "org-uuid" */
  organizationId: string;
  /** @example "<p>HTML content</p>" */
  content: string;
  /** @example "https://example.com/image.png" */
  imageUrl?: string;
  /** @example "draft" */
  status?:
    | "draft"
    | "pending"
    | "submitted"
    | "approved"
    | "rejected"
    | "published";
  /** @example "Feedback" */
  feedback?: string;
  /** @example ["https://.../1.png"] */
  feedbackImages?: string[];
  /** @example "user-uuid" */
  createdBy: string;
  /**
   * @format date-time
   * @example "2024-07-01T12:00:00.000Z"
   */
  publishedAt?: string;
  /**
   * @format date-time
   * @example "2024-07-02T12:00:00.000Z"
   */
  approvedAt?: string;
}

export interface Template {
  /**
   * Unique ID of the user
   * @example 1
   */
  id: number;
  /** @example "<p>Template HTML content</p>" */
  content: string;
  /** @example "https://example.com/image.png" */
  imageUrl?: string;
  /** @example "draft" */
  status:
    | "draft"
    | "pending"
    | "submitted"
    | "approved"
    | "rejected"
    | "published";
  /** @example "Feedback comment" */
  feedback?: string;
  /** @example ["https://.../1.png"] */
  feedbackImages?: string[];
  /** @example "user-uuid" */
  createdBy: string;
  /**
   * @format date-time
   * @example "2024-06-25T12:34:56.789Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2024-07-01T12:00:00.000Z"
   */
  publishedAt?: string;
  /**
   * @format date-time
   * @example "2024-07-02T12:00:00.000Z"
   */
  approvedAt?: string;
  /** @example 1 */
  organizationId: number;
  /** @example 1 */
  taskId?: number;
}

export interface UpdateTemplateDto {
  /** @example "task-uuid" */
  taskId?: string;
  /** @example "org-uuid" */
  organizationId?: string;
  /** @example "<p>HTML content</p>" */
  content?: string;
  /** @example "https://example.com/image.png" */
  imageUrl?: string;
  /** @example "draft" */
  status?:
    | "draft"
    | "pending"
    | "submitted"
    | "approved"
    | "rejected"
    | "published";
  /** @example "Feedback" */
  feedback?: string;
  /** @example ["https://.../1.png"] */
  feedbackImages?: string[];
  /** @example "user-uuid" */
  createdBy?: string;
  /**
   * @format date-time
   * @example "2024-07-01T12:00:00.000Z"
   */
  publishedAt?: string;
  /**
   * @format date-time
   * @example "2024-07-02T12:00:00.000Z"
   */
  approvedAt?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance
      .request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type ? { "Content-Type": type } : {}),
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      })
      .then((response) => response.data);
  };
}

/**
 * @title Social Media API
 * @version 1.0
 * @contact
 *
 * NestJS + Sequelize + Swagger
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags App
     * @name AppControllerGetHello
     * @request GET:/api
     */
    appControllerGetHello: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name AuthControllerRegister
     * @summary Register a new user
     * @request POST:/api/auth/register
     */
    authControllerRegister: (data: SignUpDto, params: RequestParams = {}) =>
      this.request<SignInResponseDto, void>({
        path: `/api/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name AuthControllerRefreshToken
     * @summary Refresh user token
     * @request POST:/api/auth/refresh-token
     */
    authControllerRefreshToken: (
      data: RefreshTokenDto,
      params: RequestParams = {},
    ) =>
      this.request<SignInResponseDto, void>({
        path: `/api/auth/refresh-token`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Sign in and receive role contexts. If user has multiple roles, requiresRoleSelection will be true and client must call /select-role-context.
     *
     * @tags Authentication
     * @name AuthControllerSignIn
     * @summary User login
     * @request POST:/api/auth/sign-in
     */
    authControllerSignIn: (data: SignInDto, params: RequestParams = {}) =>
      this.request<SignInResponseDto, void>({
        path: `/api/auth/sign-in`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Called when user has multiple role contexts and needs to select one to proceed.
     *
     * @tags Authentication
     * @name AuthControllerSelectRoleContext
     * @summary Select role context after sign-in
     * @request POST:/api/auth/select-role-context
     */
    authControllerSelectRoleContext: (
      data: SelectContextDto,
      params: RequestParams = {},
    ) =>
      this.request<SelectRoleContextResponseDto, void>({
        path: `/api/auth/select-role-context`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name AuthControllerResetPasswordByEmail
     * @summary Generate and set a new password for a user by email
     * @request POST:/api/auth/reset-password
     */
    authControllerResetPasswordByEmail: (
      data: ResetPasswordByEmailDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/auth/reset-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name AuthControllerForgotPassword
     * @summary Request a password reset OTP
     * @request POST:/api/auth/forgot-password
     */
    authControllerForgotPassword: (
      data: ForgotPasswordDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/auth/forgot-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name AuthControllerVerifyOtp
     * @summary Verify the password reset OTP
     * @request POST:/api/auth/verify-otp
     */
    authControllerVerifyOtp: (data: VerifyOtpDto, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/auth/verify-otp`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name AuthControllerResetPassword
     * @summary Reset password using OTP
     * @request POST:/api/auth/reset-password-otp
     */
    authControllerResetPassword: (
      data: ResetPasswordDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/auth/reset-password-otp`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name AuthControllerSignInWithPhone
     * @summary Request OTP for phone-based sign-in
     * @request POST:/api/auth/signin-with-phone
     */
    authControllerSignInWithPhone: (
      data: SignInWithPhoneDto,
      params: RequestParams = {},
    ) =>
      this.request<any, any>({
        path: `/api/auth/signin-with-phone`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Verify OTP and receive role contexts. If user has multiple roles, requiresRoleSelection will be true and client must call /select-role-context.
     *
     * @tags Authentication
     * @name AuthControllerVerifyPhoneOtp
     * @summary Verify phone OTP and sign in
     * @request POST:/api/auth/verify-phone-otp
     */
    authControllerVerifyPhoneOtp: (
      data: VerifyPhoneOtpDto,
      params: RequestParams = {},
    ) =>
      this.request<SignInResponseDto, void>({
        path: `/api/auth/verify-phone-otp`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Sign in using username and password and receive role contexts. If user has multiple roles, requiresRoleSelection will be true and client must call /select-role-context.
     *
     * @tags Authentication
     * @name AuthControllerSignInWithUsername
     * @summary User login with username
     * @request POST:/api/auth/signin-with-username
     */
    authControllerSignInWithUsername: (
      data: SignInWithUsernameDto,
      params: RequestParams = {},
    ) =>
      this.request<SignInResponseDto, void>({
        path: `/api/auth/signin-with-username`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name AuthControllerMigrateRoles
     * @summary Migrate legacy user roles to new RoleContext system
     * @request POST:/api/auth/migrate-roles
     */
    authControllerMigrateRoles: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/migrate-roles`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UserControllerGetMe
     * @summary Get current user info
     * @request GET:/api/users/me
     * @secure
     */
    userControllerGetMe: (params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/api/users/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UserControllerFindAll
     * @summary Get all users
     * @request GET:/api/users
     */
    userControllerFindAll: (params: RequestParams = {}) =>
      this.request<User[], any>({
        path: `/api/users`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UserControllerFindOne
     * @summary Get user by ID
     * @request GET:/api/users/{id}
     */
    userControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/api/users/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UserControllerUpdate
     * @summary Update user by ID
     * @request PATCH:/api/users/{id}
     */
    userControllerUpdate: (
      id: string,
      data: UpdateUserDto,
      params: RequestParams = {},
    ) =>
      this.request<User, any>({
        path: `/api/users/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UserControllerDelete
     * @summary Delete user by ID
     * @request DELETE:/api/users/{id}
     */
    userControllerDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags role-contexts
     * @name RoleContextControllerCreate
     * @summary Assign a role to a user
     * @request POST:/api/role-contexts
     */
    roleContextControllerCreate: (
      data: CreateRoleContextDto,
      params: RequestParams = {},
    ) =>
      this.request<RoleContext, any>({
        path: `/api/role-contexts`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags role-contexts
     * @name RoleContextControllerFindAll
     * @summary Get all role contexts
     * @request GET:/api/role-contexts
     */
    roleContextControllerFindAll: (
      query?: {
        /**
         * Filter by user ID
         * @example 1
         */
        userId?: number;
        /**
         * Filter by role ID
         * @example 1
         */
        roleId?: number;
        /**
         * Filter by organization ID
         * @example 5
         */
        organizationId?: number;
        /**
         * Filter by school ID
         * @example 10
         */
        schoolId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<RoleContext[], any>({
        path: `/api/role-contexts`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags role-contexts
     * @name RoleContextControllerFindByUserId
     * @summary Get all role contexts for a specific user
     * @request GET:/api/role-contexts/user/{userId}
     */
    roleContextControllerFindByUserId: (
      userId: number,
      params: RequestParams = {},
    ) =>
      this.request<RoleContext[], any>({
        path: `/api/role-contexts/user/${userId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags role-contexts
     * @name RoleContextControllerFindOne
     * @summary Get a role context by ID
     * @request GET:/api/role-contexts/{id}
     */
    roleContextControllerFindOne: (id: number, params: RequestParams = {}) =>
      this.request<RoleContext, void>({
        path: `/api/role-contexts/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags role-contexts
     * @name RoleContextControllerUpdate
     * @summary Update a role context
     * @request PATCH:/api/role-contexts/{id}
     */
    roleContextControllerUpdate: (
      id: number,
      data: UpdateRoleContextDto,
      params: RequestParams = {},
    ) =>
      this.request<RoleContext, void>({
        path: `/api/role-contexts/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags role-contexts
     * @name RoleContextControllerRemove
     * @summary Remove a role context
     * @request DELETE:/api/role-contexts/{id}
     */
    roleContextControllerRemove: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/role-contexts/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags roles
     * @name RoleControllerCreate
     * @summary Create a new role
     * @request POST:/api/roles
     */
    roleControllerCreate: (data: CreateRoleDto, params: RequestParams = {}) =>
      this.request<Role, any>({
        path: `/api/roles`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags roles
     * @name RoleControllerFindAll
     * @summary Get all roles
     * @request GET:/api/roles
     */
    roleControllerFindAll: (
      query?: {
        /** Filter by role scope */
        scope?: "Organization" | "Platform";
        /**
         * Filter by active status
         * @example true
         */
        isActive?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<Role[], any>({
        path: `/api/roles`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags roles
     * @name RoleControllerFindOne
     * @summary Get a role by ID
     * @request GET:/api/roles/{id}
     */
    roleControllerFindOne: (id: number, params: RequestParams = {}) =>
      this.request<Role, void>({
        path: `/api/roles/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags roles
     * @name RoleControllerUpdate
     * @summary Update a role
     * @request PATCH:/api/roles/{id}
     */
    roleControllerUpdate: (
      id: number,
      data: UpdateRoleDto,
      params: RequestParams = {},
    ) =>
      this.request<Role, void>({
        path: `/api/roles/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags roles
     * @name RoleControllerRemove
     * @summary Delete a role
     * @request DELETE:/api/roles/{id}
     */
    roleControllerRemove: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/roles/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Teams
     * @name TeamControllerCreate
     * @summary Create a new team
     * @request POST:/api/teams
     */
    teamControllerCreate: (data: CreateTeamDto, params: RequestParams = {}) =>
      this.request<Team, any>({
        path: `/api/teams`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Teams
     * @name TeamControllerFindAll
     * @summary Get all teams
     * @request GET:/api/teams
     */
    teamControllerFindAll: (params: RequestParams = {}) =>
      this.request<Team[], any>({
        path: `/api/teams`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Teams
     * @name TeamControllerFindOne
     * @summary Get team by ID
     * @request GET:/api/teams/{id}
     */
    teamControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<Team, any>({
        path: `/api/teams/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Teams
     * @name TeamControllerUpdate
     * @summary Update team by ID
     * @request PATCH:/api/teams/{id}
     */
    teamControllerUpdate: (
      id: string,
      data: UpdateTeamDto,
      params: RequestParams = {},
    ) =>
      this.request<Team, any>({
        path: `/api/teams/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Teams
     * @name TeamControllerDelete
     * @summary Delete team by ID
     * @request DELETE:/api/teams/{id}
     */
    teamControllerDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/teams/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Teams
     * @name TeamControllerUpdateStatus
     * @summary Update team status
     * @request PATCH:/api/teams/{id}/status
     */
    teamControllerUpdateStatus: (
      id: string,
      data: {
        status: "active" | "inactive";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/teams/${id}/status`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Teams
     * @name TeamControllerFindByStatus
     * @summary Get teams by status
     * @request GET:/api/teams/status/{status}
     */
    teamControllerFindByStatus: (
      status: "active" | "inactive",
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/teams/status/${status}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Teams
     * @name TeamControllerChangeMemberCount
     * @summary Adjust team member count
     * @request POST:/api/teams/{id}/change-member-count
     */
    teamControllerChangeMemberCount: (
      id: string,
      data: {
        delta: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/teams/${id}/change-member-count`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Team Members
     * @name TeamMemberControllerCreate
     * @summary Create a new team member
     * @request POST:/api/team-members
     */
    teamMemberControllerCreate: (
      data: CreateTeamMemberDto,
      params: RequestParams = {},
    ) =>
      this.request<TeamMemberResponseDto, any>({
        path: `/api/team-members`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Team Members
     * @name TeamMemberControllerFindAll
     * @summary Get all team members
     * @request GET:/api/team-members
     */
    teamMemberControllerFindAll: (params: RequestParams = {}) =>
      this.request<TeamMember[], any>({
        path: `/api/team-members`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Team Members
     * @name TeamMemberControllerFindOne
     * @summary Get team member by id
     * @request GET:/api/team-members/{id}
     */
    teamMemberControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<TeamMember, any>({
        path: `/api/team-members/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Team Members
     * @name TeamMemberControllerUpdate
     * @summary Update a team member
     * @request PATCH:/api/team-members/{id}
     */
    teamMemberControllerUpdate: (
      id: string,
      data: UpdateTeamMemberDto,
      params: RequestParams = {},
    ) =>
      this.request<TeamMember, any>({
        path: `/api/team-members/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Team Members
     * @name TeamMemberControllerDelete
     * @summary Delete a team member
     * @request DELETE:/api/team-members/{id}
     */
    teamMemberControllerDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/team-members/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Team Members
     * @name TeamMemberControllerUpdateStatus
     * @summary Update team member status
     * @request PATCH:/api/team-members/{id}/status
     */
    teamMemberControllerUpdateStatus: (
      id: string,
      data: {
        status: "active" | "inactive";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/team-members/${id}/status`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Team Members
     * @name TeamMemberControllerFindByUser
     * @summary Get member by user ID
     * @request GET:/api/team-members/user/{userId}
     */
    teamMemberControllerFindByUser: (
      userId: number,
      params: RequestParams = {},
    ) =>
      this.request<TeamMember, any>({
        path: `/api/team-members/user/${userId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Team Members
     * @name TeamMemberControllerFindByTeam
     * @summary Get members by team
     * @request GET:/api/team-members/team/{teamId}
     */
    teamMemberControllerFindByTeam: (
      teamId: string,
      params: RequestParams = {},
    ) =>
      this.request<TeamMember[], any>({
        path: `/api/team-members/team/${teamId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Team Members
     * @name TeamMemberControllerAssignToTeam
     * @summary Assign member to a team
     * @request POST:/api/team-members/{id}/assign-team
     */
    teamMemberControllerAssignToTeam: (
      id: string,
      data: {
        teamId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/team-members/${id}/assign-team`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationControllerCreate
     * @summary Create an organization
     * @request POST:/api/organizations
     */
    organizationControllerCreate: (
      data: CreateOrganizationDto,
      params: RequestParams = {},
    ) =>
      this.request<OrganizationResponseDto, any>({
        path: `/api/organizations`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationControllerFindAll
     * @summary Get all organizations
     * @request GET:/api/organizations
     */
    organizationControllerFindAll: (
      query?: {
        /** @example "Acme Corp" */
        teamId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Organization[], any>({
        path: `/api/organizations`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationControllerUploadGallery
     * @summary Upload gallery images for an organization
     * @request POST:/api/organizations/{id}/gallery
     */
    organizationControllerUploadGallery: (
      id: number,
      data: {
        /** Gallery images to upload */
        files?: File[];
      },
      params: RequestParams = {},
    ) =>
      this.request<FileDTO[], any>({
        path: `/api/organizations/${id}/gallery`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationControllerFindOne
     * @summary Get organization by id
     * @request GET:/api/organizations/{id}
     */
    organizationControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<Organization, any>({
        path: `/api/organizations/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationControllerUpdate
     * @summary Update organization
     * @request PATCH:/api/organizations/{id}
     */
    organizationControllerUpdate: (
      id: string,
      data: UpdateOrganizationDto,
      params: RequestParams = {},
    ) =>
      this.request<Organization, any>({
        path: `/api/organizations/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationControllerDelete
     * @summary Delete organization
     * @request DELETE:/api/organizations/{id}
     */
    organizationControllerDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/organizations/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationControllerUpdateStatus
     * @summary Update organization status
     * @request PATCH:/api/organizations/{id}/status
     */
    organizationControllerUpdateStatus: (
      id: string,
      data: {
        status: "active" | "pending" | "inactive";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/organizations/${id}/status`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationControllerFindByStatus
     * @summary Get organizations by status
     * @request GET:/api/organizations/status/{status}
     */
    organizationControllerFindByStatus: (
      status: "active" | "pending" | "inactive",
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/organizations/status/${status}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationControllerFindByUser
     * @summary Get organizations by user
     * @request GET:/api/organizations/user/{userId}
     */
    organizationControllerFindByUser: (
      userId: number,
      params: RequestParams = {},
    ) =>
      this.request<Organization[], Organization[]>({
        path: `/api/organizations/user/${userId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationControllerGetMedia
     * @summary Get organization media grouped by type
     * @request GET:/api/organizations/{id}/media
     */
    organizationControllerGetMedia: (
      id: number,
      query?: {
        /** Optional folder filter, e.g., task-activities */
        folder?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<OrganizationFilesDto, any>({
        path: `/api/organizations/${id}/media`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tasks
     * @name TaskControllerCreate
     * @summary Create a task
     * @request POST:/api/tasks
     */
    taskControllerCreate: (data: CreateTaskDto, params: RequestParams = {}) =>
      this.request<Task, any>({
        path: `/api/tasks`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tasks
     * @name TaskControllerFindAll
     * @summary Get all tasks
     * @request GET:/api/tasks
     */
    taskControllerFindAll: (params: RequestParams = {}) =>
      this.request<Task[], any>({
        path: `/api/tasks`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tasks
     * @name TaskControllerFindAllTeamMembersOfATask
     * @summary Get all members of a task
     * @request GET:/api/tasks/{id}/team-members
     */
    taskControllerFindAllTeamMembersOfATask: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<TeamMember[], any>({
        path: `/api/tasks/${id}/team-members`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tasks
     * @name TaskControllerFindOne
     * @summary Get task by id
     * @request GET:/api/tasks/{id}
     */
    taskControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<Task, any>({
        path: `/api/tasks/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tasks
     * @name TaskControllerUpdate
     * @summary Update task
     * @request PATCH:/api/tasks/{id}
     */
    taskControllerUpdate: (
      id: string,
      data: UpdateTaskDto,
      params: RequestParams = {},
    ) =>
      this.request<Task, any>({
        path: `/api/tasks/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tasks
     * @name TaskControllerDelete
     * @summary Delete task
     * @request DELETE:/api/tasks/{id}
     */
    taskControllerDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/tasks/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tasks
     * @name TaskControllerFindUsersInTask
     * @summary Get all users in a task
     * @request GET:/api/tasks/{id}/users
     */
    taskControllerFindUsersInTask: (id: string, params: RequestParams = {}) =>
      this.request<User[], any>({
        path: `/api/tasks/${id}/users`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tasks
     * @name TaskControllerGetTaskHistory
     * @summary Get full task history (status changes, member assignments, etc.)
     * @request GET:/api/tasks/{id}/history
     */
    taskControllerGetTaskHistory: (id: string, params: RequestParams = {}) =>
      this.request<TaskHistory[], any>({
        path: `/api/tasks/${id}/history`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tasks
     * @name TaskControllerUpdateStatus
     * @summary Update task status (and log in TaskHistory)
     * @request PATCH:/api/tasks/{id}/status
     */
    taskControllerUpdateStatus: (
      id: string,
      data: {
        status:
          | "pending"
          | "approved"
          | "rejected"
          | "assigned_to_designer"
          | "internal_review"
          | "ready_to_publish"
          | "published";
        /** ID of the user changing status */
        userId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Task, any>({
        path: `/api/tasks/${id}/status`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tasks
     * @name TaskControllerAssignToTeam
     * @summary Assign task to team
     * @request POST:/api/tasks/{id}/assign-team
     */
    taskControllerAssignToTeam: (
      id: string,
      data: {
        teamId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/tasks/${id}/assign-team`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tasks
     * @name TaskControllerAssignToMember
     * @summary Assign or reassign task to a team member (and log in TaskHistory)
     * @request POST:/api/tasks/{id}/assign-member
     */
    taskControllerAssignToMember: (
      id: string,
      data: {
        memberId: number;
        /** ID of the user making the change */
        userId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Task, any>({
        path: `/api/tasks/${id}/assign-member`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tasks
     * @name TaskControllerFindByOrganization
     * @summary Get tasks by organization
     * @request GET:/api/tasks/organization/{orgId}
     */
    taskControllerFindByOrganization: (
      orgId: string,
      query: {
        /** @example "status" */
        search?: string;
        /** @example "pending" */
        status:
          | "pending"
          | "approved"
          | "rejected"
          | "assigned_to_designer"
          | "internal_review"
          | "ready_to_publish"
          | "published";
        /** @example "1" */
        userId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Task[], any>({
        path: `/api/tasks/organization/${orgId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tasks
     * @name TaskControllerFindByAssigneeTeam
     * @summary Get tasks assigned to a team
     * @request GET:/api/tasks/assignee/team/{teamId}
     */
    taskControllerFindByAssigneeTeam: (
      teamId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/tasks/assignee/team/${teamId}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tasks
     * @name TaskControllerFindByAssigneeMember
     * @summary Get tasks assigned to a member
     * @request GET:/api/tasks/assignee/member/{memberId}
     */
    taskControllerFindByAssigneeMember: (
      memberId: string,
      params: RequestParams = {},
    ) =>
      this.request<Task[], any>({
        path: `/api/tasks/assignee/member/${memberId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tasks
     * @name TaskControllerFindOverdue
     * @summary Get overdue tasks
     * @request GET:/api/tasks/overdue
     */
    taskControllerFindOverdue: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/tasks/overdue`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notifications
     * @name NotificationControllerGetForUser
     * @summary Get all notifications for a user
     * @request GET:/api/notifications/user/{userId}
     */
    notificationControllerGetForUser: (
      userId: number,
      params: RequestParams = {},
    ) =>
      this.request<Notification[], any>({
        path: `/api/notifications/user/${userId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notifications
     * @name NotificationControllerGetUnreadForUser
     * @summary Get unread notifications for a user
     * @request GET:/api/notifications/user/{userId}/unread
     */
    notificationControllerGetUnreadForUser: (
      userId: number,
      params: RequestParams = {},
    ) =>
      this.request<Notification[], any>({
        path: `/api/notifications/user/${userId}/unread`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notifications
     * @name NotificationControllerMarkRead
     * @summary Mark a specific notification as read
     * @request POST:/api/notifications/{id}/read
     */
    notificationControllerMarkRead: (
      id: number,
      data: {
        userId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Notification, void>({
        path: `/api/notifications/${id}/read`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notifications
     * @name NotificationControllerMarkAllRead
     * @summary Mark all notifications as read for a user
     * @request POST:/api/notifications/user/{userId}/read-all
     */
    notificationControllerMarkAllRead: (
      userId: number,
      params: RequestParams = {},
    ) =>
      this.request<boolean, any>({
        path: `/api/notifications/user/${userId}/read-all`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Task Activities
     * @name TaskActivityControllerCreate
     * @summary Create a task activity
     * @request POST:/api/task-activities
     */
    taskActivityControllerCreate: (
      data: CreateTaskActivityDto,
      params: RequestParams = {},
    ) =>
      this.request<TaskActivity, any>({
        path: `/api/task-activities`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Task Activities
     * @name TaskActivityControllerFindAll
     * @summary Get all activities
     * @request GET:/api/task-activities
     */
    taskActivityControllerFindAll: (params: RequestParams = {}) =>
      this.request<TaskActivity[], any>({
        path: `/api/task-activities`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Task Activities
     * @name TaskActivityControllerFindOne
     * @summary Get activity by id
     * @request GET:/api/task-activities/{id}
     */
    taskActivityControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<TaskActivity, any>({
        path: `/api/task-activities/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Task Activities
     * @name TaskActivityControllerUpdate
     * @summary Update activity
     * @request PATCH:/api/task-activities/{id}
     */
    taskActivityControllerUpdate: (
      id: string,
      data: UpdateTaskActivityDto,
      params: RequestParams = {},
    ) =>
      this.request<TaskActivity, any>({
        path: `/api/task-activities/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Task Activities
     * @name TaskActivityControllerDelete
     * @summary Delete activity
     * @request DELETE:/api/task-activities/{id}
     */
    taskActivityControllerDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/task-activities/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Task Activities
     * @name TaskActivityControllerFindByTask
     * @summary Get activities for a task
     * @request GET:/api/task-activities/task/{taskId}
     */
    taskActivityControllerFindByTask: (
      taskId: string,
      params: RequestParams = {},
    ) =>
      this.request<any, TaskActivity[]>({
        path: `/api/task-activities/task/${taskId}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Task Activities
     * @name TaskActivityControllerFindByTemplate
     * @summary Get activities for a template
     * @request GET:/api/task-activities/template/{templateId}
     */
    taskActivityControllerFindByTemplate: (
      templateId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/task-activities/template/${templateId}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Task Activities
     * @name TaskActivityControllerFindByPerformer
     * @summary Get activities by performer
     * @request GET:/api/task-activities/performer/{performedBy}
     */
    taskActivityControllerFindByPerformer: (
      performedBy: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/task-activities/performer/${performedBy}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Task Activities
     * @name TaskActivityControllerFindByType
     * @summary Get activities by type
     * @request GET:/api/task-activities/type/{type}
     */
    taskActivityControllerFindByType: (
      type: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/task-activities/type/${type}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Templates
     * @name TemplateControllerCreate
     * @summary Create a template
     * @request POST:/api/templates
     */
    templateControllerCreate: (
      data: CreateTemplateDto,
      params: RequestParams = {},
    ) =>
      this.request<Template, any>({
        path: `/api/templates`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Templates
     * @name TemplateControllerFindAll
     * @summary Get all templates
     * @request GET:/api/templates
     */
    templateControllerFindAll: (params: RequestParams = {}) =>
      this.request<Template[], any>({
        path: `/api/templates`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Templates
     * @name TemplateControllerFindOne
     * @summary Get template by id
     * @request GET:/api/templates/{id}
     */
    templateControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<Template, any>({
        path: `/api/templates/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Templates
     * @name TemplateControllerUpdate
     * @summary Update template
     * @request PATCH:/api/templates/{id}
     */
    templateControllerUpdate: (
      id: string,
      data: UpdateTemplateDto,
      params: RequestParams = {},
    ) =>
      this.request<Template, any>({
        path: `/api/templates/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Templates
     * @name TemplateControllerDelete
     * @summary Delete template
     * @request DELETE:/api/templates/{id}
     */
    templateControllerDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/templates/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Templates
     * @name TemplateControllerUpdateStatus
     * @summary Update template status
     * @request PATCH:/api/templates/{id}/status
     */
    templateControllerUpdateStatus: (
      id: string,
      data: {
        status:
          | "draft"
          | "pending"
          | "submitted"
          | "approved"
          | "rejected"
          | "published";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/templates/${id}/status`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Templates
     * @name TemplateControllerPublish
     * @summary Publish a template
     * @request POST:/api/templates/{id}/publish
     */
    templateControllerPublish: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/templates/${id}/publish`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Templates
     * @name TemplateControllerApprove
     * @summary Approve a template
     * @request POST:/api/templates/{id}/approve
     */
    templateControllerApprove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/templates/${id}/approve`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Templates
     * @name TemplateControllerReject
     * @summary Reject a template
     * @request POST:/api/templates/{id}/reject
     */
    templateControllerReject: (
      id: string,
      data: {
        feedback?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/templates/${id}/reject`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Templates
     * @name TemplateControllerSubmitFeedback
     * @summary Submit feedback for a template
     * @request POST:/api/templates/{id}/feedback
     */
    templateControllerSubmitFeedback: (
      id: string,
      data: {
        feedback: string;
        images?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/templates/${id}/feedback`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Templates
     * @name TemplateControllerFindByOrganization
     * @summary Get templates by organization
     * @request GET:/api/templates/organization/{orgId}
     */
    templateControllerFindByOrganization: (
      orgId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/templates/organization/${orgId}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Templates
     * @name TemplateControllerFindByTask
     * @summary Get templates by task
     * @request GET:/api/templates/task/{taskId}
     */
    templateControllerFindByTask: (
      taskId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/templates/task/${taskId}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Templates
     * @name TemplateControllerFindPublished
     * @summary Get published templates
     * @request GET:/api/templates/published
     */
    templateControllerFindPublished: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/templates/published`,
        method: "GET",
        ...params,
      }),
  };
}
