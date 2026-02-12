import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import EmotionBadge from "@/components/EmotionBadge";
import MoodChart from "@/components/MoodChart";
import { mockPosts, mockMoodData, classifyEmotion, getRandomAlias, generateAIReply, isToxic, type Post, type Emotion } from "@/lib/mockData";
import { getAllRooms } from "@/lib/roomsStore";
import { ArrowLeft, Send, BarChart3, MessageCircle } from "lucide-react";

const POSTS_KEY = "echoroom_posts";

function loadPosts(roomId: string): Post[] {
  try {
    const stored = localStorage.getItem(POSTS_KEY);
    const all: Post[] = stored ? JSON.parse(stored) : [];
    const savedForRoom = all.filter((p) => p.roomId === roomId);
    if (savedForRoom.length > 0) return savedForRoom;
    return mockPosts.filter((p) => p.roomId === roomId);
  } catch {
    return mockPosts.filter((p) => p.roomId === roomId);
  }
}

function savePosts(roomId: string, posts: Post[]) {
  try {
    const stored = localStorage.getItem(POSTS_KEY);
    const all: Post[] = stored ? JSON.parse(stored) : [];
    const otherRooms = all.filter((p) => p.roomId !== roomId);
    localStorage.setItem(POSTS_KEY, JSON.stringify([...otherRooms, ...posts]));
  } catch {}
}

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  const room = getAllRooms().find((r) => r.id === id);
  const [posts, setPosts] = useState<Post[]>(() => loadPosts(id || ""));
  const [newPost, setNewPost] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [toxicWarning, setToxicWarning] = useState("");

  useEffect(() => {
    if (id) savePosts(id, posts);
  }, [posts, id]);

  const moodData = mockMoodData[id || ""] || mockMoodData["default"];

  if (!room) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Room not found.</p>
        </div>
      </div>
    );
  }

  const handlePost = () => {
    if (!newPost.trim()) return;

    if (isToxic(newPost)) {
      setToxicWarning("⚠️ Your message was flagged as potentially harmful. Please rephrase with kindness.");
      return;
    }

    setToxicWarning("");
    const emotion: Emotion = classifyEmotion(newPost);
    const alias = getRandomAlias();
    const newPostObj: Post = {
      id: `p${Date.now()}`,
      roomId: room.id,
      content: newPost.trim(),
      emotion,
      timestamp: new Date().toISOString(),
      anonymous: true,
      authorAlias: alias,
      replies: [
        {
          id: `r${Date.now()}`,
          content: generateAIReply(emotion),
          authorAlias: "EchoBot",
          timestamp: new Date().toISOString(),
          isAI: true,
          flaggedToxic: false,
        },
      ],
      flaggedNoReply: false,
      flaggedToxic: false,
    };
    setPosts([newPostObj, ...posts]);
    setNewPost("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <Link to="/rooms" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} /> Back to Rooms
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{room.emoji}</span>
            <h1 className="font-display text-3xl font-bold text-foreground">{room.name}</h1>
          </div>
          <p className="text-muted-foreground">{room.description}</p>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setShowChart(!showChart)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${showChart ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              <BarChart3 size={14} /> Mood Trends
            </button>
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <MessageCircle size={14} /> {posts.length} posts
            </span>
          </div>
        </div>

        {/* Mood Chart */}
        {showChart && (
          <div className="mb-8 glass-card rounded-xl p-5 animate-fade-in">
            <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Weekly Mood Trends</h3>
            <MoodChart data={moodData} />
          </div>
        )}

        {/* New Post */}
        <div className="mb-8 glass-card rounded-xl p-5">
          <h3 className="mb-3 font-display text-base font-semibold text-foreground">Share Anonymously</h3>
          <textarea
            value={newPost}
            onChange={(e) => { setNewPost(e.target.value); setToxicWarning(""); }}
            placeholder="What's on your mind? You'll be given a random alias..."
            rows={3}
            className="mb-3 w-full resize-none rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {newPost.trim() && (
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              Detected emotion: <EmotionBadge emotion={classifyEmotion(newPost)} />
            </div>
          )}
          {toxicWarning && (
            <div className="mb-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{toxicWarning}</div>
          )}
          <button
            onClick={handlePost}
            disabled={!newPost.trim()}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
          >
            <Send size={14} /> Post
          </button>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post, i) => (
            <div key={post.id} className="opacity-0 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <PostCard post={post} />
            </div>
          ))}
          {posts.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              <span className="mb-2 block text-4xl">🌿</span>
              <p>No posts yet. Be the first to share.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
