import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { Phone, CreditCard, Shield, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface PaymentCardProps {
  amount?: number;
  onPaymentComplete?: () => void;
}

export function PaymentCard({
  amount = 200,
  onPaymentComplete,
}: PaymentCardProps) {
  const [provider, setProvider] = useState("mtn");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const { toast } = useToast();

  const payMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/subscription/pay", {
        paymentProvider: provider,
        paymentPhone: phoneNumber,
        referralCode: referralCode || undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: "Payment Initiated!",
        description: "Please check your phone and confirm the payment.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/referrals/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      onPaymentComplete?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePayment = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your Mobile Money phone number",
        variant: "destructive",
      });
      return;
    }

    payMutation.mutate();
  };

  const providers = [
    {
      id: "mtn",
      name: "Lonestar Cell MTN",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      id: "orange",
      name: "Orange Money",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="glass rounded-2xl p-6 md:p-8 neon-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl gradient-neon">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-foreground">
            Subscribe Now
          </h3>
          <p className="text-muted-foreground">Pay via Mobile Money</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">
            Select Payment Provider
          </Label>
          <RadioGroup
            value={provider}
            onValueChange={setProvider}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {providers.map((p) => (
              <Label
                key={p.id}
                htmlFor={p.id}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all glass-strong ${provider === p.id
                    ? "neon-border"
                    : "border border-transparent hover:border-primary/30"
                  }`}
              >
                <RadioGroupItem value={p.id} id={p.id} className="sr-only" />
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center`}
                >
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{p.name}</p>
                  <p className="text-sm text-muted-foreground">Mobile Money</p>
                </div>
                {provider === p.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </motion.div>
                )}
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Mobile Money Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+231 XX XXX XXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="glass-strong"
            data-testid="input-phone"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="referral">Referral Code (Optional)</Label>
          <Input
            id="referral"
            type="text"
            placeholder="Enter referral code"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            className="glass-strong"
            data-testid="input-referral"
          />
          {referralCode && (
            <p className="text-sm text-green-500">
              Referral code applied! Your referrer will earn 100 LRD credit.
            </p>
          )}
        </div>

        <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Weekly Subscription</span>
            <span className="text-2xl font-display font-bold text-foreground">
              {amount.toLocaleString()} LRD
            </span>
          </div>
        </div>

        <Button
          className="w-full neon-glow text-base py-6"
          onClick={handlePayment}
          disabled={payMutation.isPending}
          data-testid="button-pay"
        >
          {payMutation.isPending ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>Pay {amount.toLocaleString()} LRD</>
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4" />
          <span>Secure payment powered by Mobile Money</span>
        </div>
      </div>
    </div>
  );
}
