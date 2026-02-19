"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form } from "@/components/ui/form"
import {
  organizationFormSchema,
  type OrganizationFormValues,
  SOCIAL_PLATFORMS,
  COMPANY_SIZES,
  INDUSTRIES,
  MARKETING_BUDGETS,
  BUSINESS_GOALS,
  TEAM_SIZES,
  TARGET_AUDIENCES,
  TIMEZONES
} from "@/lib/organization-schema"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"

export default function OrganizationSignupPage() {
  const router = useRouter()
  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      organizationName: "",
      website: "",
      goals: [],
    },
  })

  useEffect(() => {
    // Check if we have the email from the previous step
    const signupEmail = localStorage.getItem("signup_email")
    if (!signupEmail) {
      // If no email is found, redirect back to signup
      router.push("/signup")
    }
  }, [router])

  async function onSubmit(data: OrganizationFormValues) {
    try {
      // In a real app, you would make an API call here to create the organization
      console.log("Form data:", data)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Clear signup data
      localStorage.removeItem("signup_email")

      // Redirect to success page or dashboard
      router.push("/login?signup=success")
    } catch (error) {
      console.error("Error submitting form:", error)
      form.setError("root", {
        type: "server",
        message: "Something went wrong. Please try again.",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Tell us about your organization</CardTitle>
          <CardDescription>
            This information helps us set up your account correctly and provide the best experience
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="business">Business Details</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic">
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter organization name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input type="url" placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormDescription>Optional, but recommended</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="au">Australia</SelectItem>
                              {/* Add more countries as needed */}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timezone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TIMEZONES.map((timezone) => (
                                <SelectItem key={timezone} value={timezone}>
                                  {timezone}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter business address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Enter business phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </TabsContent>

              <TabsContent value="business">
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {INDUSTRIES.map((industry) => (
                                <SelectItem key={industry} value={industry.toLowerCase()}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="companySize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Size</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select company size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {COMPANY_SIZES.map((size) => (
                                <SelectItem key={size} value={size}>
                                  {size} employees
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="marketingBudget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Marketing Budget</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MARKETING_BUDGETS.map((budget) => (
                              <SelectItem key={budget} value={budget.toLowerCase()}>
                                {budget}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goals"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Business Goals</FormLabel>
                          <FormDescription>
                            Select all that apply to your social media strategy
                          </FormDescription>
                        </div>
                        {BUSINESS_GOALS.map((goal) => (
                          <FormField
                            key={goal}
                            control={form.control}
                            name="goals"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={goal}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(goal)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, goal])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== goal
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {goal}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </TabsContent>

              <TabsContent value="social">
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Social Platform</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select main platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SOCIAL_PLATFORMS.map((platform) => (
                              <SelectItem key={platform} value={platform.toLowerCase()}>
                                {platform}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This will be your main platform for content management
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="teamSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Social Media Team Size</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select team size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TEAM_SIZES.map((size) => (
                                <SelectItem key={size} value={size.toLowerCase()}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="primaryAudience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Target Audience</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select target audience" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TARGET_AUDIENCES.map((audience) => (
                                <SelectItem key={audience} value={audience.toLowerCase()}>
                                  {audience}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>

            <CardFooter className="flex flex-col space-y-4">
              <div className="flex w-full gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/signup")}
                  disabled={form.formState.isSubmitting}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Creating organization..."
                    : "Complete Setup"}
                </Button>
              </div>
              {form.formState.errors.root && (
                <div className="text-sm text-destructive text-center">
                  {form.formState.errors.root.message}
                </div>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}