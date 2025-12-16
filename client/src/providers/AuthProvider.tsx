import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User, Subscription } from "@shared/schema";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

interface AuthUser extends User {
    activeReferrals: number;
    subscription: Subscription | null;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: Error | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const queryClient = useQueryClient();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setFirebaseUser(user);
            setAuthLoading(false);

            if (user) {
                // Invalidate fetching user data when firebase auth changes
                queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
            } else {
                queryClient.setQueryData(["/api/auth/user"], null);
            }
        });

        return () => unsubscribe();
    }, [queryClient]);

    const { data: user, isLoading: isQueryLoading, error } = useQuery<AuthUser>({
        queryKey: ["/api/auth/user" + (localStorage.getItem("referralCode") ? `?referralCode=${localStorage.getItem("referralCode")}` : "")],
        enabled: !!firebaseUser,
        retry: false,
        staleTime: Infinity, // Important to prevent random refetches
    });

    const isLoading = authLoading || (!!firebaseUser && isQueryLoading);
    const isAuthenticated = !!firebaseUser && !!user;

    return (
        <AuthContext.Provider
            value={{
                user: user || null,
                isLoading,
                isAuthenticated,
                error: error as Error | null,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Hook to consume the context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
