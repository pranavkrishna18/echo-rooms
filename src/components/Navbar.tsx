import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { LogOut, User, Shield, Home, Users } from "lucide-react";

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🫧</span>
          <span className="font-display text-xl font-bold text-foreground">EchoRoom</span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">AI</span>
        </Link>

        <div className="flex items-center gap-1">
          {isLoggedIn ? (
            <>
              <Link to="/rooms" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <Home size={16} /> Rooms
              </Link>
              <Link to="/profile" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <User size={16} /> Profile
              </Link>
              <Link to="/people" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <Users size={16} /> People
              </Link>
              <Link to="/admin" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <Shield size={16} /> Admin
              </Link>
              <button onClick={handleLogout} className="ml-2 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Log in
              </Link>
              <Link to="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
