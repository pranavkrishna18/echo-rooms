import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import RoomCard from "@/components/RoomCard";
import { getAllRooms } from "@/lib/roomsStore";
import { Plus, Search } from "lucide-react";
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
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Your Rooms</h1>
            <p className="mt-1 text-muted-foreground">Find a space that resonates with you</p>
          </div>
          <Link to="/create-room" className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            <Plus size={16} /> Create Room
          </Link>
        </div>

        <div className="mb-6 relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rooms..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((room, i) => (
            <div key={room.id} className="opacity-0 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <RoomCard room={room} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <span className="mb-2 block text-4xl">🔍</span>
            <p>No rooms found matching "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
