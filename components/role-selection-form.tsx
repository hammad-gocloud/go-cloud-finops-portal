"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Building2, School, Shield, ChevronRight, Users } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import http from "@/src/api";
import { useAuth } from "@/app/contexts/AuthContext";
import { toast } from "sonner";
import { RoleContext } from "@/src/api/api";
import { getRouteForRoleContext } from "@/lib/role-utils";

export function RoleSelectionForm() {
  const router = useRouter();
  const { user, roleContexts, setToken, setSelectedRoleContext } = useAuth();
  const [selectedContext, setSelectedContext] = useState<RoleContext | null>(null);

  const { mutate: selectRoleContext, isPending: isSelecting } = useMutation({
    mutationFn: async (roleContextId: number) => {
      if (!user) throw new Error("User not found");

      const response = await http.api.authControllerSelectRoleContext({
        userId: user.id,
        roleContextId,
      });
      return response;
    },
    onSuccess: (data) => {
      console.log("Role context selected:", data);

      // Store the access token and selected role context
      setToken(data.accessToken);
      setSelectedRoleContext(data.selectedRoleContext);

      toast.success("Role context selected successfully");

      // Navigate based on the selected role context
      navigateBasedOnRole(data.selectedRoleContext);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to select role context. Please try again.";

      toast.error(errorMessage);
    },
  });

  const navigateBasedOnRole = (context: RoleContext) => {
    const route = getRouteForRoleContext(context);
    router.push(route);
  };

  const handleSelectContext = (context: RoleContext) => {
    setSelectedContext(context);
    selectRoleContext(context.id);
  };

  const getRoleIcon = (context: RoleContext) => {
    if (context.organizationId) {
      return <Building2 className="h-6 w-6" />;
    } else if (context.teamId) {
      return <Users className="h-6 w-6" />;
    } else {
      return <Shield className="h-6 w-6" />;
    }
  };

  const getRoleLabel = (context: RoleContext) => {
    return context.role?.title || "Unknown Role";
  };

  const getRoleDescription = (context: RoleContext) => {
    if (context.organizationId && context.organization) {
      return context.organization.name;
    } else if (context.teamId && context.team) {
      return context.team.name;
    } else {
      return "Platform Wide";
    }
  };

  if (!user) {
    return (
      <Card className="w-full max-w-2xl border-none shadow-2xl bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-2xl">User not found</CardTitle>
          <CardDescription>Please log in again</CardDescription>
          <Button onClick={() => router.push("/login")}>
            Go to Login
          </Button>
        </CardHeader>
      </Card>
    );
  }

  if (roleContexts.length === 0) {
    return (
      <Card className="w-full max-w-2xl border-none shadow-2xl bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-2xl">No role contexts available</CardTitle>
          <CardDescription>
            You don't have any assigned roles yet. Please contact your administrator to get access.
          </CardDescription>
          <Button onClick={() => router.push("/login")}>
            Back to Login
          </Button>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl border-none shadow-2xl bg-gradient-to-br from-card to-primary/5">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
          <Sparkles className="h-7 w-7 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Select Your Role
        </CardTitle>
        <CardDescription className="text-base">
          Welcome back, {user.fullName}! Choose the role context you want to use
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {roleContexts.map((context) => (
          <Card
            key={context.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${selectedContext?.id === context.id
                ? "ring-2 ring-primary border-primary"
                : "hover:border-primary/50"
              }`}
            onClick={() => !isSelecting && handleSelectContext(context)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    {getRoleIcon(context)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">
                        {getRoleLabel(context)}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {getRoleDescription(context)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isSelecting && selectedContext?.id === context.id ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                      <span className="text-sm text-muted-foreground">Selecting...</span>
                    </div>
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="pt-4 text-center">
          <Button
            variant="ghost"
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.clear();
              }
              router.push("/login");
            }}
            disabled={isSelecting}
          >
            Back to Login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
