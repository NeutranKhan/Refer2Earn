import { ProgressTracker } from "../ProgressTracker";

export default function ProgressTrackerExample() {
  return (
    <div className="space-y-6">
      <ProgressTracker currentReferrals={2} />
      <ProgressTracker currentReferrals={5} />
    </div>
  );
}
