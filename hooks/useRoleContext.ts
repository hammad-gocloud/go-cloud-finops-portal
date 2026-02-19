import { useAuth } from "@/app/contexts/AuthContext";
import { RoleContext } from "@/src/api/api";
import {
  isOrganizationRole,
  hasRoleContext,
} from "@/lib/role-utils";

/**
 * Custom hook for accessing role context information
 * Provides convenient methods to check user's role contexts
 */
export function useRoleContext() {
  const {
    user,
    roleContexts,
    selectedRoleContext,
    requiresRoleSelection,
  } = useAuth();



  /**
   * Check if the user has any organization-scoped role
   */
  const hasOrganizationRole = (organizationId?: number) => {
    return roleContexts.some((context) => {
      if (!isOrganizationRole(context)) return false;
      if (organizationId) return context.organizationId === organizationId;
      return true;
    });
  };

  /**
   * Check if the user has a specific role by role ID
   */
  const hasRole = (roleId: number) => {
    return roleContexts.some((context) => context.roleId === roleId);
  };

  /**
   * Get all role contexts for a specific organization
   */
  const getOrganizationRoles = (organizationId: number) => {
    return roleContexts.filter(
      (context) => context.organizationId === organizationId
    );
  };





  /**
   * Check if the currently selected role context is organization-scoped
   */
  const isCurrentRoleOrganization = () => {
    return selectedRoleContext
      ? isOrganizationRole(selectedRoleContext)
      : false;
  };

 

  /**
   * Get the current organization ID if the selected role is organization-scoped
   */
  const getCurrentOrganizationId = () => {
    return selectedRoleContext?.organizationId || null;
  };


  /**
   * Check if user has multiple role contexts
   */
  const hasMultipleRoles = () => {
    return roleContexts.length > 1;
  };

  return {
    // State
    user,
    roleContexts,
    selectedRoleContext,
    requiresRoleSelection,

  
    hasOrganizationRole,

    hasRole,
    hasRoleContext,

    // Role filtering methods
    getOrganizationRoles,


   
    isCurrentRoleOrganization,

    getCurrentOrganizationId,
  

    // Utility methods
    hasMultipleRoles,
  };
}
