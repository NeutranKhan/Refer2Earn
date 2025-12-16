import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  profileImageUrl: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  referralCode: z.string(),
  referredBy: z.string().nullable().optional(),
  isAdmin: z.boolean().default(false),
  createdAt: z.date().or(z.string()).nullable().optional(),
  updatedAt: z.date().or(z.string()).nullable().optional(),
});

export const subscriptionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: z.string().default("pending"),
  amount: z.number().default(500),
  paymentProvider: z.string().nullable().optional(),
  paymentPhone: z.string().nullable().optional(),
  startDate: z.date().or(z.string()).nullable().optional(),
  endDate: z.date().or(z.string()).nullable().optional(),
  createdAt: z.date().or(z.string()).nullable().optional(),
  updatedAt: z.date().or(z.string()).nullable().optional(),
});

export const referralSchema = z.object({
  id: z.string(),
  referrerId: z.string(),
  referredUserId: z.string(),
  status: z.string().default("pending"),
  creditAmount: z.number().default(250),
  activatedAt: z.date().or(z.string()).nullable().optional(),
  createdAt: z.date().or(z.string()).nullable().optional(),
});

export const payoutSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.number(),
  status: z.string().default("pending"),
  paymentProvider: z.string().nullable().optional(),
  paymentPhone: z.string().nullable().optional(),
  approvedBy: z.string().nullable().optional(),
  approvedAt: z.date().or(z.string()).nullable().optional(),
  completedAt: z.date().or(z.string()).nullable().optional(),
  createdAt: z.date().or(z.string()).nullable().optional(),
});

export const transactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.string(),
  amount: z.number(),
  description: z.string().nullable().optional(),
  referenceId: z.string().nullable().optional(),
  createdAt: z.date().or(z.string()).nullable().optional(),
});

// Insert Schemas (omitting system fields)
export const insertUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  referralCode: true,
});

export const insertSubscriptionSchema = subscriptionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPayoutSchema = payoutSchema.omit({
  id: true,
  createdAt: true,
});

// Types
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = InsertUser; // Alias to match previous usage

export type Subscription = z.infer<typeof subscriptionSchema>;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

export type Referral = z.infer<typeof referralSchema>;
export type Payout = z.infer<typeof payoutSchema>;
export type InsertPayout = z.infer<typeof insertPayoutSchema>;

export type Transaction = z.infer<typeof transactionSchema>;

