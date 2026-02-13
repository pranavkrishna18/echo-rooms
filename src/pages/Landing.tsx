import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Heart, Shield, BarChart3, Users, MessageCircle, Sparkles } from "lucide-react";

const features = [
  { icon: Heart, title: "Safe Spaces", desc: "Join rooms where vulnerability is welcomed and every voice matters." },
  { icon: Shield, title: "AI Moderation", desc: "Smart filtering keeps conversations kind, supportive, and constructive." },
  { icon: BarChart3, title: "Mood Insights", desc: "Track emotional trends across rooms with beautiful weekly mood graphs." },
  { icon: Users, title: "Anonymous Sharing", desc: "Post freely under a random alias — no judgment, just understanding." },
  { icon: MessageCircle, title: "Emotion-Aware Replies", desc: "AI detects your emotion and offers thoughtful, empathetic responses." },
  { icon: Sparkles, title: "No One Left Unheard", desc: "Posts without replies get flagged so the community can rally support." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles size={16} /> Safe spaces powered by smart listening
            </div>
            <h1 className="mb-6 font-display text-5xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl">
              Where Every Voice{" "}
              <span className="text-primary">Echoes</span>{" "}
              With Care
            </h1>
            <p className="mb-10 text-lg text-muted-foreground md:text-xl">
              Join AI-moderated emotional rooms where you can share anonymously, find support, and heal together. No toxicity — just genuine human connection.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/register" className="inline-flex h-12 items-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                Join the Community
              </Link>
              <Link to="/login" className="inline-flex h-12 items-center rounded-xl border border-border bg-card px-8 text-base font-semibold text-foreground transition-all hover:bg-muted">
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Floating emojis */}
        <div className="pointer-events-none absolute left-[10%] top-[20%] animate-float text-4xl opacity-20">🫧</div>
        <div className="pointer-events-none absolute right-[15%] top-[30%] animate-float text-3xl opacity-15" style={{ animationDelay: "1s" }}>💚</div>
        <div className="pointer-events-none absolute left-[20%] bottom-[20%] animate-float text-3xl opacity-15" style={{ animationDelay: "2s" }}>🌱</div>
        <div className="pointer-events-none absolute right-[10%] bottom-[30%] animate-float text-4xl opacity-20" style={{ animationDelay: "0.5s" }}>🤝</div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="mb-3 font-display text-3xl font-bold text-foreground md:text-4xl">Built for Emotional Safety</h2>
            <p className="text-muted-foreground">Every feature designed to make sharing feel safe and meaningful.</p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div key={i} className="glass-card rounded-xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5 text-primary">
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl rounded-2xl bg-primary/5 border border-primary/10 p-10 text-center">
            <h2 className="mb-3 font-display text-2xl font-bold text-foreground md:text-3xl">Ready to Be Heard?</h2>
            <p className="mb-6 text-muted-foreground">Your story matters. Join thousands who've found comfort in EchoRoom.</p>
            <Link to="/register" className="inline-flex h-11 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>🫧 EchoRoom AI — Safe spaces powered by smart listening. Demo application.</p>
        </div>
      </footer>
    </div>
  );
}
