import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MoodChart from "@/components/MoodChart";
import AnimatedBackground from "@/components/AnimatedBackground";
import AdminChatbot from "@/components/AdminChatbot";
import EmotionBadge from "@/components/EmotionBadge";
import { mockMoodData, mockPosts, type Post, type Room } from "@/lib/mockData";
import { getAllRooms, deleteRoom, isDefaultRoom } from "@/lib/roomsStore";
import { useAuth } from "@/lib/auth";
import {
  Users, MessageCircle, AlertTriangle, Shield, Flag, Bot,
  Trash2, Eye, ShieldAlert, Lock, Plus, Search, X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const POSTS_KEY = "echoroom_posts";
const WARNINGS_KEY = "echoroom_warnings";

function loadAllPosts(): Post[] {
  try {
    const stored = localStorage.getItem(POSTS_KEY);
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

function saveWarnings(w: Record<string, string[]>) {
  localStorage.setItem(WARNINGS_KEY, JSON.stringify(w));
}

export default function AdminDashboard() {
  const { isAdmin, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>(getAllRooms());
  const [posts, setPosts] = useState<Post[]>(loadAllPosts());
  const [warnings, setWarnings] = useState<Record<string, string[]>>(loadWarnings());
  const [activeTab, setActiveTab] = useState<"overview" | "rooms" | "users" | "moderation">("overview");
  const [searchUser, setSearchUser] = useState("");
  const [warnTarget, setWarnTarget] = useState<string | null>(null);
  const [warnReason, setWarnReason] = useState("");
  const warnInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRooms(getAllRooms());
    setPosts(loadAllPosts());
  }, [activeTab]);

  // Access denied for non-admin
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <Lock size={48} className="mb-4 text-muted-foreground" />
          <h1 className="font-display text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="mt-2 text-muted-foreground">Please log in to continue.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <ShieldAlert size={48} className="mb-4 text-destructive" />
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Access Only</h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            You don't have admin privileges. Only authorized administrators can access this dashboard. Contact the admin for assistance.
          </p>
          <button
            onClick={() => navigate("/rooms")}
            className="mt-6 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  const totalPosts = posts.length;
  const flaggedPosts = posts.filter((p) => p.flaggedNoReply).length;
  const toxicPosts = posts.filter((p) => p.flaggedToxic).length;
  const aiReplies = posts.reduce((acc, p) => acc + p.replies.filter((r) => r.isAI).length, 0);

  // Unique users from posts and replies
  const userMap = new Map<string, { email: string; alias: string; postCount: number; replyCount: number; toxicCount: number }>();
  posts.forEach((p) => {
    const key = p.userEmail || p.authorAlias;
    const existing = userMap.get(key) || { email: p.userEmail || "N/A", alias: p.authorAlias, postCount: 0, replyCount: 0, toxicCount: 0 };
    existing.postCount++;
    if (p.flaggedToxic) existing.toxicCount++;
    userMap.set(key, existing);

    // Count replies per unique reply author
    p.replies.forEach((r) => {
      if (r.isAI) return;
      const replyKey = r.authorAlias;
      const replyUser = userMap.get(replyKey) || { email: "N/A", alias: r.authorAlias, postCount: 0, replyCount: 0, toxicCount: 0 };
      replyUser.replyCount++;
      userMap.set(replyKey, replyUser);
    });
  });
  const allUsers = Array.from(userMap.entries())
    .map(([key, data]) => ({ key, ...data }))
    .filter((u) => u.key.toLowerCase().includes(searchUser.toLowerCase()) || u.alias.toLowerCase().includes(searchUser.toLowerCase()));

  const handleDeleteRoom = (roomId: string) => {
    if (confirm("Are you sure you want to delete this room and all its posts?")) {
      deleteRoom(roomId);
      setRooms(getAllRooms());
      setPosts(loadAllPosts());
    }
  };

  const handleWarnUser = (userKey: string) => {
    setWarnTarget(userKey);
    setWarnReason("");
    setTimeout(() => warnInputRef.current?.focus(), 100);
  };

  const submitWarning = () => {
    if (!warnTarget || !warnReason.trim()) return;
    const updated = { ...warnings };
    if (!updated[warnTarget]) updated[warnTarget] = [];
    updated[warnTarget].push(`${new Date().toLocaleDateString()}: ${warnReason.trim()}`);
    setWarnings(updated);
    saveWarnings(updated);
    toast.success(`Warning sent to ${warnTarget}`, {
      style: { background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "12px" },
      iconTheme: { primary: "#22C55E", secondary: "#fff" },
    });
    setWarnTarget(null);
    setWarnReason("");
  };

  const handleDeletePost = (postId: string) => {
    if (confirm("Delete this post?")) {
      try {
        const stored = localStorage.getItem(POSTS_KEY);
        if (stored) {
          const all = JSON.parse(stored).filter((p: Post) => p.id !== postId);
          localStorage.setItem(POSTS_KEY, JSON.stringify(all));
          setPosts(all);
        }
      } catch {}
    }
  };

  const stats = [
    { label: "Total Rooms", value: rooms.length, icon: Users, color: "text-primary" },
    { label: "Total Posts", value: totalPosts, icon: MessageCircle, color: "text-primary" },
    { label: "Flagged (No Reply)", value: flaggedPosts, icon: AlertTriangle, color: "text-accent" },
    { label: "Toxic Flagged", value: toxicPosts, icon: Flag, color: "text-destructive" },
    { label: "AI Replies", value: aiReplies, icon: Bot, color: "text-primary" },
    { label: "Active Users", value: userMap.size, icon: Shield, color: "text-primary" },
  ];

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "rooms" as const, label: "Rooms" },
    { id: "users" as const, label: "Users" },
    { id: "moderation" as const, label: "Moderation" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <Toaster />
      <Navbar />

      {/* Warn Modal */}
      {warnTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert size={20} className="text-accent" />
              <h3 className="font-display text-lg font-bold text-foreground">Warn User</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Sending warning to <span className="font-semibold text-foreground">{warnTarget}</span>
            </p>
            <input
              ref={warnInputRef}
              type="text"
              value={warnReason}
              onChange={(e) => setWarnReason(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitWarning()}
              placeholder="Enter warning reason..."
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setWarnTarget(null); setWarnReason(""); }}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitWarning}
                disabled={!warnReason.trim()}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                Send Warning
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Admin <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="mt-1 text-muted-foreground">Monitor community health, manage rooms & moderate content</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-1 rounded-xl bg-muted p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat, i) => (
                <div key={i} className="glass-card rounded-xl p-5 opacity-0 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="mt-1 text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <stat.icon size={28} className={stat.color} />
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-xl p-6">
              <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Platform-Wide Mood Trends</h2>
              <MoodChart data={mockMoodData["default"]} />
            </div>
          </>
        )}

        {/* Rooms Tab */}
        {activeTab === "rooms" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-foreground">Manage Rooms ({rooms.length})</h2>
              <button
                onClick={() => navigate("/create-room")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus size={14} /> Add Room
              </button>
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Room</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Members</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Posts</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Top Emotion</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => {
                    const roomPosts = posts.filter((p) => p.roomId === room.id).length;
                    return (
                      <tr key={room.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 font-medium text-foreground">
                          {room.emoji} {room.name}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{room.memberCount}</td>
                        <td className="px-4 py-3 text-muted-foreground">{roomPosts || room.postCount}</td>
                        <td className="px-4 py-3"><EmotionBadge emotion={room.topEmotion} /></td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            isDefaultRoom(room.id) ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                          }`}>
                            {isDefaultRoom(room.id) ? "Default" : "Custom"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/room/${room.id}`)}
                              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                              title="View Room"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                              title="Delete Room"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-foreground">User Activity ({userMap.size} users)</h2>
            </div>
            <div className="mb-4 relative max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Search users..."
                className="h-9 w-full rounded-lg border border-input bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-3">
              {allUsers.map((user) => (
                <div key={user.key} className="glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.alias}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                        <span>{user.postCount} posts</span>
                        <span>{user.replyCount} replies</span>
                        {user.toxicCount > 0 && (
                          <span className="text-destructive">{user.toxicCount} toxic flags</span>
                        )}
                      </div>
                      {warnings[user.key] && (
                        <div className="mt-2 space-y-1">
                          {warnings[user.key].map((w, i) => (
                            <p key={i} className="text-xs text-accent">⚠️ {w}</p>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleWarnUser(user.key)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 transition-colors"
                    >
                      <ShieldAlert size={12} /> Warn
                    </button>
                  </div>
                </div>
              ))}
              {allUsers.length === 0 && (
                <p className="py-8 text-center text-muted-foreground">No users found.</p>
              )}
            </div>
          </div>
        )}

        {/* Moderation Tab */}
        {activeTab === "moderation" && (
          <div>
            <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Content Moderation</h2>

            {/* Toxic Posts */}
            <div className="mb-8">
              <h3 className="mb-3 text-sm font-semibold text-destructive flex items-center gap-1.5">
                <Flag size={14} /> Toxic Flagged Posts ({posts.filter(p => p.flaggedToxic).length})
              </h3>
              <div className="space-y-3">
                {posts.filter((p) => p.flaggedToxic).map((post) => (
                  <div key={post.id} className="glass-card rounded-xl p-4 border-destructive/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{post.authorAlias}</span>
                        <EmotionBadge emotion={post.emotion} />
                        <span className="text-xs text-muted-foreground">in Room {post.roomId}</span>
                      </div>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="rounded-lg p-1.5 text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete post"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-sm text-foreground">{post.content}</p>
                  </div>
                ))}
                {posts.filter(p => p.flaggedToxic).length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">No toxic posts detected 🌿</p>
                )}
              </div>
            </div>

            {/* No Reply Posts */}
            <div className="mb-8">
              <h3 className="mb-3 text-sm font-semibold text-accent flex items-center gap-1.5">
                <AlertTriangle size={14} /> Unanswered Posts ({posts.filter(p => p.flaggedNoReply).length})
              </h3>
              <div className="space-y-3">
                {posts.filter((p) => p.flaggedNoReply).map((post) => (
                  <div key={post.id} className="glass-card rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{post.authorAlias}</span>
                        <EmotionBadge emotion={post.emotion} />
                        <span className="text-xs text-muted-foreground">in Room {post.roomId}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/room/${post.roomId}`)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="Go to room"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="rounded-lg p-1.5 text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete post"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-foreground">{post.content}</p>
                  </div>
                ))}
                {posts.filter(p => p.flaggedNoReply).length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">All posts have replies! 🎉</p>
                )}
              </div>
            </div>

            {/* All Posts with delete */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-1.5">
                <MessageCircle size={14} /> All Posts ({posts.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {posts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-foreground">{post.authorAlias}</span>
                        <EmotionBadge emotion={post.emotion} />
                        {post.flaggedToxic && <Flag size={10} className="text-destructive" />}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{post.content}</p>
                    </div>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="ml-2 shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {posts.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">No posts in the system yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin AI Chatbot */}
      <AdminChatbot
        communityContext={`Total Rooms: ${rooms.length}. Total Posts: ${totalPosts}. Flagged (No Reply): ${flaggedPosts}. Toxic Flagged: ${toxicPosts}. AI Replies: ${aiReplies}. Active Users: ${userMap.size}. Room names: ${rooms.map(r => r.name).join(", ")}. Users with warnings: ${Object.keys(warnings).join(", ") || "None"}.`}
      />
    </div>
  );
}
