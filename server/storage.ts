import {
  type User,
  type UpsertUser,
  type Subscription,
  type Referral,
  type Payout,
  type Transaction,
  type FinanceRecord,
  type InsertFinanceRecord,
} from "../shared/schema.js";
import { db } from "./lib/firebase.js"; // Using Firebase Admin Firestore

// Helper to convert Firestore timestamp to Date and handle missing fields
const convertDates = (data: any): any => {
  if (!data) return data;
  const result = { ...data };

  const dateFields = [
    'createdAt', 'updatedAt', 'startDate', 'endDate',
    'activatedAt', 'approvedAt', 'completedAt', 'expire'
  ];

  for (const field of dateFields) {
    if (result[field] && typeof result[field].toDate === 'function') {
      result[field] = result[field].toDate();
    } else if (result[field] && typeof result[field] === 'string') {
      // already string or ISO? keep or parse if needed. 
      // Firestore usually returns Timestamp objects.
      result[field] = new Date(result[field]);
    }
  }
  return result;
};

// Helper to generate IDs if not provided (though for users we use Auth UID)
const generateId = () => db.collection('_').doc().id;

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

  // Finance Records
  createFinanceRecord(userId: string, record: InsertFinanceRecord): Promise<FinanceRecord>;
  getFinanceRecords(userId: string): Promise<FinanceRecord[]>;
  deleteFinanceRecord(id: string, userId: string): Promise<void>;

  getDashboardStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    pendingPayouts: number;
    totalReferrals: number;
  }>;
}

