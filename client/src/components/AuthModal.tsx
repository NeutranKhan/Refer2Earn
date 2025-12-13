import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { apiRequest } from "../lib/queryClient";

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    referralCode: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(userCredential.user, {
          displayName: formData.name,
        });

        // Sync extra data to backend
        try {
          if (formData.phone) {
            await apiRequest("PATCH", "/api/users/phone", { phone: formData.phone });
          }
          if (formData.referralCode) {
            await apiRequest("POST", "/api/referrals/apply", { referralCode: formData.referralCode });
          }
        } catch (err) {
          console.error("Failed to sync user data", err);
          // Non-fatal? Or warn user?
        }

        toast({
          title: "Account created!",
          description: "Your account has been created successfully.",
        });
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast({
          title: "Welcome back!",
          description: "You've been logged in successfully.",
        });
      }

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Auth error:", error);

      let errorMessage = error.message || "An error occurred during authentication";
      let errorTitle = "Authentication failed";

      if (error.code === "auth/network-request-failed") {
        errorTitle = "Connection Error";
        errorMessage = "Unable to connect to authentication server. Please check your internet connection and ensure no firewalls or VPNs are blocking Firebase.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use. Please try logging in instead.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password. Please try again.";
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-strong border-primary/20 sm:max-w-md p-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
        </div>

        <DialogHeader className="p-6 pb-0 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg gradient-neon">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg gradient-neon-text">
              Refer2Earn
            </span>
          </div>
          <DialogTitle className="text-2xl font-display font-bold text-foreground">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription>
            {mode === "login" ? "Sign in to your account" : "Create a new account"}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 relative z-10">
          <div className="flex gap-2 p-1 rounded-xl glass mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${mode === "login"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
              data-testid="button-mode-login"
            >
              Login
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${mode === "signup"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
              data-testid="button-mode-signup"
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="pl-10 glass-strong"
                        data-testid="input-name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+231 XX XXX XXXX"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="pl-10 glass-strong"
                        data-testid="input-phone"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 glass-strong"
                  data-testid="input-email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10 glass-strong"
                  data-testid="input-password"
                />
              </div>
            </div>

            <AnimatePresence>
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                  <Input
                    id="referralCode"
                    placeholder="Enter referral code"
                    value={formData.referralCode}
                    onChange={(e) =>
                      handleInputChange("referralCode", e.target.value.toUpperCase())
                    }
                    className="glass-strong"
                    data-testid="input-referral-code"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              className="w-full neon-glow"
              disabled={isLoading}
              data-testid="button-submit-auth"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  {mode === "login" ? "Login" : "Create Account"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {mode === "login" && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => console.log("Forgot password")}
              >
                Forgot your password?
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
