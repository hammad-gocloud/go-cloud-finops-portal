"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Globe, Link as LinkIcon, Settings, Shield } from "lucide-react"
import Link from "next/link"

export function PlatformDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Connected Platforms</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <div className="text-xs text-muted-foreground">3 active, 2 pending</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2k</div>
            <div className="text-xs text-muted-foreground">+180 this week</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">285k</div>
            <div className="text-xs text-muted-foreground">Past 30 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">SSO Sessions</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <div className="text-xs text-muted-foreground">Active now</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Connected Platforms</CardTitle>
            <CardDescription>Manage your platform integrations and configurations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "E-commerce Platform", status: "active", apiKey: "ek_live_****" },
              { name: "CRM System", status: "active", apiKey: "crm_prod_****" },
              { name: "Learning Platform", status: "pending", apiKey: "lms_test_****" },
            ].map((platform) => (
              <div
                key={platform.name}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <p className="font-medium">{platform.name}</p>
                  <p className="text-sm text-muted-foreground">API Key: {platform.apiKey}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={platform.status === "active" ? "default" : "secondary"}
                  >
                    {platform.status}
                  </Badge>
                  <Link href={`/admin/platforms/${platform.name.toLowerCase()}`}>
                    <Button variant="ghost" size="sm">
                      Configure
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="outline">
              Connect New Platform
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SSO Configuration</CardTitle>
            <CardDescription>Manage single sign-on settings for each platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "E-commerce Platform", provider: "OpenID Connect", status: "configured" },
              { name: "CRM System", provider: "SAML 2.0", status: "configured" },
              { name: "Learning Platform", provider: "Not Configured", status: "pending" },
            ].map((sso) => (
              <div
                key={sso.name}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <p className="font-medium">{sso.name}</p>
                  <p className="text-sm text-muted-foreground">Provider: {sso.provider}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={sso.status === "configured" ? "default" : "secondary"}
                  >
                    {sso.status}
                  </Badge>
                  <Link href={`/admin/platforms/${sso.name.toLowerCase()}/sso`}>
                    <Button variant="ghost" size="sm">
                      Configure SSO
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}