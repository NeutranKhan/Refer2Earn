import { useQuery } from "@tanstack/react-query";
import type { User, Subscription } from "@shared/schema";

interface AuthUser extends User {
  activeReferrals: number;
  subscription: Subscription | null;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<AuthUser>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
