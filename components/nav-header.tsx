"use client"

import { useAuth } from "@/app/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { User } from "@/src/api/api"
import { LogOut, UserIcon, Settings, RefreshCw, ChevronDown, Mail, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import http from "@/src/api"
import { toast } from "sonner"
import { RoleContext } from "@/src/api/api"
import { getRouteForRoleContext } from "@/lib/role-utils"
import { Building2, Users, Check } from "lucide-react"

interface NavHeaderProps {
  user?: User | any
  title: string
}

export function NavHeader({ user, title }: NavHeaderProps) {
  console.log("NavHeader user:", user)
  const { logout, roleContexts, selectedRoleContext, setToken, setSelectedRoleContext } = useAuth()
  const router = useRouter()

  const { mutate: selectRoleContext, isPending: isSelecting } = useMutation({
    mutationFn: async (roleContextId: number) => {
      if (!user) throw new Error("User not found")

      const response = await http.api.authControllerSelectRoleContext({
        userId: user.id,
        roleContextId,
      })
      return response
    },
    onSuccess: (data) => {
      console.log("Role context selected:", data)

      // Store the access token and selected role context
      setToken(data.accessToken)
      setSelectedRoleContext(data.selectedRoleContext)

      toast.success("Role context switched successfully")

      // Navigate based on the selected role context
      const route = getRouteForRoleContext(data.selectedRoleContext)
      router.push(route)
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to switch role context. Please try again."

      toast.error(errorMessage)
    },
  })

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"
  }

  const handleChangeRole = () => {
    router.push("/select-role")
  }

  const handleSettings = () => {
    router.push("/settings")
  }

  const handleSelectRoleContext = (context: RoleContext) => {
    if (context.id === selectedRoleContext?.id) return
    selectRoleContext(context.id)
  }

  const getRoleIcon = (context: RoleContext) => {
    if (context.organizationId) {
      return <Building2 className="h-4 w-4" />
    } else if (context.teamId) {
      return <Users className="h-4 w-4" />
    } else {
      return <Shield className="h-4 w-4" />
    }
  }

  const getRoleLabel = (context: RoleContext) => {
    const roleName = context.role?.title || "Unknown Role"
    let entityName = "Platform Wide"

    if (context.organizationId && context.organization) {
      entityName = context.organization.name
    } else if (context.teamId && context.team) {
      entityName = context.team.name
    }

    return `${roleName} • ${entityName}`
  }

  return (
    <header className="border-b bg-gradient-to-r from-card to-muted/30 backdrop-blur-sm">
      <div className="flex h-20 items-center justify-between px-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserIcon className="h-3.5 w-3.5" />
            <span>{user?.fullName}</span>
            {selectedRoleContext && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {getRoleLabel(selectedRoleContext)}
              </span>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 hover:bg-muted/50">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profile?.url} alt={user?.fullName} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(user?.fullName || "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{user?.fullName}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                <p className="text-xs leading-none text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {roleContexts && roleContexts.length > 1 && (
              <>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span>Switch Role</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {roleContexts.length}
                    </span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-56">
                    <DropdownMenuLabel>Available Roles</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {roleContexts.map((context) => (
                      <DropdownMenuItem
                        key={context.id}
                        onClick={() => handleSelectRoleContext(context)}
                        disabled={isSelecting || context.id === selectedRoleContext?.id}
                        className="cursor-pointer flex items-center gap-2"
                      >
                        {getRoleIcon(context)}
                        <span className="flex-1">{getRoleLabel(context)}</span>
                        {context.id === selectedRoleContext?.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}
