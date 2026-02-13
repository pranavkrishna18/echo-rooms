import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { addRoom } from "@/lib/roomsStore";
import { ROOM_CATEGORIES, CATEGORY_ICONS, type RoomCategory } from "@/lib/mockData";

const EMOJIS = ["📚", "💔", "🌙", "💼", "🌻", "🏠", "🎵", "🧠", "💪", "🌊", "🕊️", "🔥"];

export default function CreateRoom() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [emoji, setEmoji] = useState("🌻");
  const [category, setCategory] = useState<RoomCategory>("Mental Health");
  const [created, setCreated] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a room name.");
      return;
    }
    if (!desc.trim()) {
      setError("Please enter a description.");
      return;
    }
    setError("");
    addRoom({ name: name.trim(), description: desc.trim(), emoji, category });
    setCreated(true);
    setTimeout(() => navigate("/rooms"), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <Navbar />
      <div className="container mx-auto max-w-lg px-4 py-10">
        <Link to="/rooms" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} /> Back to Rooms
        </Link>

        <div className="glass-card rounded-3xl p-8 shadow-xl shadow-primary/5">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
              <Sparkles size={24} className="text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Create a Room</h1>
            <p className="mt-1 text-sm text-muted-foreground">Build a safe space for a topic you care about</p>
          </div>

          {created ? (
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-8 text-center animate-fade-in">
              <span className="mb-3 block text-4xl">✨</span>
              <p className="font-semibold text-foreground">Room "{name}" created!</p>
              <p className="mt-1 text-sm text-muted-foreground">Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-5">
              {error && (
                <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
              )}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Room Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Anxiety Support"
                  maxLength={50}
                  className="h-12 w-full rounded-xl border border-input bg-background/80 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="What's this room about?"
                  rows={3}
                  maxLength={200}
                  className="w-full resize-none rounded-xl border border-input bg-background/80 p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Choose an Emoji</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEmoji(e)}
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl transition-all ${emoji === e ? "bg-primary/15 ring-2 ring-primary scale-110" : "bg-secondary hover:bg-secondary/80"}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Category</label>
                <div className="flex flex-wrap gap-2">
                  {ROOM_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm transition-all ${category === cat ? "bg-primary/15 ring-2 ring-primary font-semibold text-primary" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                    >
                      {CATEGORY_ICONS[cat]} {cat}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="h-12 w-full rounded-xl bg-gradient-to-r from-primary to-primary/85 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                Create Room {emoji}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
