import { Link } from "react-router-dom";
import { Room, CATEGORY_ICONS } from "@/lib/mockData";
import EmotionBadge from "./EmotionBadge";
import { Users, MessageCircle, LogIn, LogOut, ArrowRight } from "lucide-react";
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
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 hover:border-primary/25">
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 transition-all duration-500 group-hover:from-primary/5 group-hover:to-accent/5" />

        <div className="relative">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-2xl shadow-sm">
              {room.emoji}
            </div>
            <EmotionBadge emotion={room.topEmotion} />
          </div>

          <h3 className="mb-1.5 font-display text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
            {room.name}
          </h3>
          <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {room.description}
          </p>

          {/* Category tag */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
              {CATEGORY_ICONS[room.category]} {room.category}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted/60 px-2.5 py-1">
                <Users size={12} /> {room.memberCount}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted/60 px-2.5 py-1">
                <MessageCircle size={12} /> {room.postCount}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isLoggedIn && (
                <button
                  onClick={handleJoinToggle}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    joined
                      ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  }`}
                >
                  {joined ? <><LogOut size={12} /> Leave</> : <><LogIn size={12} /> Join</>}
                </button>
              )}
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1">
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
