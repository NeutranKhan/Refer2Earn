import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/firebase.js";

export const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];

    try {
        const decodedToken = await auth.verifyIdToken(token);
        // Attach user to request. Matching existing structure where possible or adapting.
        // Existing app mocked structure: req.user.claims.sub
        // We will attach usage standard: req.user
        (req as any).user = decodedToken;
        next();
    } catch (error) {
        console.error("Error verifying Firebase token:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    // Assuming verifyFirebaseToken is run before this
    const user = (req as any).user;
    // Check custom claims or DB for admin status?
    // Previous implementation checked DB.
    // We can do the same.

    if (!user || !user.uid) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // We could add custom claims for admin, but let's stick to DB check for migration parity
    const { storage } = await import("../storage.js");
    const dbUser = await storage.getUser(user.uid);

    if (!dbUser?.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    next();
};
