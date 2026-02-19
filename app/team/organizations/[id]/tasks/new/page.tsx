'use client';

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { NavHeader } from "@/components/nav-header";
import CreateTaskForm from "@/components/create-task-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import useGetOrganization from "@/hooks/useGetOrganization";
import Loader from "@/components/loader";


export default function CreateTaskPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;
  
  const {  organization, isLoading } = useGetOrganization(organizationId);

  if (isLoading) {
    return <Loader />;
  }

  if (!organization) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Organization Not Found</h1>
          <p className="text-muted-foreground mt-2">The organization you're looking for doesn't exist.</p>
          <Link href="/team">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavHeader user={user} title={`Create Task - ${organization.name}`} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href={`/team/organizations/${organizationId}`}>
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Organization
            </Button>
          </Link>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Create New Task</h1>
            <p className="text-muted-foreground">
              Create a new task for <span className="font-semibold">{organization.name}</span>
            </p>
          </div>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <CreateTaskForm organizationId={organizationId} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}