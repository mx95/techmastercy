import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  website: z
    .string()
    .trim()
    .max(300)
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || /^https?:\/\//i.test(v) || /^[\w.-]+\.[a-z]{2,}/i.test(v),
      "Enter a valid website URL",
    ),
  service: z.string().trim().min(2).max(120),
  paymentProvider: z.string().trim().max(120).optional().or(z.literal("")),
  description: z.string().trim().min(20).max(5000),
  preferredContact: z.enum(["email", "phone", "either"]).default("email"),
  websiteConfirm: z.string().max(0).optional().or(z.literal("")), // honeypot
});

export const cartLineSchema = z.object({
  productId: z.string().min(1),
  licenceOptionId: z.string().optional().nullable(),
  quantity: z.number().int().min(1).max(99),
});

export const checkoutSchema = z.object({
  lines: z.array(cartLineSchema).min(1),
  customer: z.object({
    email: z.string().trim().email().max(200),
    name: z.string().trim().min(2).max(120),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    companyName: z.string().trim().max(160).optional().or(z.literal("")),
    shippingAddress: z.string().trim().max(500).optional().or(z.literal("")),
  }),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(200),
});

export const consultationNeedOptions = [
  "ai-implementation",
  "business-automation",
  "online-payments",
  "website-api-troubleshooting",
  "data-processing-reporting",
  "technical-consulting",
  "something-else",
] as const;

export const consultationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  needs: z
    .array(z.enum(consultationNeedOptions))
    .min(1, "Select at least one area")
    .max(7),
  problem: z.string().trim().min(20).max(3000),
  systems: z.string().trim().min(2).max(1000),
  engagementType: z.enum(["one-time", "ongoing", "not-sure"]),
  budgetRange: z.enum([
    "under-200",
    "200-500",
    "500-1500",
    "1500-plus",
    "not-sure",
  ]),
  websiteConfirm: z.string().max(0).optional().or(z.literal("")), // honeypot
});

export type ContactInput = z.infer<typeof contactSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ConsultationInput = z.infer<typeof consultationSchema>;
