"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { User, RoleContext } from "@/src/api/api";
import { getRouteForRoleContext } from "@/lib/role-utils";

type UseProtectedRouteOptions = {
  requiredRoleId?: number; // Role ID instead of role name
  requiredOrganizationId?: number; // Optional: require specific organization
  requiredTeamId?: number; // Optional: require specific team
  requirePlatformRole?: boolean; // Optional: require platform-level role
  redirectTo?: string;
  skip?: boolean; // ✅ optional flag to skip protection
};

type UseProtectedRouteReturn = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAuthorized: boolean;
  selectedRoleContext: RoleContext | null;
  roleContexts: RoleContext[];
};

// ✅ Main function signature with options
export function useProtectedRoute(
  options?: UseProtectedRouteOptions
): UseProtectedRouteReturn {
  const { user, isLoading, isAuthenticated, selectedRoleContext, roleContexts } = useAuth();
  const router = useRouter();

  // Default values
  const redirectTo = options?.redirectTo || "/login";
  const skip = options?.skip || false;
  const requiredRoleId = options?.requiredRoleId;
  const requiredOrganizationId = options?.requiredOrganizationId;
  const requiredTeamId = options?.requiredTeamId;
  const requirePlatformRole = options?.requirePlatformRole || false;

  // Check if user has the required role context
  const checkRoleAuthorization = (): boolean => {
    if (!user || !isAuthenticated) return false;

    // If no specific requirements, just check authentication
    if (!requiredRoleId && !requiredOrganizationId && !requiredTeamId && !requirePlatformRole) {
      return true;
    }

    // Check if user has a matching role context
    const hasMatchingRole = roleContexts.some((context) => {
      // Check role ID if specified
      if (requiredRoleId && context.roleId !== requiredRoleId) {
        return false;
      }

      // Check organization ID if specified
      if (requiredOrganizationId && context.organizationId !== requiredOrganizationId) {
        return false;
      }

      // Check team ID if specified
      if (requiredTeamId && context.teamId !== requiredTeamId) {
        return false;
      }

      // Check platform role requirement
      if (requirePlatformRole && (context.organizationId || context.teamId)) {
        return false;
      }

      return true;
    });

    return hasMatchingRole;
  };

  const isAuthorized = checkRoleAuthorization();

  useEffect(() => {
    // ✅ If skip is true (e.g., ?token= in URL), skip auth checks
    if (skip) return;

    // Don't redirect while auth state is loading
    if (isLoading) return;

    // Redirect unauthenticated users
    if (!isAuthenticated || !user) {
      console.log("🔒 useProtectedRoute: Not authenticated, redirecting to", redirectTo);
      router.push(redirectTo);
      return;
    }

    // Redirect if user doesn't have required role context
    if (!isAuthorized) {
      console.warn("⚠️ User does not have required role context. Available contexts:", roleContexts);
      console.warn("⚠️ Requirements:", {
        requiredRoleId,
        requiredOrganizationId,
        requiredTeamId,
        requirePlatformRole
      });
      
      // Don't redirect to login if user is authenticated but lacks specific role
      // Instead, redirect to home or role selection
      if (roleContexts.length > 1) {
        router.push("/select-role");
      } else if (roleContexts.length === 1) {
        // User has only one role, navigate to appropriate dashboard
        const route = getRouteForRoleContext(roleContexts[0]);
        router.push(route);
      } else {
        router.push(redirectTo);
      }
      return;
    }
  }, [user, isLoading, isAuthenticated, isAuthorized, redirectTo, router, skip, roleContexts, requiredRoleId, requiredOrganizationId, requiredTeamId, requirePlatformRole]);

  return {
    user,
    isLoading,
    isAuthenticated,
    isAuthorized: skip || isAuthorized,
    selectedRoleContext,
    roleContexts,
  };
}
