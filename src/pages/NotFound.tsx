import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <AnimatedBackground />
      <div className="text-center">
        <h1 className="mb-2 font-display text-7xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Oops! Page not found</p>
        <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/85 px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:-translate-y-0.5">
          <ArrowLeft size={16} /> Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
