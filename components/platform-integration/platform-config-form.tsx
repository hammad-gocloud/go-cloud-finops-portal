"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import { ArrowLeft, Key, Webhook, Settings2 } from "lucide-react"
import Link from "next/link"
import { Switch } from "../ui/switch"

export function PlatformConfigForm() {
  const [webhookEnabled, setWebhookEnabled] = useState(false)

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

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api">API Settings</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" placeholder="Enter platform name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform-url">Platform URL</Label>
                <Input id="platform-url" placeholder="https://example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter platform description" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Manage API keys and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input id="api-key" value="pk_live_****" readOnly className="font-mono" />
                  <Button variant="outline">
                    <Key className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-secret">API Secret</Label>
                <div className="flex gap-2">
                  <Input id="api-secret" value="sk_live_****" readOnly className="font-mono" />
                  <Button variant="outline">
                    <Key className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="allowed-origins">Allowed Origins</Label>
                <Input id="allowed-origins" placeholder="https://example.com" />
                <p className="text-sm text-muted-foreground">
                  Comma-separated list of allowed origins
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>Set up webhook endpoints and events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Webhooks</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive real-time updates for platform events
                  </p>
                </div>
                <Switch
                  checked={webhookEnabled}
                  onCheckedChange={setWebhookEnabled}
                />
              </div>
              {webhookEnabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://example.com/webhook"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhook-secret">Webhook Secret</Label>
                    <div className="flex gap-2">
                      <Input
                        id="webhook-secret"
                        value="whsec_****"
                        readOnly
                        className="font-mono"
                      />
                      <Button variant="outline">
                        <Key className="mr-2 h-4 w-4" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <Label className="mb-2 block">Event Types</Label>
                    <div className="space-y-2">
                      {[
                        "template.created",
                        "template.updated",
                        "template.approved",
                        "template.rejected",
                        "template.published",
                      ].map((event) => (
                        <div key={event} className="flex items-center gap-2">
                          <Switch id={event} />
                          <Label htmlFor={event}>{event}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Configuration</CardTitle>
              <CardDescription>Configure template-specific settings for this platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Content Types</Label>
                <div className="rounded-lg border p-4 space-y-2">
                  {[
                    "Social Media Posts",
                    "Product Descriptions",
                    "Blog Articles",
                    "Email Templates",
                  ].map((type) => (
                    <div key={type} className="flex items-center gap-2">
                      <Switch id={type} />
                      <Label htmlFor={type}>{type}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Image Requirements</Label>
                <div className="rounded-lg border p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="max-width">Max Width (px)</Label>
                      <Input id="max-width" type="number" placeholder="1920" />
                    </div>
                    <div>
                      <Label htmlFor="max-height">Max Height (px)</Label>
                      <Input id="max-height" type="number" placeholder="1080" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="formats">Allowed Formats</Label>
                    <Input id="formats" placeholder="jpg, png, gif" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}