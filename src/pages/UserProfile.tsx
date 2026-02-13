import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useAuth } from "@/lib/auth";
import { mockPosts, type Post } from "@/lib/mockData";
import { getAllRooms } from "@/lib/roomsStore";
import { User, MessageCircle, Heart, Calendar } from "lucide-react";
import RoomCard from "@/components/RoomCard";
import toast, { Toaster } from "react-hot-toast";

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

  const userPosts = allPosts.filter(p => p.userEmail === userEmail || p.authorAlias === userName);
  const userPostCount = userPosts.length;

  const repliesCount = allPosts.reduce((acc, p) => {
    return acc + p.replies.filter(r => !r.isAI && r.authorAlias === userName).length;
  }, 0);

  const warnings = loadWarnings();
  const userKey = userEmail || userName || "";
  const myWarnings = warnings[userKey] || warnings[userName || ""] || [];

  useEffect(() => {
    if (!isAdmin && myWarnings.length > 0) {
      myWarnings.forEach((w, i) => {
        setTimeout(() => {
          toast((t) => (
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5">⚠️</span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-destructive">Admin Warning</p>
                <p className="text-sm text-muted-foreground mt-1">{w}</p>
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-muted-foreground hover:text-foreground text-lg leading-none"
              >
                ×
              </button>
            </div>
          ), {
            duration: 8000,
            position: "top-right",
            style: {
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--destructive) / 0.2)",
              borderLeft: "4px solid hsl(var(--destructive))",
              padding: "16px",
              maxWidth: "400px",
              borderRadius: "16px",
              boxShadow: "0 10px 25px -5px hsl(var(--destructive) / 0.15)",
            },
          });
        }, i * 600);
      });
    }
  }, [isAdmin, myWarnings.length]);

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <Toaster />
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-10">
        {/* Profile Header */}
        <div className="glass-card rounded-3xl p-8 mb-8 shadow-lg shadow-primary/5">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25">
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
            <div key={stat.label} className="glass-card rounded-2xl p-5 text-center shadow-sm">
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
