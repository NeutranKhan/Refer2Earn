import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin
// Note: This requires GOOGLE_APPLICATION_CREDENTIALS environment variable 
// or a service account key file path to be set.
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            // projectId: "pizzadelivery-d6ef4", // Optional if using default creds
        });
        console.log("[Firebase Admin] Initialized successfully");
    } catch (error) {
        console.error("[Firebase Admin] Initialization failed. Make sure GOOGLE_APPLICATION_CREDENTIALS is set.");
        // For development without credentials, we might want to mock or just log error
        // but the app won't function correctly without it for DB access.
    }
}

export const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });
export const auth = getAuth();
