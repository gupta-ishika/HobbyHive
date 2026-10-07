import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import CommunityCard from "../components/CommunityCard";
import Button from "../components/Button";
import Input from "../components/Input";
import MobileBottomNav from "../components/MobileBottomNav";
import EmptyState from "../components/EmptyState";
import { CardSkeleton } from "../components/Skeleton";
import { useToast } from "../components/Toast";
import { useAbortable } from "../hooks/useAbortable";
import { listCommunities, createCommunity, joinCommunity, leaveCommunity } from "../api/communities";

const PAGE_SIZE = 9;

function CreateCommunityModal({ onClose, onCreated }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", description: "", category: "" });
  const [errors, setErrors] = useState({});
  const [creating, setCreating] = useState(false);
  const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (form.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters.";
    if (!form.description.trim()) newErrors.description = "Description is required.";
    if (!form.category.trim()) newErrors.category = "Category is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setCreating(true);
    try {
      const created = await createCommunity({
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
      });
      toast(`Community "${created.name}" created!`);
      onCreated(created);
    } catch (err) {
      setErrors({ form: err?.detail || "Could not create the community." });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Create community">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-surface rounded-2xl border border-border shadow-xl w-full max-w-md p-6 md:p-8">
        <h2 className="font-headline font-black text-xl text-text">Start a community</h2>
        <p className="text-sm text-text/60 mt-1">Create a new space for your passion.</p>
        <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
          {errors.form && (
            <p role="alert" className="text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              {errors.form}
            </p>
          )}
          <Input label="Name" name="name" placeholder="Downtown Kiln Club" value={form.name} onChange={update("name")} error={errors.name} icon="groups" />
          <Input label="Category" name="category" placeholder="Pottery" value={form.category} onChange={update("category")} error={errors.category} icon="label" />
          <div>
            <label htmlFor="community-description" className="block text-sm font-semibold text-text mb-1.5">Description</label>
            <textarea
              id="community-description"
              rows={3}
              placeholder="What is this community about?"
              value={form.description}
              onChange={update("description")}
              className="w-full bg-background border border-border rounded-2xl p-3.5 text-sm text-text placeholder:text-text/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none transition"
            />
            {errors.description && <p className="text-xs text-red-600 mt-1.5">{errors.description}</p>}
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="secondary" className="flex-1" onClick={onClose} disabled={creating}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={creating}>
              {creating ? "Creating…" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Communities() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const runAbortable = useAbortable();
  const [communities, setCommunities] = useState([]);
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [busyIds, setBusyIds] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const searchTimer = useRef(null);

  // Debounce search input -> server-side query.
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(searchTimer.current);
  }, [query]);

  const load = useCallback(async ({ append = false, offset = 0 } = {}) => {
    return runAbortable(async (signal) => {
      if (append) setLoadingMore(true);
      else {
        setLoading(true);
        setLoadError("");
      }
      try {
        const data = await listCommunities({
          category: active === "All" ? undefined : active,
          search: debouncedQuery || undefined,
          limit: PAGE_SIZE,
          offset,
        }, { signal });
        setHasMore(data.length === PAGE_SIZE);
        setCommunities((prev) => (append ? [...prev, ...data] : data));
      } catch (err) {
        if (err?.name === "AbortError") return;
        if (!append) setLoadError(err?.detail || "Could not load communities.");
        else toast(err?.detail || "Could not load more.", "error");
      } finally {
        if (!signal.aborted) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    });
  }, [active, debouncedQuery, toast, runAbortable]);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(() => {
    const seen = new Set();
    for (const c of communities) if (c.category) seen.add(c.category);
    return ["All", ...[...seen].filter((c) => c !== "All").sort()];
  }, [communities]);

  const handleToggleJoin = async (community) => {
    if (busyIds[community.id]) return;
    setBusyIds((p) => ({ ...p, [community.id]: true }));
    try {
      const updated = community.is_member
        ? await leaveCommunity(community.id)
        : await joinCommunity(community.id);
      setCommunities((prev) => prev.map((c) => (c.id === community.id ? updated : c)));
      toast(community.is_member ? `Left ${community.name}.` : `Joined ${updated.name}!`);
    } catch (err) {
      toast(err?.detail || "Could not update membership.", "error");
    } finally {
      setBusyIds((p) => ({ ...p, [community.id]: false }));
    }
  };

  const handleCreated = (created) => {
    setShowCreate(false);
    setCommunities((prev) => [created, ...prev]);
    navigate(`/communities/${created.id}`);
  };

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
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search communities, hobbies..."
            aria-label="Search communities"
            className="w-full bg-white border border-border rounded-full pl-11 pr-4 py-3 text-sm text-text placeholder:text-text/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm"
          />
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              aria-pressed={active === f}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition ${active === f ? "bg-primary text-background border-primary shadow-sm" : "bg-white text-text/70 border-border hover:border-border-strong hover:text-text"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Community Grid */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Loading communities">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : loadError ? (
          <EmptyState
            icon="cloud_off"
            title="Could not load communities"
            description={loadError}
            action={<Button variant="secondary" onClick={() => load()}>Try again</Button>}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map((c) => (
                <CommunityCard
                  key={c.id}
                  title={c.name}
                  hobby={c.category}
                  members={c.members_count}
                  description={c.description}
                  image={c.avatar_url || c.banner_url}
                  joined={c.is_member}
                  joining={!!busyIds[c.id]}
                  onJoin={() => handleToggleJoin(c)}
                  onClick={() => navigate(`/communities/${c.id}`)}
                />
              ))}
            </div>

            {communities.length === 0 && (
              <div className="mt-8">
                <EmptyState icon="search_off" title="No communities found" description={debouncedQuery || active !== "All" ? `No results for "${debouncedQuery}" in ${active}. Try a different search or filter.` : "No communities yet — be the first to start one!"} action={(debouncedQuery || active !== "All") && <Button variant="secondary" onClick={() => { setQuery(""); setActive("All"); }}>Clear filters</Button>} />
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="secondary"
                  size="md"
                  className="px-8"
                  disabled={loadingMore}
                  onClick={() => load({ append: true, offset: communities.length })}
                >
                  {loadingMore ? "Loading…" : "Load more"}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Start a Community */}
        <div className="border-t border-border mt-12 pt-10">
          <div className="max-w-2xl mx-auto text-center bg-surface rounded-2xl border border-dashed border-border p-10">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary mx-auto mb-4">
              <span className="material-symbols-outlined text-2xl">add</span>
            </div>
            <h3 className="font-headline font-bold text-xl text-text">Start a community</h3>
            <p className="text-sm text-text/60 mt-2 max-w-md mx-auto leading-relaxed">Don&apos;t see what you&apos;re looking for? Create a new space for your passion.</p>
            <Button size="md" className="mt-6 px-8" onClick={() => setShowCreate(true)}>
              Create community
            </Button>
          </div>
        </div>
      </div>

      {showCreate && <CreateCommunityModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />}

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
