import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { mockPosts, type Post } from "@/lib/mockData";
import { getAllRooms } from "@/lib/roomsStore";
import { User, MessageCircle, Heart, Calendar, AlertTriangle, X } from "lucide-react";
import RoomCard from "@/components/RoomCard";

const WARNINGS_KEY = "echoroom_warnings";

function getStoredPosts(): Post[] {
  try {
    const stored = localStorage.getItem("echoroom_posts");
    const savedPosts: Post[] = stored ? JSON.parse(stored) : [];
    const savedRoomIds = new Set(savedPosts.map((p) => p.roomId));
    const unsavedMockPosts = mockPosts.filter((p) => !savedRoomIds.has(p.roomId));
    return [...savedPosts, ...unsavedMockPosts];
  } catch {
    return [];
  }
}

function loadWarnings(): Record<string, string[]> {
  try {
    const stored = localStorage.getItem(WARNINGS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export default function UserProfile() {
  const { userEmail, userName, userProfile, isAdmin } = useAuth();
  const allRooms = getAllRooms();
  const allPosts = getStoredPosts();

  // Count posts authored by this user
  const userPosts = allPosts.filter(p => p.userEmail === userEmail || p.authorAlias === userName);
  const userPostCount = userPosts.length;

  // Count replies given BY this user across ALL posts
  const repliesCount = allPosts.reduce((acc, p) => {
    return acc + p.replies.filter(r => !r.isAI && r.authorAlias === userName).length;
  }, 0);

  // Warnings for this user
  const warnings = loadWarnings();
  const userKey = userEmail || userName || "";
  const myWarnings = warnings[userKey] || warnings[userName || ""] || [];
  const [showWarnings, setShowWarnings] = useState(myWarnings.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-10">
        {/* Floating Warning Card */}
        {!isAdmin && myWarnings.length > 0 && showWarnings && (
          <div className="fixed bottom-6 right-6 z-50 w-80 animate-fade-in rounded-xl border border-destructive/30 bg-background p-4 shadow-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle size={18} />
                <span className="text-sm font-semibold">Admin Warning{myWarnings.length > 1 ? "s" : ""}</span>
              </div>
              <button onClick={() => setShowWarnings(false)} className="rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {myWarnings.map((w, i) => (
                <p key={i} className="text-xs text-muted-foreground">⚠️ {w}</p>
              ))}
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User size={36} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">{userName ?? "User"}</h1>
              <p className="text-sm text-muted-foreground">{userEmail}</p>
              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MessageCircle size={14} /> {userPostCount} posts</span>
                <span className="inline-flex items-center gap-1"><Heart size={14} /> {allRooms.length} rooms</span>
                <span className="inline-flex items-center gap-1"><Calendar size={14} /> Joined {userProfile?.joined ?? "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: "Posts Shared", value: userPostCount, icon: "📝" },
            { label: "Rooms Available", value: allRooms.length, icon: "🏠" },
            { label: "Replies Given", value: repliesCount, icon: "💬" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-5 text-center">
              <span className="mb-1 block text-2xl">{stat.icon}</span>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Joined Rooms */}
        <h2 className="mb-4 font-display text-xl font-bold text-foreground">Your Rooms</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {allRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
}
