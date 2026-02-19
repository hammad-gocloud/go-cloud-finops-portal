"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RoleSelectionForm } from "@/components/role-selection-form";
import { useAuth } from "@/app/contexts/AuthContext";
import { getRouteForRoleContext } from "@/lib/role-utils";
import Loader from "@/components/loader";

export default function SelectRolePage() {
  const { user, selectedRoleContext, roleContexts, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) return;

    // If no user, redirect to login
    if (!user) {
      console.log("🔒 No user found on select-role page, redirecting to login");
      router.replace("/login");
      return;
    }

    // If user already has a selected role context, redirect to the appropriate dashboard
    if (selectedRoleContext) {
      const route = getRouteForRoleContext(selectedRoleContext);
      console.log("✅ User already has selected role context on select-role page, redirecting to:", route);
      router.replace(route);
      return;
    }

    // If user has only one role context, they shouldn't be on this page
    if (roleContexts.length === 1) {
      const route = getRouteForRoleContext(roleContexts[0]);
      console.log("✅ User has only one role context on select-role page, redirecting to:", route);
      router.replace(route);
      return;
    }

    // If user has no role contexts, redirect to login
    if (roleContexts.length === 0) {
      console.log("⚠️ User has no role contexts on select-role page, redirecting to login");
      router.replace("/login");
      return;
    }

    // Otherwise, user should stay on this page to select a role
    console.log("🔀 User needs to select from", roleContexts.length, "role contexts");
  }, [user, selectedRoleContext, roleContexts, isLoading, router]);

  if (isLoading) {
    return <Loader title="Loading..." subtitle="Please wait while we verify your authentication" />;
  }

  if (!user || roleContexts.length === 0) {
    return <Loader title="Redirecting..." subtitle="Please wait" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <RoleSelectionForm />
    </div>
  );
}
