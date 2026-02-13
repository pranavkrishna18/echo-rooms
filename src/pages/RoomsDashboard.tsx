import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import RoomCard from "@/components/RoomCard";
import UserChatbot from "@/components/UserChatbot";
import AnimatedBackground from "@/components/AnimatedBackground";
import { getAllRooms } from "@/lib/roomsStore";
import { ROOM_CATEGORIES, CATEGORY_ICONS, type RoomCategory } from "@/lib/mockData";
import { Plus, Search, Sparkles, Globe, LayoutGrid } from "lucide-react";
import { useState } from "react";

export default function RoomsDashboard() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<RoomCategory | "All">("All");
  const rooms = getAllRooms();

  const filtered = rooms.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="container relative mx-auto px-4 py-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary backdrop-blur-sm">
                <Globe size={12} className="animate-[spin_8s_linear_infinite]" />
                Live emotional spaces
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Explore <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Rooms</span>
              </h1>
              <p className="mt-2 max-w-md text-muted-foreground">
                Find a safe space that resonates with you. Every room is AI-moderated for genuine connection.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search rooms..."
                  className="h-11 w-64 rounded-xl border border-input bg-background/80 pl-10 pr-4 text-sm text-foreground shadow-sm backdrop-blur-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
              </div>
              <Link
                to="/create-room"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/85 px-5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                <Plus size={16} /> New Room
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setActiveCategory("All")}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  activeCategory === "All"
                    ? "bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <LayoutGrid size={12} /> All
              </button>
              {ROOM_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-sm"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  <span>{CATEGORY_ICONS[cat]}</span> {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-primary" />
                <span className="font-semibold text-foreground">{filtered.length}</span> rooms
              </div>
              <div className="h-3 w-px bg-border" />
              <div>
                <span className="font-semibold text-foreground">{filtered.reduce((sum, r) => sum + r.memberCount, 0)}</span> members
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((room, i) => (
            <div
              key={room.id}
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <RoomCard room={room} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
              <Search size={24} className="text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">No rooms found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search or category, or create a new room!
            </p>
          </div>
        )}
      </div>

      <UserChatbot />
    </div>
  );
}
