import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { LogOut, User, Shield, Home, Sparkles } from "lucide-react";

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-md shadow-primary/20">
            <Sparkles size={18} />
          </div>
          <span className="font-display text-xl font-bold text-foreground tracking-tight">EchoRoom</span>
        </Link>

        <div className="flex items-center gap-1">
          {isLoggedIn ? (
            <>
              <Link to="/rooms" className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <Home size={16} /> Rooms
              </Link>
              <Link to="/profile" className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <User size={16} /> Profile
              </Link>
              <Link to="/admin" className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <Shield size={16} /> Admin
              </Link>
              <button onClick={handleLogout} className="ml-2 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Log in
              </Link>
              <Link to="/register" className="rounded-xl bg-gradient-to-r from-primary to-primary/80 px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
