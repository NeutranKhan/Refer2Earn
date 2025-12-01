import { Landing } from "@/pages/Landing";

export default function LandingExample() {
  return (
    <Landing
      isLoggedIn={false}
      onLogin={() => console.log("Login clicked")}
      onLogout={() => console.log("Logout clicked")}
    />
  );
}
