import {
  users,
  subscriptions,
  referrals,
  payouts,
  transactions,
  type User,
  type UpsertUser,
  type Subscription,
  type Referral,
  type Payout,
  type Transaction,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import { randomBytes } from "crypto";

function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'REF-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: Partial<UpsertUser> & { id: string }): Promise<User>;
  getUserByReferralCode(code: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  updateUserPhone(userId: string, phone: string): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  getSubscription(userId: string): Promise<Subscription | undefined>;
  createSubscription(data: Partial<Subscription> & { userId: string }): Promise<Subscription>;
  updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription>;
  
  getReferrals(userId: string): Promise<(Referral & { referredUser: User | null })[]>;
  getReferralByUsers(referrerId: string, referredUserId: string): Promise<Referral | undefined>;
  createReferral(referrerId: string, referredUserId: string): Promise<Referral>;
  activateReferral(id: string): Promise<Referral>;
  getActiveReferralCount(userId: string): Promise<number>;
  
  getPendingPayouts(): Promise<(Payout & { user: User | null })[]>;
  getUserPayouts(userId: string): Promise<Payout[]>;
  createPayout(userId: string, amount: number, phone: string, provider: string): Promise<Payout>;
  approvePayout(payoutId: string, adminId: string): Promise<Payout>;
  completePayout(payoutId: string): Promise<Payout>;
  
  getTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(data: Partial<Transaction> & { userId: string; type: string; amount: number }): Promise<Transaction>;
  
  getDashboardStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    pendingPayouts: number;
    totalReferrals: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: Partial<UpsertUser> & { id: string }): Promise<User> {
    const existingUser = await this.getUser(userData.id);
    
    if (existingUser) {
      const [user] = await db
        .update(users)
        .set({
          ...userData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userData.id))
        .returning();
      return user;
    }

    const referralCode = generateReferralCode();
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        referralCode,
      })
      .returning();
    return user;
  }

  async getUserByReferralCode(code: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.referralCode, code.toUpperCase()));
    return user;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  }

  async updateUserPhone(userId: string, phone: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ phone, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getSubscription(userId: string): Promise<Subscription | undefined> {
    const [sub] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);
    return sub;
  }

  async createSubscription(data: Partial<Subscription> & { userId: string }): Promise<Subscription> {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);

    const [sub] = await db
      .insert(subscriptions)
      .values({
        ...data,
        startDate: now,
        endDate,
        status: 'active',
      })
      .returning();
    return sub;
  }

  async updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription> {
    const [sub] = await db
      .update(subscriptions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    return sub;
  }

  async getReferrals(userId: string): Promise<(Referral & { referredUser: User | null })[]> {
    const refs = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, userId))
      .orderBy(desc(referrals.createdAt));

    const result = await Promise.all(
      refs.map(async (ref) => {
        const [referredUser] = await db
          .select()
          .from(users)
          .where(eq(users.id, ref.referredUserId));
        return { ...ref, referredUser: referredUser || null };
      })
    );

    return result;
  }

  async getReferralByUsers(referrerId: string, referredUserId: string): Promise<Referral | undefined> {
    const [ref] = await db
      .select()
      .from(referrals)
      .where(
        and(
          eq(referrals.referrerId, referrerId),
          eq(referrals.referredUserId, referredUserId)
        )
      );
    return ref;
  }

  async createReferral(referrerId: string, referredUserId: string): Promise<Referral> {
    const [ref] = await db
      .insert(referrals)
      .values({
        referrerId,
        referredUserId,
        status: 'pending',
        creditAmount: 500,
      })
      .returning();
    return ref;
  }

  async activateReferral(id: string): Promise<Referral> {
    const [ref] = await db
      .update(referrals)
      .set({
        status: 'active',
        activatedAt: new Date(),
      })
      .where(eq(referrals.id, id))
      .returning();
    return ref;
  }

  async getActiveReferralCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(referrals)
      .where(
        and(
          eq(referrals.referrerId, userId),
          eq(referrals.status, 'active')
        )
      );
    return Number(result[0]?.count) || 0;
  }

  async getPendingPayouts(): Promise<(Payout & { user: User | null })[]> {
    const pendingPayouts = await db
      .select()
      .from(payouts)
      .where(eq(payouts.status, 'pending'))
      .orderBy(desc(payouts.createdAt));

    const result = await Promise.all(
      pendingPayouts.map(async (payout) => {
        const [user] = await db.select().from(users).where(eq(users.id, payout.userId));
        return { ...payout, user: user || null };
      })
    );

    return result;
  }

  async getUserPayouts(userId: string): Promise<Payout[]> {
    return db
      .select()
      .from(payouts)
      .where(eq(payouts.userId, userId))
      .orderBy(desc(payouts.createdAt));
  }

  async createPayout(userId: string, amount: number, phone: string, provider: string): Promise<Payout> {
    const [payout] = await db
      .insert(payouts)
      .values({
        userId,
        amount,
        paymentPhone: phone,
        paymentProvider: provider,
        status: 'pending',
      })
      .returning();
    return payout;
  }

  async approvePayout(payoutId: string, adminId: string): Promise<Payout> {
    const [payout] = await db
      .update(payouts)
      .set({
        status: 'approved',
        approvedBy: adminId,
        approvedAt: new Date(),
      })
      .where(eq(payouts.id, payoutId))
      .returning();
    return payout;
  }

  async completePayout(payoutId: string): Promise<Payout> {
    const [payout] = await db
      .update(payouts)
      .set({
        status: 'completed',
        completedAt: new Date(),
      })
      .where(eq(payouts.id, payoutId))
      .returning();
    return payout;
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    return db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }

  async createTransaction(data: Partial<Transaction> & { userId: string; type: string; amount: number }): Promise<Transaction> {
    const [tx] = await db
      .insert(transactions)
      .values(data)
      .returning();
    return tx;
  }

  async getDashboardStats() {
    const allUsers = await db.select().from(users);
    const activeSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.status, 'active'));
    const freeSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.status, 'free'));
    const pendingPayoutsList = await db
      .select()
      .from(payouts)
      .where(eq(payouts.status, 'pending'));
    const allReferrals = await db.select().from(referrals);

    const totalRevenue = activeSubscriptions.length * 1500;
    const pendingPayoutsAmount = pendingPayoutsList.reduce((sum, p) => sum + p.amount, 0);

    return {
      totalUsers: allUsers.length,
      activeUsers: activeSubscriptions.length + freeSubscriptions.length,
      totalRevenue,
      pendingPayouts: pendingPayoutsAmount,
      totalReferrals: allReferrals.length,
    };
  }
}

export const storage = new DatabaseStorage();
