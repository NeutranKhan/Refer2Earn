import { Dashboard } from "@/pages/Dashboard";

export default function DashboardExample() {
  return <Dashboard onLogout={() => console.log("Logout clicked")} />;
}
