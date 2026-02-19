import { RoleContext } from "@/src/api/api";

/**
 * Determines the appropriate route based on a role context
 */
export function getRouteForRoleContext(context: RoleContext): string {
  // Check if this is an organization-scoped role
  if (context.organizationId) {
    return "/organization";
  }

  // Check if this is a team-scoped role
  if (context.teamId) {
    return "/team";
  }

  // Platform-level role - default to admin
  return "/admin";
}

/**
 * Role title to route mapping (legacy support)
 * Use this if you have the role title directly
 */
export function getRouteForRoleTitle(roleTitle: string): string {
  const routeMap: Record<string, string> = {
    "Platform Admin": "/admin",
    "Organization Admin": "/organization",
    "Team Member": "/team",
  };

  return routeMap[roleTitle] || "/";
}

/**
 * Gets a user-friendly display name for a role context scope
 */
export function getRoleScopeLabel(context: RoleContext): string {
  if (context.organizationId) {
    return "Organization";
  }
  if (context.teamId) {
    return "Team";
  }
  return "Platform";
}

/**
 * Checks if a user has a specific role context
 */
export function hasRoleContext(
  roleContexts: RoleContext[],
  criteria: {
    roleId?: number;
    organizationId?: number;
    teamId?: number;
  }
): boolean {
  return roleContexts.some((context) => {
    if (criteria.roleId && context.roleId !== criteria.roleId) {
      return false;
    }
    if (criteria.organizationId && context.organizationId !== criteria.organizationId) {
      return false;
    }
    if (criteria.teamId && context.teamId !== criteria.teamId) {
      return false;
    }
    return true;
  });
}

/**
 * Checks if a role context is platform-level (not scoped to organization or team)
 */
export function isPlatformRole(context: RoleContext): boolean {
  return !context.organizationId && !context.teamId;
}

/**
 * Checks if a role context is organization-scoped
 */
export function isOrganizationRole(context: RoleContext): boolean {
  return !!context.organizationId;
}

/**
 * Checks if a role context is team-scoped
 */
export function isTeamRole(context: RoleContext): boolean {
  return !!context.teamId;
}

