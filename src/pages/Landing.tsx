import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Heart, Shield, BarChart3, Users, MessageCircle, Sparkles, ArrowRight } from "lucide-react";

const features = [
  { icon: Heart, title: "Safe Spaces", desc: "Join rooms where vulnerability is welcomed and every voice matters.", gradient: "from-pink-500/10 to-rose-500/10" },
  { icon: Shield, title: "AI Moderation", desc: "Smart filtering keeps conversations kind, supportive, and constructive.", gradient: "from-primary/10 to-violet-500/10" },
  { icon: BarChart3, title: "Mood Insights", desc: "Track emotional trends across rooms with beautiful weekly mood graphs.", gradient: "from-blue-500/10 to-cyan-500/10" },
  { icon: Users, title: "Anonymous Sharing", desc: "Post freely under a random alias — no judgment, just understanding.", gradient: "from-emerald-500/10 to-green-500/10" },
  { icon: MessageCircle, title: "Emotion-Aware Replies", desc: "AI detects your emotion and offers thoughtful, empathetic responses.", gradient: "from-amber-500/10 to-orange-500/10" },
  { icon: Sparkles, title: "No One Left Unheard", desc: "Posts without replies get flagged so the community can rally support.", gradient: "from-purple-500/10 to-fuchsia-500/10" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-28 md:py-36">
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <Sparkles size={14} /> Safe spaces powered by smart listening
            </div>
            <h1 className="mb-6 font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Where Every Voice{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Echoes
              </span>{" "}
              With Care
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground md:text-xl">
              Join AI-moderated emotional rooms where you can share anonymously, find support, and heal together. No toxicity — just genuine connection.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/register"
                className="group inline-flex h-13 items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-primary/85 px-8 py-3 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1"
              >
                Join the Community
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/login"
                className="inline-flex h-13 items-center rounded-2xl border border-border bg-card/50 px-8 py-3 text-base font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-card hover:shadow-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Floating emojis */}
        <div className="pointer-events-none absolute left-[10%] top-[20%] animate-float text-4xl opacity-20">💜</div>
        <div className="pointer-events-none absolute right-[15%] top-[30%] animate-float text-3xl opacity-15" style={{ animationDelay: "1s" }}>✨</div>
        <div className="pointer-events-none absolute left-[20%] bottom-[20%] animate-float text-3xl opacity-15" style={{ animationDelay: "2s" }}>🌿</div>
        <div className="pointer-events-none absolute right-[10%] bottom-[30%] animate-float text-4xl opacity-20" style={{ animationDelay: "0.5s" }}>🤝</div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">Built for Emotional Safety</h2>
            <p className="text-muted-foreground">Every feature designed to make sharing feel safe and meaningful.</p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="group glass-card rounded-2xl p-6 opacity-0 animate-fade-in transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${f.gradient} p-3 text-primary transition-transform duration-300 group-hover:scale-110`}>
                  <f.icon size={22} />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl rounded-3xl bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-primary/10 p-12 text-center shadow-xl shadow-primary/5">
            <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-foreground">Ready to Be Heard?</h2>
            <p className="mb-8 text-muted-foreground">Your story matters. Join thousands who've found comfort in EchoRoom.</p>
            <Link
              to="/register"
              className="inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-accent px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Started Free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>✨ EchoRoom — Safe spaces powered by smart listening.</p>
        </div>
      </footer>
    </div>
  );
}
