import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Users, MessageSquarePlus, Search, Loader2, Check, X, Clock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface ChatRequest {
  id: string;
  from_email: string;
  from_name: string;
  to_email: string;
  to_name: string;
  status: string;
  created_at: string;
}

// Get all known users from localStorage credentials
function getAllUsers(): Array<{ name: string; email: string }> {
  const hardcoded = [
    { name: "Tarun Adithya", email: "tarunadithya2006@gmail.com" },
    { name: "Pranav", email: "pranavkrishna2796@gmail.com" },
    { name: "Thapan", email: "thapan23@gmail.com" },
    { name: "Lokesh", email: "lokesh1@gmail.com" },
  ];
  try {
    const stored = localStorage.getItem("echoroom_registered_users");
    const registered: Array<{ name: string; email: string }> = stored ? JSON.parse(stored) : [];
    return [...hardcoded, ...registered];
  } catch {
    return hardcoded;
  }
}

export default function UserDirectory() {
  const { userEmail, userName } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState<ChatRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);

  const allUsers = getAllUsers().filter((u) => u.email !== userEmail);
  const filtered = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const fetchRequests = async () => {
    if (!userEmail) return;
    const { data } = await supabase
      .from("chat_requests")
      .select("*")
      .or(`from_email.eq.${userEmail},to_email.eq.${userEmail}`);
    setRequests((data as ChatRequest[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();

    const channel = supabase
      .channel("chat_requests_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_requests" }, () => {
        fetchRequests();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userEmail]);

  const getRequestStatus = (targetEmail: string): ChatRequest | undefined => {
    return requests.find(
      (r) =>
        (r.from_email === userEmail && r.to_email === targetEmail) ||
        (r.from_email === targetEmail && r.to_email === userEmail)
    );
  };

  const sendRequest = async (target: { name: string; email: string }) => {
    setSending(target.email);
    const { error } = await supabase.from("chat_requests").insert({
      from_email: userEmail!,
      from_name: userName || "Anonymous",
      to_email: target.email,
      to_name: target.name,
    });
    if (error) {
      toast.error("Failed to send request");
    } else {
      toast.success(`Chat request sent to ${target.name}!`);
      fetchRequests();
    }
    setSending(null);
  };

  const handleRequestAction = async (req: ChatRequest, action: "accepted" | "rejected") => {
    await supabase.from("chat_requests").update({ status: action }).eq("id", req.id);
    toast.success(action === "accepted" ? "Request accepted!" : "Request declined.");
    fetchRequests();
  };

  // Pending incoming requests
  const incomingRequests = requests.filter(
    (r) => r.to_email === userEmail && r.status === "pending"
  );

  // Accepted chats (navigate to chat)
  const acceptedChats = requests.filter(
    (r) =>
      r.status === "accepted" &&
      (r.from_email === userEmail || r.to_email === userEmail)
  );

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <Toaster />
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground flex items-center gap-2">
          <Users size={28} /> People & Chats
        </h1>
        <p className="mb-6 text-muted-foreground">
          Find users and send private chat requests, or manage incoming requests.
        </p>

        {/* Incoming Requests */}
        {incomingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock size={18} /> Pending Requests
            </h2>
            <div className="space-y-3">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="glass-card flex items-center justify-between rounded-xl p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">{req.from_name}</p>
                    <p className="text-xs text-muted-foreground">{req.from_email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRequestAction(req, "accepted")}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <Check size={14} /> Accept
                    </button>
                    <button
                      onClick={() => handleRequestAction(req, "rejected")}
                      className="inline-flex items-center gap-1 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      <X size={14} /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Chats */}
        {acceptedChats.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 font-display text-lg font-semibold text-foreground">
              💬 Active Chats
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {acceptedChats.map((chat) => {
                const otherName =
                  chat.from_email === userEmail ? chat.to_name : chat.from_name;
                return (
                  <button
                    key={chat.id}
                    onClick={() => navigate(`/chat/${chat.id}`)}
                    className="glass-card rounded-xl p-4 text-left hover:border-primary/30 transition-colors"
                  >
                    <p className="font-medium text-foreground">{otherName}</p>
                    <p className="text-xs text-muted-foreground">Tap to open chat →</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search & User Directory */}
        <h2 className="mb-3 font-display text-lg font-semibold text-foreground">
          🔍 Find Users
        </h2>
        <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">No users found.</p>
          ) : (
            filtered.map((user) => {
              const existing = getRequestStatus(user.email);
              return (
                <div
                  key={user.email}
                  className="glass-card flex items-center justify-between rounded-xl p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  {existing ? (
                    existing.status === "accepted" ? (
                      <button
                        onClick={() => navigate(`/chat/${existing.id}`)}
                        className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        💬 Open Chat
                      </button>
                    ) : existing.status === "pending" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                        <Clock size={12} /> Pending
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Declined</span>
                    )
                  ) : (
                    <button
                      onClick={() => sendRequest(user)}
                      disabled={sending === user.email}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {sending === user.email ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <MessageSquarePlus size={14} />
                      )}
                      Request Chat
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
