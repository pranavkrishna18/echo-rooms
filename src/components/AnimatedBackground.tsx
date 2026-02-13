export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient orbs — indigo/violet/pink */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px] animate-[drift-1_20s_ease-in-out_infinite]" />
      <div className="absolute top-1/4 -right-32 h-[400px] w-[400px] rounded-full bg-accent/8 blur-[100px] animate-[drift-2_25s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-primary/6 blur-[80px] animate-[drift-3_22s_ease-in-out_infinite]" />
      <div className="absolute top-2/3 right-1/4 h-[300px] w-[300px] rounded-full bg-accent/6 blur-[80px] animate-[drift-4_18s_ease-in-out_infinite]" />

      {/* Floating particles */}
      <div className="absolute top-[12%] left-[8%] h-2 w-2 rounded-full bg-primary/25 animate-[particle_6s_ease-in-out_infinite]" />
      <div className="absolute top-[40%] right-[12%] h-1.5 w-1.5 rounded-full bg-accent/30 animate-[particle_8s_ease-in-out_infinite_1s]" />
      <div className="absolute bottom-[20%] left-[18%] h-2.5 w-2.5 rounded-full bg-primary/20 animate-[particle_7s_ease-in-out_infinite_2s]" />
      <div className="absolute top-[65%] right-[22%] h-1.5 w-1.5 rounded-full bg-accent/25 animate-[particle_9s_ease-in-out_infinite_0.5s]" />
      <div className="absolute top-[25%] left-[55%] h-2 w-2 rounded-full bg-primary/20 animate-[particle_5s_ease-in-out_infinite_3s]" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
