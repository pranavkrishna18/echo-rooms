import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import RoomCard from "@/components/RoomCard";
import UserChatbot from "@/components/UserChatbot";
import { getAllRooms } from "@/lib/roomsStore";
import { Plus, Search, Sparkles, Globe } from "lucide-react";
import { useState } from "react";

export default function RoomsDashboard() {
  const [search, setSearch] = useState("");
  const rooms = getAllRooms();
  const filtered = rooms.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute top-10 right-10 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-primary/5 blur-2xl" />
        </div>

        <div className="container relative mx-auto px-4 py-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <Globe size={12} className="animate-[spin_8s_linear_infinite]" />
                Live emotional spaces
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Explore <span className="text-primary">Rooms</span>
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
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                <Plus size={16} /> New Room
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Room Stats Bar */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto flex items-center gap-6 px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles size={14} className="text-primary" />
            <span className="font-medium text-foreground">{rooms.length}</span> active rooms
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{rooms.reduce((sum, r) => sum + r.memberCount, 0)}</span> members connected
          </div>
          {search && (
            <>
              <div className="h-3 w-px bg-border" />
              <div className="text-xs text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filtered.length}</span> results
              </div>
            </>
          )}
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Search size={24} className="text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">No rooms found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No rooms matching "{search}" — try a different search or create one!
            </p>
          </div>
        )}
      </div>

      <UserChatbot />
    </div>
  );
}
