import { Navbar } from "../Navbar";

export default function NavbarExample() {
  return (
    <div className="relative min-h-[100px]">
      <Navbar 
        isLoggedIn={false} 
        onLogin={() => console.log("Login clicked")}
        onLogout={() => console.log("Logout clicked")}
      />
    </div>
  );
}
