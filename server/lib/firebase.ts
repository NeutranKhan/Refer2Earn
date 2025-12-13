import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin
if (!admin.apps.length) {
    try {
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
            ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
            : undefined;

        if (serviceAccount) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log("[Firebase Admin] Initialized successfully with env vars");
        } else {
            // Fallback for local development or if GOOGLE_APPLICATION_CREDENTIALS is set
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
            });
            console.log("[Firebase Admin] Initialized successfully with default credentials");
        }
    } catch (error) {
        console.error("[Firebase Admin] Initialization failed:", error);
    }
}

export const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });
export const auth = getAuth();
