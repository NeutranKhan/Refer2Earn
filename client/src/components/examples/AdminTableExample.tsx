import { AdminTable } from "../AdminTable";

const mockUsers = [
  {
    id: "1",
    name: "Kwame Johnson",
    email: "kwame@example.com",
    phone: "+231 77 123 4567",
    referralCode: "REF-KW8X4",
    referralsCount: 5,
    subscriptionStatus: "free" as const,
    totalEarnings: 3500,
    joinedDate: "Oct 15, 2024",
  },
  {
    id: "2",
    name: "Fatou Williams",
    email: "fatou@example.com",
    phone: "+231 88 234 5678",
    referralCode: "REF-FT2M9",
    referralsCount: 2,
    subscriptionStatus: "active" as const,
    totalEarnings: 1000,
    joinedDate: "Nov 1, 2024",
  },
  {
    id: "3",
    name: "Prince Cooper",
    email: "prince@example.com",
    phone: "+231 77 345 6789",
    referralCode: "REF-PC7K3",
    referralsCount: 0,
    subscriptionStatus: "pending" as const,
    totalEarnings: 0,
    joinedDate: "Nov 25, 2024",
  },
  {
    id: "4",
    name: "Mary Weah",
    email: "mary@example.com",
    phone: "+231 88 456 7890",
    referralCode: "REF-MW4L6",
    referralsCount: 1,
    subscriptionStatus: "expired" as const,
    totalEarnings: 500,
    joinedDate: "Sep 20, 2024",
  },
  {
    id: "5",
    name: "John Doe",
    email: "john@example.com",
    phone: "+231 77 567 8901",
    referralCode: "REF-JD1N5",
    referralsCount: 8,
    subscriptionStatus: "free" as const,
    totalEarnings: 7500,
    joinedDate: "Aug 10, 2024",
  },
  {
    id: "6",
    name: "Sarah Cole",
    email: "sarah@example.com",
    phone: "+231 88 678 9012",
    referralCode: "REF-SC3P8",
    referralsCount: 3,
    subscriptionStatus: "free" as const,
    totalEarnings: 0,
    joinedDate: "Nov 15, 2024",
  },
];

export default function AdminTableExample() {
  return (
    <AdminTable
      users={mockUsers}
      onApprove={(id) => console.log("Approve user:", id)}
      onBlock={(id) => console.log("Block user:", id)}
    />
  );
}
