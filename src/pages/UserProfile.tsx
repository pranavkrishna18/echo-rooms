import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { type Post } from "@/lib/mockData";
import { getAllRooms } from "@/lib/roomsStore";
import { User, MessageCircle, Heart, Calendar } from "lucide-react";
import RoomCard from "@/components/RoomCard";

function getStoredPosts(): Post[] {
  try {
    const stored = localStorage.getItem("echoroom_posts");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function UserProfile() {
  const { userEmail, userName, userProfile } = useAuth();
  const allRooms = getAllRooms();
  const storedPosts = getStoredPosts();
  const userPostCount = storedPosts.length;
  const repliesCount = storedPosts.reduce((acc, p) => acc + p.replies.filter(r => !r.isAI).length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-10">
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
