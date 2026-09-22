import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import CommunityCard from "../components/CommunityCard";
import communities from "../data/communities";
import Button from "../components/Button";
import MobileBottomNav from "../components/MobileBottomNav";
import EmptyState from "../components/EmptyState";

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

      {/* Page Header */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-2">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">Communities</p>
        <h1 className="font-headline font-black text-3xl md:text-4xl text-text tracking-tight mt-1.5">Find your community</h1>
        <p className="text-text/60 mt-2 max-w-2xl leading-relaxed">Discover people who enjoy the same things you do, in a supportive and creative space.</p>

        <div className="mt-6 max-w-xl relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text/40">search</span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleCount(9);
            }}
            placeholder="Search communities, hobbies..."
            aria-label="Search communities"
            className="w-full bg-white border border-border rounded-full pl-11 pr-4 py-3 text-sm text-text placeholder:text-text/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm"
          />
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => {
                setActive(f);
                setVisibleCount(9);
              }}
              aria-pressed={active === f}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition ${active === f ? "bg-primary text-background border-primary shadow-sm" : "bg-white text-text/70 border-border hover:border-border-strong hover:text-text"}`}
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
          <div className="mt-8">
            <EmptyState icon="search_off" title="No communities found" description={`No results for "${query}" in ${active}. Try a different search or filter.`} action={<Button variant="secondary" onClick={() => { setQuery(""); setActive("All"); }}>Clear filters</Button>} />
          </div>
        )}

        {canLoadMore && (
          <div className="flex justify-center mt-8">
            <Button variant="secondary" size="md" className="px-8" onClick={() => setVisibleCount((v) => Math.min(v + 6, filtered.length))}>
              Load more
            </Button>
          </div>
        )}

        {/* Start a Community */}
        <div className="border-t border-border mt-12 pt-10">
          <div className="max-w-2xl mx-auto text-center bg-surface rounded-2xl border border-dashed border-border p-10">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary mx-auto mb-4">
              <span className="material-symbols-outlined text-2xl">add</span>
            </div>
            <h3 className="font-headline font-bold text-xl text-text">Start a community</h3>
            <p className="text-sm text-text/60 mt-2 max-w-md mx-auto leading-relaxed">Don&apos;t see what you&apos;re looking for? Create a new space for your passion.</p>
            <Button size="md" className="mt-6 px-8">
              Create community
            </Button>
          </div>
        </div>
      </div>

      <footer className="border-t border-border bg-background mt-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text/60">
          <span className="font-headline font-bold text-text">HobbyHive</span>
          <div className="flex gap-4 text-xs">
            <a href="#" className="hover:text-primary transition-colors">About</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
            <a href="#" className="hover:text-primary transition-colors">Careers</a>
          </div>
          <span className="text-xs">©2024 HobbyHive. Built for creators.</span>
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
}

