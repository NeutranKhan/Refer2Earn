import { Admin } from "@/pages/Admin";

export default function AdminExample() {
  return <Admin onLogout={() => console.log("Logout clicked")} />;
}
