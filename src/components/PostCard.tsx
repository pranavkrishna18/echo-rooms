import { useState } from "react";
import { Post, Reply, isToxic } from "@/lib/mockData";
import { checkToxicity, autoWarnUser } from "@/lib/aiService";
import EmotionBadge from "./EmotionBadge";
import { Clock, AlertTriangle, Bot, Flag, Send, MessageCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface PostCardProps {
  post: Post;
  onReply?: (postId: string, reply: Reply) => void;
  currentUserName?: string;
}

export default function PostCard({ post, onReply, currentUserName }: PostCardProps) {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [toxicWarning, setToxicWarning] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim() || !onReply) return;
    if (isToxic(replyText)) {
      setToxicWarning("⚠️ Message flagged as potentially harmful. Please rephrase.");
      autoWarnUser(currentUserName || "Anonymous", "Attempted vulgar reply (local filter)");
      toast.error("Reply blocked for inappropriate content.");
      return;
    }

    setIsChecking(true);
    try {
      const result = await checkToxicity(replyText, currentUserName);
      if (result.is_toxic) {
        setToxicWarning(`⚠️ AI flagged: ${result.reason}. Please rephrase.`);
        autoWarnUser(currentUserName || "Anonymous", `AI flagged reply as ${result.severity}: ${result.reason}`);
        toast.error("Reply blocked by AI moderation.");
        setIsChecking(false);
        return;
      }
    } catch (e) {
      console.error("AI check failed:", e);
    }
    setIsChecking(false);

    setToxicWarning("");
    const reply: Reply = {
      id: `r${Date.now()}`,
      content: replyText.trim(),
      authorAlias: currentUserName || "Anonymous",
      timestamp: new Date().toISOString(),
      isAI: false,
      flaggedToxic: false,
    };
    onReply(post.id, reply);
    setReplyText("");
    setShowReplyInput(false);
  };

  return (
    <div className={`glass-card rounded-2xl p-5 shadow-sm ${post.flaggedToxic ? "border-destructive/30" : ""}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{post.authorAlias}</span>
          <EmotionBadge emotion={post.emotion} />
        </div>
        <div className="flex items-center gap-2">
          {post.flaggedNoReply && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent">
              <AlertTriangle size={12} /> No replies
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} /> {timeAgo(post.timestamp)}
          </span>
        </div>
      </div>

      <p className="mb-4 text-foreground leading-relaxed">{post.content}</p>

      {post.replies.length > 0 && (
        <div className="space-y-3 border-t border-border pt-3">
          {post.replies.map((reply) => (
            <div key={reply.id} className={`rounded-xl p-3 ${reply.isAI ? "bg-primary/5 border border-primary/10" : "bg-secondary/50"}`}>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-medium text-foreground">
                  {reply.authorAlias}
                </span>
                {reply.isAI && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                    <Bot size={10} /> AI
                  </span>
                )}
                <span className="text-xs text-muted-foreground">{timeAgo(reply.timestamp)}</span>
                {reply.flaggedToxic && <Flag size={12} className="text-destructive" />}
              </div>
              <p className="text-sm text-foreground/90">{reply.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reply section */}
      <div className="mt-3 border-t border-border pt-3">
        {!showReplyInput ? (
          <button
            onClick={() => setShowReplyInput(true)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle size={14} /> Reply
          </button>
        ) : (
          <div className="space-y-2">
            <textarea
              value={replyText}
              onChange={(e) => { setReplyText(e.target.value); setToxicWarning(""); }}
              placeholder="Write a reply..."
              rows={2}
              className="w-full resize-none rounded-xl border border-input bg-background/80 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
            {toxicWarning && (
              <div className="rounded-lg bg-destructive/10 px-3 py-1.5 text-xs text-destructive">{toxicWarning}</div>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReply}
                disabled={!replyText.trim() || isChecking}
                className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary/85 px-4 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md disabled:opacity-40"
              >
                {isChecking ? <><Loader2 size={12} className="animate-spin" /> Checking...</> : <><Send size={12} /> Reply</>}
              </button>
              <button
                onClick={() => { setShowReplyInput(false); setReplyText(""); setToxicWarning(""); }}
                className="h-8 rounded-lg px-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
