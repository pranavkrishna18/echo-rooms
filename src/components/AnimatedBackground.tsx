export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Large gradient orbs */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/8 blur-3xl animate-[drift-1_20s_ease-in-out_infinite]" />
      <div className="absolute top-1/4 -right-24 h-80 w-80 rounded-full bg-accent/8 blur-3xl animate-[drift-2_25s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-primary/5 blur-3xl animate-[drift-3_22s_ease-in-out_infinite]" />
      <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/5 blur-3xl animate-[drift-4_18s_ease-in-out_infinite]" />

      {/* Small floating particles */}
      <div className="absolute top-[15%] left-[10%] h-2 w-2 rounded-full bg-primary/20 animate-[particle_6s_ease-in-out_infinite]" />
      <div className="absolute top-[45%] right-[15%] h-1.5 w-1.5 rounded-full bg-accent/25 animate-[particle_8s_ease-in-out_infinite_1s]" />
      <div className="absolute bottom-[25%] left-[20%] h-2.5 w-2.5 rounded-full bg-primary/15 animate-[particle_7s_ease-in-out_infinite_2s]" />
      <div className="absolute top-[70%] right-[25%] h-1.5 w-1.5 rounded-full bg-primary/20 animate-[particle_9s_ease-in-out_infinite_0.5s]" />
      <div className="absolute top-[30%] left-[60%] h-2 w-2 rounded-full bg-accent/20 animate-[particle_5s_ease-in-out_infinite_3s]" />
      <div className="absolute bottom-[40%] right-[40%] h-1 w-1 rounded-full bg-primary/25 animate-[particle_10s_ease-in-out_infinite_1.5s]" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
