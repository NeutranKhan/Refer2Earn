import { PaymentCard } from "../PaymentCard";

export default function PaymentCardExample() {
  return (
    <div className="max-w-md mx-auto">
      <PaymentCard onPaymentComplete={() => console.log("Payment complete")} />
    </div>
  );
}
