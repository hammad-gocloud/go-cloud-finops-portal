"use client";

import { useRoleContext } from "@/hooks/useRoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Building2, School } from "lucide-react";

/**
 * Example component demonstrating how to use the role context system
 * This shows how to access and display role information in your components
 */
export function RoleContextExample() {
    const {
        user,
        selectedRoleContext,
        roleContexts,
        hasOrganizationRole,
        isCurrentRoleOrganization,
        getCurrentOrganizationId,
        hasMultipleRoles,
    } = useRoleContext();

    if (!user) {
        return <div>Please log in to see your roles</div>;
    }

    return (
        <div className="space-y-6 p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Your Current Role Context</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {selectedRoleContext ? (
                        <>
                            <div className="flex items-center gap-3">
                              
                                {isCurrentRoleOrganization() && <Building2 className="h-5 w-5" />}
                                <div>
                                    <p className="font-semibold">Role ID: {selectedRoleContext.roleId}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Context ID: {selectedRoleContext.id}
                                    </p>
                                </div>
                            </div>

                            {getCurrentOrganizationId() && (
                                <Badge variant="secondary">
                                    Organization ID: {getCurrentOrganizationId()}
                                </Badge>
                            )}
                        </>
                    ) : (
                        <p className="text-muted-foreground">No role context selected</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Your Roles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground mb-3">
                        You have {roleContexts.length} role context(s)
                    </p>

                    <div className="space-y-2">
                       

                        {hasOrganizationRole() && (
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-primary" />
                                <span className="text-sm">Organization access</span>
                            </div>
                        )}


                    </div>

                    {hasMultipleRoles() && (
                        <p className="text-xs text-muted-foreground mt-4">
                            💡 You can switch between roles by logging in again
                        </p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Role Context Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {roleContexts.map((context) => (
                            <div
                                key={context.id}
                                className={`p-3 rounded-lg border ${selectedRoleContext?.id === context.id
                                        ? "border-primary bg-primary/5"
                                        : "border-border"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Context #{context.id}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Role ID: {context.roleId}
                                        </p>
                                    </div>
                                    {selectedRoleContext?.id === context.id && (
                                        <Badge>Active</Badge>
                                    )}
                                </div>
                                {context.organizationId && (
                                    <p className="text-xs mt-2 text-muted-foreground">
                                        Organization: {context.organizationId}
                                    </p>
                                )}
                              
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
