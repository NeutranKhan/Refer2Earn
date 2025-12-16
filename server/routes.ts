import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage.js";
import { verifyFirebaseToken, isAdmin } from "./middleware/auth.js";
import { insertFinanceRecordSchema } from "../shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // await setupAuth(app); // Removed Replit Auth

  // Auth routes
  // Auth routes
  app.get('/api/auth/user', verifyFirebaseToken, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const referralCode = req.query.referralCode as string;
      let user = await storage.getUser(userId);

      if (!user) {
        // New user - Mandate Referral Code
        if (!referralCode) {
          return res.status(400).json({ message: "Referral code is required for signup" });
        }

        const referrer = await storage.getUserByReferralCode(referralCode);
        if (!referrer) {
          return res.status(400).json({ message: "Invalid referral code" });
        }

        const { email, picture, name, phone_number } = req.user;
        const [firstName, ...lastNames] = name ? name.split(' ') : ["", ""];
        const lastName = lastNames.join(' ');

        // Create user with referrer
        user = await storage.upsertUser({
          id: userId,
          email: email || undefined,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          profileImageUrl: picture || undefined,
          phone: phone_number || undefined,
          referredBy: referrer.id, // Set referrer immediately
          isAdmin: false,
        });

        // Create the referral record immediately
        await storage.createReferral(referrer.id, userId);
      }

      const activeReferrals = await storage.getActiveReferralCount(userId);
      const subscription = await storage.getSubscription(userId);

      res.json({
        ...user,
        activeReferrals,
        subscription,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user phone
  app.patch('/api/users/phone', verifyFirebaseToken, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const { phone } = req.body;

      if (!phone) {
        return res.status(400).json({ message: "Phone number is required" });
      }

      const existingUser = await storage.getUserByPhone(phone);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: "Phone number already in use" });
      }

      const user = await storage.updateUserPhone(userId, phone);
      res.json(user);
    } catch (error) {
      console.error("Error updating phone:", error);
      res.status(500).json({ message: "Failed to update phone" });
    }
  });

  // Apply referral code during signup
  app.post('/api/referrals/apply', verifyFirebaseToken, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const { referralCode } = req.body;

      if (!referralCode) {
        return res.status(400).json({ message: "Referral code is required" });
      }

      const referrer = await storage.getUserByReferralCode(referralCode);
      if (!referrer) {
        return res.status(404).json({ message: "Invalid referral code" });
      }

      if (referrer.id === userId) {
        return res.status(400).json({ message: "Cannot use your own referral code" });
      }

      const existingReferral = await storage.getReferralByUsers(referrer.id, userId);
      if (existingReferral) {
        return res.status(400).json({ message: "Referral already exists" });
      }

      const currentUser = await storage.getUser(userId);
      if (currentUser?.referredBy) {
        return res.status(400).json({ message: "You already have a referrer" });
      }

      await storage.upsertUser({ id: userId, referredBy: referrer.id });
      const referral = await storage.createReferral(referrer.id, userId);

      res.json({ message: "Referral code applied successfully", referral });
    } catch (error) {
      console.error("Error applying referral:", error);
      res.status(500).json({ message: "Failed to apply referral code" });
    }
  });

  // Get user's referrals
  app.get('/api/referrals', verifyFirebaseToken, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const referrals = await storage.getReferrals(userId);
      res.json(referrals);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      res.status(500).json({ message: "Failed to fetch referrals" });
    }
  });

  // Get referral stats
  app.get('/api/referrals/stats', verifyFirebaseToken, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const referrals = await storage.getReferrals(userId);

      const activeCount = referrals.filter(r => r.status === 'active').length;
      const pendingCount = referrals.filter(r => r.status === 'pending').length;
      const totalCredits = activeCount * 250; // Weekly credit (250 per referral)
      const subscriptionFree = activeCount >= 2; // 2 * 250 >= 500
      const weeklyPayout = subscriptionFree ? Math.max(0, totalCredits - 500) : 0;

      res.json({
        totalReferrals: referrals.length,
        activeReferrals: activeCount,
        pendingReferrals: pendingCount,
        weeklyCredits: totalCredits, // Renamed from monthlyCredits
        subscriptionFree,
        weeklyPayout, // Renamed from monthlyPayout
      });
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      res.status(500).json({ message: "Failed to fetch referral stats" });
    }
  });

  // Get subscription
  app.get('/api/subscription', verifyFirebaseToken, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const subscription = await storage.getSubscription(userId);
      res.json(subscription || null);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  // Create subscription payment
  app.post('/api/subscription/pay', verifyFirebaseToken, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const { paymentProvider, paymentPhone, referralCode } = req.body;

      if (!paymentProvider || !paymentPhone) {
        return res.status(400).json({ message: "Payment provider and phone are required" });
      }

      const user = await storage.getUser(userId);
      if (!user?.phone) {
        await storage.updateUserPhone(userId, paymentPhone);
      }

      if (referralCode && !user?.referredBy) {
        const referrer = await storage.getUserByReferralCode(referralCode);
        if (referrer && referrer.id !== userId) {
          await storage.upsertUser({ id: userId, referredBy: referrer.id });
          await storage.createReferral(referrer.id, userId);
        }
      }

      const subscription = await storage.createSubscription({
        userId,
        paymentProvider,
        paymentPhone,
        amount: 500, // Weekly amount
      });

      await storage.createTransaction({
        userId,
        type: 'subscription_payment',
        amount: -500,
        description: 'Weekly subscription payment',
        referenceId: subscription.id,
      });

      if (user?.referredBy) {
        const referral = await storage.getReferralByUsers(user.referredBy, userId);
        if (referral && referral.status === 'pending') {
          await storage.activateReferral(referral.id);

          await storage.createTransaction({
            userId: user.referredBy,
            type: 'referral_credit',
            amount: 250,
            description: `Referral bonus from ${user.firstName || user.email}`,
            referenceId: referral.id,
          });
        }
      }

      res.json({ message: "Payment successful", subscription });
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ message: "Failed to process payment" });
    }
  });

  // Get user's payouts
  app.get('/api/payouts', verifyFirebaseToken, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const payouts = await storage.getUserPayouts(userId);
      res.json(payouts);
    } catch (error) {
      console.error("Error fetching payouts:", error);
      res.status(500).json({ message: "Failed to fetch payouts" });
    }
  });

  // Request payout
  app.post('/api/payouts/request', verifyFirebaseToken, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const { amount, paymentPhone, paymentProvider } = req.body;

      if (!amount || !paymentPhone || !paymentProvider) {
        return res.status(400).json({ message: "Amount, phone, and provider are required" });
      }

      const activeReferrals = await storage.getActiveReferralCount(userId);
      const weeklyCredits = activeReferrals * 250;
      const maxPayout = Math.max(0, weeklyCredits - 500);

      if (amount > maxPayout) {
        return res.status(400).json({ message: `Maximum payout available is ${maxPayout} LRD` });
      }

      const payout = await storage.createPayout(userId, amount, paymentPhone, paymentProvider);
      res.json({ message: "Payout request submitted", payout });
    } catch (error) {
      console.error("Error requesting payout:", error);
      res.status(500).json({ message: "Failed to request payout" });
    }
  });

  // Get transactions
  app.get('/api/transactions', verifyFirebaseToken, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const transactions = await storage.getTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Admin routes
  app.get('/api/admin/users', verifyFirebaseToken, isAdmin, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();

      const usersWithStats = await Promise.all(
        users.map(async (user) => {
          const activeReferrals = await storage.getActiveReferralCount(user.id);
          const subscription = await storage.getSubscription(user.id);
          const payouts = await storage.getUserPayouts(user.id);
          const totalEarnings = payouts
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0);

          return {
            ...user,
            referralsCount: activeReferrals,
            subscriptionStatus: subscription?.status || 'none',
            totalEarnings,
          };
        })
      );

      res.json(usersWithStats);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/stats', verifyFirebaseToken, isAdmin, async (req: any, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get('/api/admin/payouts/pending', verifyFirebaseToken, isAdmin, async (req: any, res) => {
    try {
      const payouts = await storage.getPendingPayouts();
      res.json(payouts);
    } catch (error) {
      console.error("Error fetching pending payouts:", error);
      res.status(500).json({ message: "Failed to fetch pending payouts" });
    }
  });

  app.post('/api/admin/payouts/:id/approve', verifyFirebaseToken, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const adminId = req.user.uid;

      const payout = await storage.approvePayout(id, adminId);

      await storage.createTransaction({
        userId: payout.userId,
        type: 'payout',
        amount: -payout.amount,
        description: 'Payout approved',
        referenceId: payout.id,
      });

      res.json({ message: "Payout approved", payout });
    } catch (error) {
      console.error("Error approving payout:", error);
      res.status(500).json({ message: "Failed to approve payout" });
    }
  });

  app.post('/api/admin/payouts/:id/complete', verifyFirebaseToken, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const payout = await storage.completePayout(id);
      res.json({ message: "Payout completed", payout });
    } catch (error) {
      console.error("Error completing payout:", error);
      res.status(500).json({ message: "Failed to complete payout" });
    }
  });

  app.patch('/api/admin/users/:id/admin', verifyFirebaseToken, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { isAdmin: makeAdmin } = req.body;

      const user = await storage.upsertUser({ id, isAdmin: makeAdmin });
      res.json(user);
    } catch (error) {
      console.error("Error updating user admin status:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Finance Tracker Routes
  app.post('/api/finance', verifyFirebaseToken, async (req: any, res) => {
    console.log("POST /api/finance called", req.body);
    try {
      const userId = req.user.uid;
      const recordData = insertFinanceRecordSchema.parse(req.body);
      const record = await storage.createFinanceRecord(userId, recordData);
      res.json(record);
    } catch (error) {
      console.error("Error creating finance record:", error);
      res.status(400).json({ message: "Invalid record data" });
    }
  });

  app.get('/api/finance', verifyFirebaseToken, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const records = await storage.getFinanceRecords(userId);
      res.json(records);
    } catch (error) {
      console.error("Error fetching finance records:", error);
      res.status(500).json({ message: "Failed to fetch records" });
    }
  });

  app.delete('/api/finance/:id', verifyFirebaseToken, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const recordId = req.params.id;
      await storage.deleteFinanceRecord(recordId, userId);
      res.status(200).json({ message: "Record deleted" });
    } catch (error: any) {
      console.error("Error deleting finance record:", error);
      if (error.message === "Unauthorized") {
        res.status(403).json({ message: "Unauthorized" });
      } else {
        res.status(500).json({ message: "Failed to delete record" });
      }
    }
  });

  return httpServer;
}
