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

      {/* Mobile top bar - back + title */}
      <div className="md:hidden flex justify-between items-center px-4 py-3 bg-background border-b border-accent sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="p-1 text-text/60">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="font-headline font-bold text-sm text-text truncate max-w-[200px]">{community.name}</span>
        <button className="p-1 text-text/60">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>

      {/* Community Header */}
      <main className="max-w-5xl mx-auto md:px-6 px-4 py-6 flex flex-col gap-6">
        <div className="bg-background rounded-2xl border-2 border-accent p-4 md:p-6 shadow-sm">
          <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden relative bg-secondary">
            <img src={community.image} alt={community.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="accent" icon={community.icon}>
                  {community.hobby}
                </Badge>
                <span className="text-xs text-text/60 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">group</span> {community.members} Members
                </span>
              </div>
              <h1 className="font-headline font-black text-2xl md:text-3xl text-text">{community.name}</h1>
              <p className="text-sm text-text/70 max-w-2xl leading-relaxed">{community.description}</p>
            </div>

            <Button
              variant={joined ? "secondary" : "primary"}
              size="md"
              className="w-full md:w-auto rounded-lg"
              onClick={() => setJoined(!joined)}
            >
              <span className="material-symbols-outlined text-lg">{joined ? "check" : "add"}</span>
              {joined ? "Joined" : "Join Community"}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-accent gap-6 overflow-x-auto">
          {["Posts", "Members", "Events", "Resources"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 whitespace-nowrap font-bold text-sm border-b-2 transition ${
                activeTab === tab ? "border-primary text-primary" : "border-transparent text-text/60 hover:text-primary"
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
              <div className="bg-background rounded-xl border-2 border-dashed border-accent p-12 text-center">
                <p className="font-bold text-text">{activeTab} tab</p>
                <p className="text-sm text-text/60 mt-1">Content for {activeTab} will appear here.</p>
              </div>
            )}
          </div>

          {/* Sidebar - Upcoming Events + Rules */}
          <div className="hidden md:flex flex-col gap-4">
            <div className="bg-background p-5 rounded-2xl border-2 border-accent">
              <h3 className="font-headline font-bold text-text mb-4">Upcoming Events</h3>
              <div className="flex gap-3 items-start">
                <div className="bg-secondary rounded-lg p-2 flex flex-col items-center justify-center min-w-[50px] border border-accent">
                  <span className="text-xs font-bold text-text/60 uppercase">OCT</span>
                  <span className="font-headline font-bold text-lg leading-none text-text">12</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text">Beginner Wheel Throwing</h4>
                  <p className="text-xs text-text/60">Community Studio · 6:00 PM</p>
                </div>
              </div>
              <Link to="/events" className="block text-center mt-4 text-sm font-bold text-primary hover:underline">
                View all events →
              </Link>
            </div>

            <div className="bg-secondary/30 p-4 rounded-xl border border-accent">
              <h4 className="font-bold text-sm text-text flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">info</span> Community Guidelines
              </h4>
              <ul className="text-xs text-text/60 mt-2 space-y-1 list-disc list-inside">
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
