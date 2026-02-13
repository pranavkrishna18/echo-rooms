import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
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
      <Navbar />
      <div className="container mx-auto max-w-lg px-4 py-10">
        <Link to="/rooms" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} /> Back to Rooms
        </Link>

        <div className="glass-card rounded-2xl p-8">
          <div className="mb-6 text-center">
            <span className="mb-2 block text-4xl">✨</span>
            <h1 className="font-display text-2xl font-bold text-foreground">Create a Room</h1>
            <p className="mt-1 text-sm text-muted-foreground">Build a safe space for a topic you care about</p>
          </div>

          {created ? (
            <div className="rounded-xl bg-primary/10 p-6 text-center animate-fade-in">
              <span className="mb-2 block text-3xl"><Sparkles className="inline" size={28} /></span>
              <p className="font-medium text-foreground">Room "{name}" created!</p>
              <p className="mt-1 text-sm text-muted-foreground">Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
              )}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Room Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Anxiety Support"
                  maxLength={50}
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
                  className="w-full resize-none rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all ${emoji === e ? "bg-primary/15 ring-2 ring-primary scale-110" : "bg-muted hover:bg-muted/80"}`}
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
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-all ${category === cat ? "bg-primary/15 ring-2 ring-primary font-semibold text-primary" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    >
                      {CATEGORY_ICONS[cat]} {cat}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Create Room {emoji}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
