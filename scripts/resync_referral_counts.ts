
import { db } from "../server/lib/firebase";

async function run() {
    console.log("Starting referral count re-sync...");
    try {
        // 1. Get all active referrals
        console.log("Fetching active referrals...");
        const referralsSnapshot = await db.collection('referrals')
            .where('status', '==', 'active')
            .get();

        // 2. Aggregate counts by referrerId
        const referralCounts: Record<string, number> = {};
        referralsSnapshot.forEach(doc => {
            const data = doc.data();
            const referrerId = data.referrerId;
            if (referrerId) {
                referralCounts[referrerId] = (referralCounts[referrerId] || 0) + 1;
            }
        });

        console.log(`Found ${referralsSnapshot.size} active active referrals across ${Object.keys(referralCounts).length} referrers.`);

        // 3. Get all users to ensure we reset those with 0
        console.log("Fetching users...");
        const usersSnapshot = await db.collection('users').get();

        const batch = db.batch();
        let updatedCount = 0;

        usersSnapshot.forEach(doc => {
            const userId = doc.id;
            const currentCount = doc.data().referralCount || 0;
            const actualCount = referralCounts[userId] || 0;

            if (currentCount !== actualCount) {
                console.log(`Updating User ${userId}: ${currentCount} -> ${actualCount}`);
                const ref = db.collection('users').doc(userId);
                batch.update(ref, { referralCount: actualCount });
                updatedCount++;
            }
        });

        if (updatedCount > 0) {
            await batch.commit();
            console.log(`Successfully re-synced ${updatedCount} users.`);
        } else {
            console.log("All user referral counts are already consistent.");
        }

    } catch (err: any) {
        console.error("Re-sync failed:", err);
        process.exit(1);
    }
    console.log("Done.");
    process.exit(0);
}

run();
