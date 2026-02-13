import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    const success = register(name.trim(), email.trim(), password);
    if (!success) {
      setError("An account with this email already exists.");
      return;
    }
    setSubmitted(true);
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <Navbar />
      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="glass-card rounded-3xl p-8 shadow-xl shadow-primary/5">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary shadow-lg shadow-accent/25">
                <Sparkles size={24} className="text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">Create Your Space</h1>
              <p className="mt-1 text-sm text-muted-foreground">Join the EchoRoom community</p>
            </div>

            {submitted ? (
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-8 text-center">
                <span className="mb-3 block text-4xl">✨</span>
                <p className="font-semibold text-foreground">Account created!</p>
                <p className="mt-1 text-sm text-muted-foreground">Redirecting to login...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive text-center">{error}</p>}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="h-12 w-full rounded-xl border border-input bg-background/80 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-input bg-background/80 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="h-12 w-full rounded-xl border border-input bg-background/80 px-4 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="h-12 w-full rounded-xl bg-gradient-to-r from-primary to-accent text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                  Create Account
                </button>
              </form>
            )}

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
