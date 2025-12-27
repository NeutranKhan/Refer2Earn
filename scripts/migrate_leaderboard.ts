
import { db } from "../server/lib/firebase";

async function run() {
    console.log("Starting direct migration...");
    try {
        const snapshot = await db.collection('users').get();
        console.log(`Found ${snapshot.size} users.`);

        // Process in chunks just in case, though 8 is small.
        const batch = db.batch();
        let updated = 0;

        snapshot.forEach(doc => {
            const data = doc.data();
            // Check if referralCount is missing
            if (typeof data.referralCount === 'undefined') {
                const ref = db.collection('users').doc(doc.id);
                batch.update(ref, { referralCount: 0 });
                updated++;
            }
        });

        if (updated > 0) {
            await batch.commit();
            console.log(`Successfully backfilled ${updated} users with referralCount: 0`);
        } else {
            console.log("No users needed updating.");
        }

    } catch (err: any) {
        console.error("Migration failed:", err.message);
        process.exit(1);
    }
    console.log("Done.");
    process.exit(0);
}

run();
