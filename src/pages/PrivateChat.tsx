import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { checkToxicity, autoWarnUser } from "@/lib/aiService";
import { isToxic } from "@/lib/mockData";
import { ArrowLeft, Send, Loader2, Flag } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Message {
  id: string;
  request_id: string;
  sender_email: string;
  sender_name: string;
  content: string;
  flagged_toxic: boolean;
  created_at: string;
}

interface ChatRequest {
  id: string;
  from_email: string;
  from_name: string;
  to_email: string;
  to_name: string;
  status: string;
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function PrivateChat() {
  const { id: requestId } = useParams<{ id: string }>();
  const { userEmail, userName } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatRequest, setChatRequest] = useState<ChatRequest | null>(null);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const otherName = chatRequest
    ? chatRequest.from_email === userEmail
      ? chatRequest.to_name
      : chatRequest.from_name
    : "Chat";

  const fetchData = async () => {
    if (!requestId) return;
    const [reqRes, msgRes] = await Promise.all([
      supabase.from("chat_requests").select("*").eq("id", requestId).single(),
      supabase
        .from("private_messages")
        .select("*")
        .eq("request_id", requestId)
        .order("created_at", { ascending: true }),
    ]);
    if (reqRes.data) setChatRequest(reqRes.data as ChatRequest);
    if (msgRes.data) setMessages(msgRes.data as Message[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel(`private_chat_${requestId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "private_messages", filter: `request_id=eq.${requestId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [requestId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim() || !requestId || !userEmail) return;

    // Local toxicity check
    if (isToxic(newMsg)) {
      toast.error("Message blocked for inappropriate content.");
      autoWarnUser(userName || userEmail, "Toxic private message (local filter)");
      return;
    }

    setSending(true);
    // AI toxicity check
    try {
      const result = await checkToxicity(newMsg, userName);
      if (result.is_toxic) {
        toast.error(`AI blocked: ${result.reason}`);
        autoWarnUser(userName || userEmail, `AI flagged private msg: ${result.reason}`);
        setSending(false);
        return;
      }
    } catch (e) {
      console.error("AI check failed:", e);
    }

    const { error } = await supabase.from("private_messages").insert({
      request_id: requestId,
      sender_email: userEmail,
      sender_name: userName || "Anonymous",
      content: newMsg.trim(),
    });

    if (error) {
      toast.error("Failed to send message");
    }
    setNewMsg("");
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-muted-foreground" size={24} />
        </div>
      </div>
    );
  }

  if (!chatRequest || chatRequest.status !== "accepted") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground mb-4">This chat is not available.</p>
          <Link to="/people" className="text-primary hover:underline text-sm">
            ← Back to People
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AnimatedBackground />
      <Toaster />
      <Navbar />

      <div className="container mx-auto flex max-w-2xl flex-1 flex-col px-4 py-4">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <Link
            to="/people"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">{otherName}</h1>
            <p className="text-xs text-muted-foreground">Private conversation</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 rounded-xl glass-card p-4 mb-4" style={{ maxHeight: "calc(100vh - 280px)" }}>
          {messages.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No messages yet. Say hello! 👋
            </p>
          )}
          {messages.map((msg) => {
            const isMe = msg.sender_email === userEmail;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  {!isMe && (
                    <p className="mb-0.5 text-[10px] font-medium opacity-70">
                      {msg.sender_name}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <div className="mt-1 flex items-center gap-1 justify-end">
                    {msg.flagged_toxic && <Flag size={10} className="text-destructive" />}
                    <span className={`text-[10px] ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className="glass-card flex items-center gap-2 rounded-xl p-3">
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!newMsg.trim() || sending}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
