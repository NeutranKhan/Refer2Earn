
import { storage } from "../server/storage";

async function run() {
    console.log("Testing storage.getLeaderboard() directly...");
    try {
        const users = await storage.getLeaderboard();
        console.log(`Result count: ${users.length}`);
        console.log("Users:", JSON.stringify(users, null, 2));
    } catch (err) {
        console.error("Error calling getLeaderboard:", err);
    }
    process.exit(0);
}

run();
