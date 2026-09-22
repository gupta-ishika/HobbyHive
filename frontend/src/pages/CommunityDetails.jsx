import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import communities from "../data/communities";
import AppHeader from "../components/AppHeader";
import Button from "../components/Button";
import Badge from "../components/Badge";
import MobileBottomNav from "../components/MobileBottomNav";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

export default function CommunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const community = communities.find((c) => String(c.id) === String(id)) || communities[0];
  const [joined, setJoined] = useState(false);
  const [activeTab, setActiveTab] = useState("Posts");
  const [communityPosts, setCommunityPosts] = useState([
    {
      id: "cdp1",
      author: "Sarah Jenkins",
      avatar: "https://i.pravatar.cc/100?img=32",
      time: "2 hours ago",
      content:
        "Finally finished glazing this batch of mugs! I experimented with a new speckled blue glaze layered over a matte white base. What do you guys think? I'm firing them tomorrow.",
      image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80&auto=format&fit=crop",
      likes: 24,
      comments: 5,
    },
  ]);

  const handleCreatePost = (text) => {
    if (!text || !joined) return;
    setCommunityPosts((prev) => [
      {
        id: Date.now(),
        author: "You",
        avatar: "https://i.pravatar.cc/100?img=5",
        time: "just now",
        content: text,
        likes: 0,
        comments: 0,
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader variant="app" />

      {/* Mobile top bar */}
      <div className="md:hidden flex justify-between items-center px-4 py-3 bg-surface border-b border-border sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center text-text/60 transition" aria-label="Go back">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="font-headline font-bold text-sm text-text truncate max-w-[200px]">{community.name}</span>
        <button className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center text-text/60 transition" aria-label="More options">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>

      {/* Community Header */}
      <main className="max-w-5xl mx-auto md:px-6 px-4 py-6 flex flex-col gap-6">
        <div className="bg-surface rounded-2xl border border-border p-4 md:p-6 shadow-sm">
          <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden relative bg-secondary">
            <img src={community.image} alt={community.name} className="w-full h-full object-cover" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-5">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="accent" icon={community.icon}>
                  {community.hobby}
                </Badge>
                <span className="text-xs font-medium text-text/50 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">group</span> {community.members} members
                </span>
              </div>
              <h1 className="font-headline font-black text-2xl md:text-3xl text-text tracking-tight">{community.name}</h1>
              <p className="text-sm text-text/60 max-w-2xl leading-relaxed">{community.description}</p>
            </div>

            <Button
              variant={joined ? "secondary" : "primary"}
              size="md"
              className="w-full md:w-auto"
              onClick={() => setJoined(!joined)}
            >
              <span className="material-symbols-outlined text-lg">{joined ? "check" : "add"}</span>
              {joined ? "Joined" : "Join community"}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border gap-6 overflow-x-auto scrollbar-none">
          {["Posts", "Members", "Events", "Resources"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              aria-selected={activeTab === tab}
              role="tab"
              className={`pb-3 px-1 whitespace-nowrap font-semibold text-sm border-b-2 transition relative -mb-px ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-text/60 hover:text-text hover:border-border"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {/* Create Post composer - only active if joined */}
            <CreatePost
              variant="compact"
              disabled={!joined}
              placeholder={joined ? "Share your latest creation or ask a question..." : "Join community to post"}
              onPost={handleCreatePost}
            />

            {communityPosts.map((post) => (
              <PostCard
                key={post.id}
                author={post.author}
                avatar={post.avatar}
                time={post.time}
                content={post.content}
                image={post.image}
                likes={post.likes}
                comments={post.comments}
              />
            ))}

            {activeTab !== "Posts" && (
              <div className="bg-surface rounded-2xl border border-dashed border-border p-12 text-center">
                <p className="font-semibold text-text">{activeTab} coming soon</p>
                <p className="text-sm text-text/60 mt-1">Content for {activeTab} will appear here.</p>
              </div>
            )}
          </div>

          {/* Sidebar - Upcoming Events + Rules */}
          <div className="hidden md:flex flex-col gap-4">
            <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
              <h3 className="font-headline font-bold text-text text-sm mb-4">Upcoming events</h3>
              <div className="flex gap-3 items-start">
                <div className="w-12 h-14 rounded-xl bg-accent/60 border border-border flex flex-col items-center justify-center shrink-0">
                  <span className="text-[11px] font-semibold text-text/60 uppercase tracking-wide">Oct</span>
                  <span className="font-headline font-bold text-lg leading-none text-text">12</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm text-text leading-tight">Beginner Wheel Throwing</h4>
                  <p className="text-xs text-text/50 mt-1">Community Studio • 6:00 PM</p>
                </div>
              </div>
              <Link to="/events" className="block text-center mt-4 text-xs font-semibold text-primary hover:underline">
                View all events →
              </Link>
            </div>

            <div className="bg-secondary/30 p-4 rounded-2xl border border-border">
              <h4 className="font-semibold text-sm text-text flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">info</span> Community guidelines
              </h4>
              <ul className="text-xs text-text/60 mt-2.5 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>Be kind and supportive</li>
                <li>Share only relevant content</li>
                <li>No spam or self-promotion</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
