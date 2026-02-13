import { Link } from "react-router-dom";
import { Room } from "@/lib/mockData";
import EmotionBadge from "./EmotionBadge";
import { Users, MessageCircle, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { hasJoinedRoom, joinRoom, leaveRoom } from "@/lib/roomsStore";
import { useState } from "react";

export default function RoomCard({ room }: { room: Room }) {
  const { isLoggedIn, userEmail } = useAuth();
  const [joined, setJoined] = useState(() =>
    isLoggedIn && userEmail ? hasJoinedRoom(userEmail, room.id) : false
  );

  const handleJoinToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userEmail) return;
    if (joined) {
      leaveRoom(userEmail, room.id);
      setJoined(false);
    } else {
      joinRoom(userEmail, room.id);
      setJoined(true);
    }
  };

  return (
    <Link to={`/room/${room.id}`} className="group block">
      <div className="glass-card rounded-xl p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
        <div className="mb-3 flex items-start justify-between">
          <span className="text-3xl">{room.emoji}</span>
          <EmotionBadge emotion={room.topEmotion} />
        </div>
        <h3 className="mb-1 font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {room.name}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{room.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Users size={14} /> {room.memberCount}</span>
            <span className="inline-flex items-center gap-1"><MessageCircle size={14} /> {room.postCount} posts</span>
          </div>
          {isLoggedIn && (
            <button
              onClick={handleJoinToggle}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                joined
                  ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              {joined ? <><LogOut size={12} /> Leave</> : <><LogIn size={12} /> Join</>}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