export class FirestoreStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) return undefined;
    return convertDates({ id: doc.id, ...doc.data() }) as User;
  }

  async upsertUser(userData: Partial<UpsertUser> & { id: string }): Promise<User> {
    const userRef = db.collection('users').doc(userData.id);
    const doc = await userRef.get();

    if (doc.exists) {
      const updateData = {
        ...userData,
        updatedAt: new Date(),
      };
      await userRef.update(updateData);
      const updated = await userRef.get();
      return convertDates({ id: updated.id, ...updated.data() }) as User;
    }

    const referralCode = generateReferralCode();
    const newUser = {
      ...userData,
      referralCode,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: userData.isAdmin || false,
    };

    await userRef.set(newUser);
    return convertDates(newUser) as User;
  }

  async getUserByReferralCode(code: string): Promise<User | undefined> {
    const snapshot = await db.collection('users')
      .where('referralCode', '==', code.toUpperCase())
      .limit(1)
      .get();

    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return convertDates({ id: doc.id, ...doc.data() }) as User;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const snapshot = await db.collection('users')
      .where('phone', '==', phone)
      .limit(1)
      .get();

    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return convertDates({ id: doc.id, ...doc.data() }) as User;
  }

  async updateUserPhone(userId: string, phone: string): Promise<User> {
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      phone,
      updatedAt: new Date()
    });
    const updated = await userRef.get();
    return convertDates({ id: updated.id, ...updated.data() }) as User;
  }

  async getAllUsers(): Promise<User[]> {
    const snapshot = await db.collection('users')
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => convertDates({ id: doc.id, ...doc.data() }) as User);
  }

  async getSubscription(userId: string): Promise<Subscription | undefined> {
    const snapshot = await db.collection('subscriptions')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return convertDates({ id: doc.id, ...doc.data() }) as Subscription;
  }

  async createSubscription(data: Partial<Subscription> & { userId: string }): Promise<Subscription> {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);

    const subData = {
      ...data,
      startDate: now,
      endDate,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await db.collection('subscriptions').add(subData);
    const doc = await docRef.get();
    return convertDates({ id: doc.id, ...doc.data() }) as Subscription;
  }

  async updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription> {
    const subRef = db.collection('subscriptions').doc(id);
    await subRef.update({ ...data, updatedAt: new Date() });
    const updated = await subRef.get();
    return convertDates({ id: updated.id, ...updated.data() }) as Subscription;
  }

  async getReferrals(userId: string): Promise<(Referral & { referredUser: User | null })[]> {
    const snapshot = await db.collection('referrals')
      .where('referrerId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const referrals = snapshot.docs.map(doc => convertDates({ id: doc.id, ...doc.data() }) as Referral);

    // Enrich with referred users
    const results = await Promise.all(referrals.map(async (ref) => {
      const user = await this.getUser(ref.referredUserId);
      return { ...ref, referredUser: user || null };
    }));

    return results;
  }

  async getReferralByUsers(referrerId: string, referredUserId: string): Promise<Referral | undefined> {
    const snapshot = await db.collection('referrals')
      .where('referrerId', '==', referrerId)
      .where('referredUserId', '==', referredUserId)
      .limit(1)
      .get();

    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return convertDates({ id: doc.id, ...doc.data() }) as Referral;
  }

  async createReferral(referrerId: string, referredUserId: string): Promise<Referral> {
    const refData = {
      referrerId,
      referredUserId,
      status: 'pending',
      creditAmount: 500,
      createdAt: new Date(),
    };

    const docRef = await db.collection('referrals').add(refData);
    const doc = await docRef.get();
    return convertDates({ id: doc.id, ...doc.data() }) as Referral;
  }

  async activateReferral(id: string): Promise<Referral> {
    const refRef = db.collection('referrals').doc(id);
    await refRef.update({
      status: 'active',
      activatedAt: new Date(),
    });
    const updated = await refRef.get();
    return convertDates({ id: updated.id, ...updated.data() }) as Referral;
  }

  async getActiveReferralCount(userId: string): Promise<number> {
    const snapshot = await db.collection('referrals')
      .where('referrerId', '==', userId)
      .where('status', '==', 'active')
      .count()
      .get();
    return snapshot.data().count;
  }

  async getPendingPayouts(): Promise<(Payout & { user: User | null })[]> {
    const snapshot = await db.collection('payouts')
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .get();

    const payouts = snapshot.docs.map(doc => convertDates({ id: doc.id, ...doc.data() }) as Payout);

    const results = await Promise.all(payouts.map(async (payout) => {
      const user = await this.getUser(payout.userId);
      return { ...payout, user: user || null };
    }));

    return results;
  }

  async getUserPayouts(userId: string): Promise<Payout[]> {
    const snapshot = await db.collection('payouts')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => convertDates({ id: doc.id, ...doc.data() }) as Payout);
  }

  async createPayout(userId: string, amount: number, phone: string, provider: string): Promise<Payout> {
    const payoutData = {
      userId,
      amount,
      paymentPhone: phone,
      paymentProvider: provider,
      status: 'pending',
      createdAt: new Date(),
    };

    const docRef = await db.collection('payouts').add(payoutData);
    const doc = await docRef.get();
    return convertDates({ id: doc.id, ...doc.data() }) as Payout;
  }

  async approvePayout(payoutId: string, adminId: string): Promise<Payout> {
    const ref = db.collection('payouts').doc(payoutId);
    await ref.update({
      status: 'approved',
      approvedBy: adminId,
      approvedAt: new Date(),
    });
    const updated = await ref.get();
    return convertDates({ id: updated.id, ...updated.data() }) as Payout;
  }

  async completePayout(payoutId: string): Promise<Payout> {
    const ref = db.collection('payouts').doc(payoutId);
    await ref.update({
      status: 'completed',
      completedAt: new Date(),
    });
    const updated = await ref.get();
    return convertDates({ id: updated.id, ...updated.data() }) as Payout;
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    const snapshot = await db.collection('transactions')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => convertDates({ id: doc.id, ...doc.data() }) as Transaction);
  }

  async createTransaction(data: Partial<Transaction> & { userId: string; type: string; amount: number }): Promise<Transaction> {
    const txData = {
      ...data,
      createdAt: new Date(),
    };
    const docRef = await db.collection('transactions').add(txData);
    const doc = await docRef.get();
    return convertDates({ id: doc.id, ...doc.data() }) as Transaction;
  }

  // Finance Records Implementation
  async createFinanceRecord(userId: string, record: InsertFinanceRecord): Promise<FinanceRecord> {
    const recordsRef = db.collection("finance_records");
    const docRef = recordsRef.doc();
    const now = new Date();

    const newRecord: FinanceRecord = {
      id: docRef.id,
      userId,
      ...record,
      // Ensure date is stored as ISO string if it's a Date object, or kept as string
      date: record.date instanceof Date ? record.date.toISOString() : record.date,
      createdAt: now.toISOString(),
    };

    // Store as plain object to avoid Firestore issues with custom objects if any
    await docRef.set(JSON.parse(JSON.stringify(newRecord)));
    return newRecord;
  }

  async getFinanceRecords(userId: string): Promise<FinanceRecord[]> {
    const recordsRef = db.collection("finance_records");
    const snapshot = await recordsRef
      .where("userId", "==", userId)
      .orderBy("date", "desc")
      .orderBy("createdAt", "desc")
      .get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(doc => convertDates({ id: doc.id, ...doc.data() }) as FinanceRecord);
  }

  async deleteFinanceRecord(id: string, userId: string): Promise<void> {
    const docRef = db.collection("finance_records").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error("Record not found");
    }

    const data = doc.data() as FinanceRecord;
    if (data.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await docRef.delete();
  }

  async getDashboardStats() {
    const usersSnapshot = await db.collection('users').count().get();
    const totalUsers = usersSnapshot.data().count;

    // These queries are expensive if we count everything client side.
    // For now we will do simple queries. Real production apps might use aggregation functions.

    const subsSnapshot = await db.collection('subscriptions').get();
    let activeUsers = 0;
    let totalRevenue = 0;

    subsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.status === 'active' || data.status === 'free') {
        activeUsers++;
      }
      if (data.status === 'active') {
        totalRevenue += 1500; // Assumption based on existing logic
      }
    });

    const payoutsSnapshot = await db.collection('payouts').where('status', '==', 'pending').get();
    let pendingPayouts = 0;
    payoutsSnapshot.forEach(doc => {
      pendingPayouts += doc.data().amount || 0;
    });

    const referralSnapshot = await db.collection('referrals').count().get();

    return {
      totalUsers,
      activeUsers,
      totalRevenue,
      pendingPayouts,
      totalReferrals: referralSnapshot.data().count,
    };
  }
}

export const storage = new FirestoreStorage();
