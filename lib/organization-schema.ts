import { z } from "zod"

export const organizationFormSchema = z.object({
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
  platform: z.string({
    required_error: "Please select a platform",
  }),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  companySize: z.string({
    required_error: "Please select company size",
  }),
  industry: z.string({
    required_error: "Please select an industry",
  }),
  country: z.string({
    required_error: "Please select a country",
  }),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  marketingBudget: z.string({
    required_error: "Please select your monthly marketing budget",
  }),
  goals: z.array(z.string()).min(1, "Please select at least one goal"),
  teamSize: z.string({
    required_error: "Please select your social media team size",
  }),
  primaryAudience: z.string({
    required_error: "Please select your primary target audience",
  }),
  timezone: z.string({
    required_error: "Please select your timezone",
  }),
})

export type OrganizationFormValues = z.infer<typeof organizationFormSchema>

export const SOCIAL_PLATFORMS = ["Facebook", "Instagram", "Twitter", "LinkedIn", "TikTok", "YouTube"]

export const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501+"]

export const INDUSTRIES = [
  "Technology",
  "Retail",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Entertainment",
  "Food & Beverage",
  "Travel",
  "Real Estate",
  "Professional Services",
  "Non-Profit",
  "Other"
]

export const MARKETING_BUDGETS = [
  "Under $500",
  "$500 - $2,000",
  "$2,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000+"
]

export const BUSINESS_GOALS = [
  "Increase Brand Awareness",
  "Generate Leads",
  "Drive Website Traffic",
  "Boost Sales",
  "Improve Customer Engagement",
  "Build Community",
  "Provide Customer Support",
  "Establish Industry Authority",
  "Launch New Products"
]

export const TEAM_SIZES = [
  "Solo Manager",
  "2-3 People",
  "4-6 People",
  "7-10 People",
  "10+ People"
]

export const TARGET_AUDIENCES = [
  "B2B - Small Business",
  "B2B - Enterprise",
  "B2C - Young Adults (18-24)",
  "B2C - Adults (25-40)",
  "B2C - Mature Adults (40+)",
  "Mixed B2B and B2C",
  "Local Community",
  "Global Audience"
]

// A subset of common timezones for the example
export const TIMEZONES = [
  "US/Pacific",
  "US/Mountain",
  "US/Central",
  "US/Eastern",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Singapore",
  "Australia/Sydney"
]