import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import CommunityCard from "../components/CommunityCard";
import communities from "../data/communities";
import Button from "../components/Button";
import MobileBottomNav from "../components/MobileBottomNav";

const filters = ["All", "Photography", "Cooking", "Gaming", "Pottery", "Woodworking", "Gardening", "Painting", "Music", "Cycling"];

export default function Communities() {
  const navigate = useNavigate();
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);

  const filtered = communities.filter((c) => {
    const matchFilter = active === "All" || c.hobby === active;
    const matchQuery = !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.hobby.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchQuery;
  });

  const visible = filtered.slice(0, visibleCount);
  const canLoadMore = visibleCount < filtered.length;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader variant="app" />

      {/* Page Header per wireframe + prompt */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-2">
        <p className="text-sm font-bold tracking-widest text-primary uppercase">Communities</p>
        <h1 className="font-headline font-black text-3xl md:text-4xl text-text tracking-tight mt-1">Find your community</h1>
        <p className="text-text/70 mt-2 max-w-2xl">Discover people who enjoy the same things you do, in a supportive and creative space.</p>

        <div className="mt-6 max-w-xl relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text/40">search</span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleCount(9);
            }}
            placeholder="Search communities, hobbies..."
            className="w-full bg-background border-2 border-accent rounded-full pl-11 pr-4 py-3 text-sm text-text placeholder:text-text/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => {
                setActive(f);
                setVisibleCount(9);
              }}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-bold border-2 transition ${active === f ? "bg-primary text-background border-primary" : "bg-secondary text-text border-accent hover:bg-accent"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Community Grid 3x4 per wireframe */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((c) => (
            <CommunityCard
              key={c.id}
              title={c.name}
              hobby={c.hobby}
              members={c.members}
              description={c.description}
              image={c.image}
              icon={c.icon}
              onClick={() => navigate(`/communities/${c.id}`)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text/60">No communities found for &quot;{query}&quot; in {active}.</p>
          </div>
        )}

        {canLoadMore && (
          <div className="flex justify-center mt-8">
            <Button variant="secondary" size="md" className="rounded-full px-8" onClick={() => setVisibleCount((v) => Math.min(v + 6, filtered.length))}>
              Load More
            </Button>
          </div>
        )}

        {/* Separate Start a Community section below grid per wireframe */}
        <div className="border-t border-accent/50 mt-12 pt-12">
          <div className="max-w-2xl mx-auto text-center bg-background rounded-2xl border-2 border-dashed border-accent/70 p-10">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-primary mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">add</span>
            </div>
            <h3 className="font-headline font-bold text-2xl text-text">Start a Community</h3>
            <p className="text-sm text-text/60 mt-2 max-w-md mx-auto">Don&apos;t see what you&apos;re looking for? Create a new space for your passion.</p>
            <Button size="md" className="mt-6 rounded-full px-8">
              Create Community
            </Button>
          </div>
        </div>
      </div>

      <footer className="border-t border-accent/30 bg-background mt-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text/60">
          <span className="font-headline font-bold text-text text-lg">Hobby Hub</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary">About</a>
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Support</a>
            <a href="#" className="hover:text-primary">Careers</a>
          </div>
          <span>© 2024 Hobby Hub. Built for creators.</span>
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
}
