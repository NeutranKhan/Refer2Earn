import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Share2, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReferralCodeCardProps {
  referralCode: string;
  referralLink?: string;
}

export function ReferralCodeCard({
  referralCode,
  referralLink = `https://refer2-earn.vercel.app/join/${referralCode}`,
}: ReferralCodeCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the code manually",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join WealthBridge Liberia",
          text: `Use my referral code ${referralCode} to join WealthBridge Liberia and start earning!`,
          url: referralLink,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="glass rounded-2xl p-6 md:p-8 neon-border-cyan">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-display font-bold text-foreground">
            Your Referral Code
          </h3>
          <p className="text-muted-foreground mt-1">
            Share this code with friends to earn credits
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="relative px-8 py-4 rounded-xl glass-strong neon-border overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0 gradient-neon opacity-10" />
            <p className="text-2xl md:text-3xl font-display font-bold tracking-widest text-foreground relative z-10">
              {referralCode}
            </p>
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center bg-green-500/90 rounded-xl"
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
              data-testid="button-copy-code"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              size="sm"
              onClick={handleShare}
              className="gap-2 neon-glow"
              data-testid="button-share-code"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/30">
        <div className="flex items-start gap-3">
          <QrCode className="w-5 h-5 text-accent mt-0.5" />
          <div>
            <p className="font-medium text-foreground">Quick Share Link</p>
            <p className="text-sm text-muted-foreground break-all mt-1">
              {referralLink}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
