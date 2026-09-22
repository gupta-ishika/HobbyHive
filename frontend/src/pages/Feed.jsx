import { useState } from "react";
import AppHeader from "../components/AppHeader";
import EventCard from "../components/EventCard";
import Card from "../components/Card";
import Button from "../components/Button";
import MobileBottomNav from "../components/MobileBottomNav";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import { useAuth } from "../contexts/AuthContext";
import postsSeed from "../data/posts";
import myCommunities from "../data/communities";

const leftEvents = [
  { id: "le1", title: "Photography Walk — Tomorrow", meta: "Tomorrow · 10:00 AM", icon: "photo_camera" },
  { id: "le2", title: "Chess Meetup — Sunday", meta: "Sunday · 4:00 PM", icon: "chess" },
];

const nearbyEvents = [
  { id: "ne1", title: "Downtown Photowalk", hobby: "Photography Group", dateLabel: "OCT 12", distance: "2 miles" },
  { id: "ne2", title: "Sourdough Starter Class", hobby: "Baking Collective", dateLabel: "OCT 15", distance: "Online" },
];

// Posts matching sample image (Arthur / Elena) + seed
const samplePosts = [
  {
    id: "p1",
    author: "Arthur Pendelton",
    community: "Woodworking Beginners",
    time: "2 hours ago",
    avatar: "https://i.pravatar.cc/100?img=12",
    content:
      "Finally finished the joinery on this oak tabletop. The dovetails aren't perfect, but they are tight and I'm proud of the progress. Next step: sanding for hours.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80&auto=format&fit=crop",
    likes: 24,
    comments: 8,
  },
  {
    id: "p2",
    author: "Elena Rostova",
    community: "Urban Sketching",
    time: "5 hours ago",
    avatar: "https://i.pravatar.cc/100?img=26",
    content:
      "Spent the afternoon at the old town square. The light hitting the cathedral was incredible today. Trying out a new set of watercolors.",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80&auto=format&fit=crop",
    likes: 56,
    comments: 12,
  },
];

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([...samplePosts, ...postsSeed.map((p) => ({ ...p, community: p.hobby, time: p.createdAt }))]);

  const handlePost = (text) => {
    const content = text.trim();
    if (!content) return;
    setPosts((prev) => [
      {
        id: Date.now(),
        author: user?.name || "You",
        community: "Photography Circle",
        time: "just now",
        avatar: user?.avatar || "https://i.pravatar.cc/100?img=5",
        content,
        likes: 0,
        comments: 0,
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader variant="app" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_320px] gap-6">
        {/* LEFT: My Hive */}
        <aside className="hidden lg:block space-y-4 self-start sticky top-[4.5rem]">
          <Card padding="p-5">
            <h3 className="font-headline font-bold text-text text-sm">Quick access</h3>
            <div className="mt-3 space-y-1">
              {[
                { icon: "photo_camera", label: "Photography" },
                { icon: "restaurant", label: "Cooking" },
                { icon: "sports_esports", label: "Gaming" },
                { icon: "handyman", label: "Woodworking" },
              ].map((it) => (
                <a key={it.label} href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary text-sm text-text/70 hover:text-text transition-colors">
                  <span className="material-symbols-outlined text-xl">{it.icon}</span> {it.label}
                </a>
              ))}
            </div>
            <div className="border-t border-border my-4" />
            <div>
              <h4 className="font-bold text-sm text-text">My Hive</h4>
              <p className="text-xs font-semibold text-text/40 uppercase tracking-widest mt-4 mb-2">Events</p>
              <div className="space-y-1 mb-4">
                {leftEvents.map((e) => (
                  <a key={e.id} href="#" className="flex gap-2.5 text-sm hover:bg-secondary p-2 -mx-2 rounded-xl transition-colors">
                    <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-primary shrink-0"><span className="material-symbols-outlined text-lg">{e.icon}</span></span>
                    <div className="min-w-0">
                      <p className="font-semibold text-text leading-tight text-sm truncate">{e.title}</p>
                      <p className="text-xs text-text/50">{e.meta}</p>
                    </div>
                  </a>
                ))}
                <a href="#" className="inline-flex text-xs font-semibold text-primary hover:underline mt-1">
                  View all →
                </a>
              </div>
              <p className="text-xs font-semibold text-text/40 uppercase tracking-widest mb-2">Communities</p>
              <div className="space-y-1">
                {myCommunities.slice(0, 4).map((c) => (
                  <a key={c.id} href="#" className="flex items-center gap-2.5 text-sm text-text/70 hover:text-primary py-1.5 px-2 -mx-2 rounded-xl hover:bg-secondary transition-colors">
                    <span className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold text-primary shrink-0">{c.name[0]}</span> <span className="truncate">{c.name}</span>
                  </a>
                ))}
                <a href="#" className="inline-flex text-xs font-semibold text-primary hover:underline mt-1">
                  View all →
                </a>
              </div>
              <a href="#" className="flex items-center gap-2 mt-4 text-sm font-medium text-text/60 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">explore</span> Discover more
              </a>
            </div>
          </Card>
        </aside>

        {/* CENTER: Discover Feed */}
        <main className="space-y-6 min-w-0">
          {/* Composer */}
          <CreatePost onPost={handlePost} placeholder="What are you working on today? Share your progress..." />

          {posts.map((post) => (
            <PostCard
              key={post.id}
              author={post.author}
              avatar={post.avatar}
              community={post.community}
              time={post.time}
              content={post.content}
              image={post.image}
              likes={post.likes}
              comments={post.comments}
            />
          ))}
        </main>

        {/* RIGHT: Nearby Events + Suggestions */}
        <aside className="hidden lg:block space-y-4 self-start sticky top-[4.5rem]">
          <Card padding="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline font-bold text-text text-sm">Nearby events</h3>
              <a href="#" className="text-xs font-semibold text-primary hover:underline">
                See all
              </a>
            </div>
            <div className="space-y-1">
              {nearbyEvents.map((e) => (
                <EventCard key={e.id} title={e.title} hobby={e.hobby} dateLabel={e.dateLabel} distance={e.distance} />
              ))}
            </div>
            <Button variant="secondary" size="sm" className="w-full mt-4">
              Explore events
            </Button>
          </Card>

          <Card padding="p-5">
            <h3 className="font-headline font-bold text-text mb-4">Activity</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm">person_add</span>
                </div>
                <div className="text-sm leading-tight">
                  <p className="text-text">
                    <span className="font-bold">Sarah Jenkins</span> joined the <span className="font-bold">Indoor Gardening community.</span>
                  </p>
                  <p className="text-xs text-text/50">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm">event</span>
                </div>
                <div className="text-sm leading-tight">
                  <p className="text-text">
                    <span className="font-bold">Mark D.</span> is attending <span className="font-bold">Local Pottery Workshop.</span>
                  </p>
                  <p className="text-xs text-text/50">5 hours ago</p>
                </div>
              </div>
            </div>
          </Card>

          <Card padding="p-5">
            <h3 className="font-bold text-text mb-1">Suggestions</h3>
            <p className="text-xs text-text/60 mb-4">Communities you may like</p>
            <div className="space-y-3">
              {[
                { name: "Pottery Circle", members: "42 members", cta: "Join" },
                { name: "Gardening Club", members: "67 members", cta: "Join" },
                { name: "Weekend Hiking", members: "91 members", cta: "Join" },
              ].map((s) => (
                <div key={s.name} className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm text-text">{s.name}</p>
                    <p className="text-xs text-text/60">{s.members}</p>
                  </div>
                  <Button variant="secondary" size="sm" className="rounded-full px-4">
                    {s.cta}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>

      <footer className="border-t border-border mt-8 bg-background">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text/60">
          <span className="font-headline font-bold text-text">HobbyHive</span>
          <span className="text-xs">©2024 HobbyHive. Built for creators.</span>
          <div className="flex gap-4 text-xs">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
            <a href="#" className="hover:text-primary transition-colors">Guidelines</a>
          </div>
        </div>
      </footer>
      <MobileBottomNav />
    </div>
  );
}


