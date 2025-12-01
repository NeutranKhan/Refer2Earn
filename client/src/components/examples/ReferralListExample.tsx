import { ReferralList } from "../ReferralList";

const mockReferrals = [
  {
    id: "1",
    name: "Kwame Johnson",
    phone: "+231 77 123 4567",
    status: "active" as const,
    joinedDate: "Nov 15, 2024",
    earnings: 500,
  },
  {
    id: "2",
    name: "Fatou Williams",
    phone: "+231 88 234 5678",
    status: "active" as const,
    joinedDate: "Nov 20, 2024",
    earnings: 500,
  },
  {
    id: "3",
    name: "Prince Cooper",
    phone: "+231 77 345 6789",
    status: "pending" as const,
    joinedDate: "Nov 28, 2024",
    earnings: 0,
  },
  {
    id: "4",
    name: "Mary Weah",
    phone: "+231 88 456 7890",
    status: "inactive" as const,
    joinedDate: "Oct 10, 2024",
    earnings: 0,
  },
];

export default function ReferralListExample() {
  return <ReferralList referrals={mockReferrals} />;
}
