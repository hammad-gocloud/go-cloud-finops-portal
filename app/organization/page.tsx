'use client'
import Loader from "@/components/loader";
import { NavHeader } from "@/components/nav-header";
import { Button } from "@/components/ui/button";
import useGetOrganizationByUser from "@/hooks/useGetOrganizationsByUser";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import Link from "next/link";

export default function Page() {
  const { user, isLoading: authLoading, isAuthorized } = useProtectedRoute()
  const { organizations, isLoading: loadingOrganization } = useGetOrganizationByUser(user?.id ?? 0)
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <NavHeader user={user} title="Organization Portal" />

      <main className="p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight text-balance">Your Organizations</h2>
              <p className="text-lg text-muted-foreground">Manage your organizations.</p>
            </div>
          </div>
          {
            loadingOrganization ? (
              <Loader />
            ) : (
              organizations?.map((organization) => (
                <div key={organization.id} className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold tracking-tight">{organization.name}</h3>

                    </div>
                    <Button asChild>
                      <Link href={`/organization/${organization.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              ))
            )
          }
        </div>
      </main>
    </div>
  );
}