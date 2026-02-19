"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ArrowLeft, Copy, Download } from "lucide-react"
import Link from "next/link"
import { Switch } from "../ui/switch"

export function SSOConfigForm() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin/platforms">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Platforms
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SSO Configuration</CardTitle>
          <CardDescription>Configure single sign-on settings for your platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>SSO Provider</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select SSO provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oidc">OpenID Connect</SelectItem>
                  <SelectItem value="saml">SAML 2.0</SelectItem>
                  <SelectItem value="oauth">OAuth 2.0</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="oidc" className="space-y-4">
              <TabsList>
                <TabsTrigger value="oidc">OpenID Connect</TabsTrigger>
                <TabsTrigger value="saml">SAML 2.0</TabsTrigger>
                <TabsTrigger value="oauth">OAuth 2.0</TabsTrigger>
              </TabsList>

              <TabsContent value="oidc" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="issuer-url">Issuer URL</Label>
                  <Input id="issuer-url" placeholder="https://example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-id">Client ID</Label>
                  <Input id="client-id" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-secret">Client Secret</Label>
                  <div className="flex gap-2">
                    <Input id="client-secret" type="password" />
                    <Button variant="outline">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="redirect-uri">Redirect URI</Label>
                  <div className="flex gap-2">
                    <Input
                      id="redirect-uri"
                      value="https://app.example.com/callback"
                      readOnly
                    />
                    <Button variant="outline">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="saml" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="entity-id">Entity ID</Label>
                  <Input id="entity-id" placeholder="https://example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acs-url">ACS URL</Label>
                  <Input
                    id="acs-url"
                    value="https://app.example.com/saml/acs"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label>Certificate</Label>
                  <div className="flex gap-2">
                    <Button className="w-full" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download Certificate
                    </Button>
                    <Button variant="outline">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Metadata</Label>
                  <div className="flex gap-2">
                    <Button className="w-full" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download Metadata
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="oauth" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="auth-url">Authorization URL</Label>
                  <Input id="auth-url" placeholder="https://example.com/oauth/authorize" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="token-url">Token URL</Label>
                  <Input id="token-url" placeholder="https://example.com/oauth/token" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oauth-client-id">Client ID</Label>
                  <Input id="oauth-client-id" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oauth-client-secret">Client Secret</Label>
                  <div className="flex gap-2">
                    <Input id="oauth-client-secret" type="password" />
                    <Button variant="outline">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-provisioning</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically create user accounts on first sign-in
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Role Mapping</Label>
                <p className="text-sm text-muted-foreground">
                  Map SSO roles to platform roles
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Test Configuration</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}