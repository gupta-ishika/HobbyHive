import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import EventCard from "../components/EventCard";
import Card from "../components/Card";
import Button from "../components/Button";
import MobileBottomNav from "../components/MobileBottomNav";
import CreatePost from "../components/CreatePost";
import PostCard, { avatarFor } from "../components/PostCard";
import EmptyState from "../components/EmptyState";
import { PostSkeleton } from "../components/Skeleton";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../components/Toast";
import { usePostActions } from "../hooks/usePostActions";
import { listPosts, createPost } from "../api/posts";
import { listCommunities, joinCommunity } from "../api/communities";
import { listEvents } from "../api/events";
import { timeAgo } from "../utils/time";

const QUICK_ACCESS_FALLBACK = [
  { icon: "photo_camera", label: "Photography" },
  { icon: "restaurant", label: "Cooking" },
  { icon: "sports_esports", label: "Gaming" },
  { icon: "handyman", label: "Woodworking" },
];

export default function Feed() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [posting, setPosting] = useState(false);
  const [composerCommunityId, setComposerCommunityId] = useState(null);
  const [joiningIds, setJoiningIds] = useState({});
  const {
    openComments,
    toggleComments,
    busyLikes,
    busyComments,
    busyDeletes,
    handleLike,
    handleAddComment,
    handleDelete,
  } = usePostActions(posts, setPosts);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [postsData, communitiesData] = await Promise.all([
        listPosts({ limit: 50 }),
        listCommunities({ limit: 50 }),
      ]);
      setPosts(postsData);
      setCommunities(communitiesData);
      const joined = communitiesData.find((c) => c.is_member) || communitiesData[0];
      setComposerCommunityId((prev) => prev || joined?.id || null);
      listEvents({ upcoming_only: true, limit: 3 }).then(setEvents).catch(() => {});
    } catch (err) {
      setLoadError(err?.detail || "Could not load your feed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const communityNameById = useMemo(() => {
    const map = {};
    for (const c of communities) map[c.id] = c.name;
    return map;
  }, [communities]);

  const joinedCommunities = useMemo(() => communities.filter((c) => c.is_member), [communities]);
  const suggestions = useMemo(() => communities.filter((c) => !c.is_member).slice(0, 3), [communities]);
  const quickAccess = user?.hobbies?.length
    ? user.hobbies.slice(0, 4).map((h) => ({ icon: h.icon || "label", label: h.name }))
    : QUICK_ACCESS_FALLBACK;

  const handlePost = async (text) => {
    const content = text.trim();
    if (!content || posting) return;
    if (!composerCommunityId) {
      toast("Join a community first to share a post.", "error");
      return;
    }
    setPosting(true);
    try {
      const created = await createPost({
        title: content.length > 60 ? `${content.slice(0, 60)}…` : content,
        content,
        community_id: composerCommunityId,
      });
      setPosts((prev) => [created, ...prev]);
      toast("Post shared!");
    } catch (err) {
      toast(err?.detail || "Could not share your post.", "error");
    } finally {
      setPosting(false);
    }
  };

  const handleJoinSuggestion = async (community) => {
    if (joiningIds[community.id]) return;
    setJoiningIds((p) => ({ ...p, [community.id]: true }));
    try {
      const updated = await joinCommunity(community.id);
      setCommunities((prev) => prev.map((c) => (c.id === community.id ? updated : c)));
      setComposerCommunityId((prev) => prev || community.id);
      toast(`Joined ${updated.name}!`);
    } catch (err) {
      toast(err?.detail || "Could not join.", "error");
    } finally {
      setJoiningIds((p) => ({ ...p, [community.id]: false }));
    }
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
              {quickAccess.map((it) => (
                <Link key={it.label} to="/communities" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary text-sm text-text/70 hover:text-text transition-colors">
                  <span className="material-symbols-outlined text-xl">{it.icon}</span> {it.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-border my-4" />
            <div>
              <h4 className="font-bold text-sm text-text">My Hive</h4>
              <p className="text-xs font-semibold text-text/40 uppercase tracking-widest mt-4 mb-2">Communities</p>
              <div className="space-y-1">
                {joinedCommunities.length === 0 ? (
                  <p className="text-xs text-text/50 px-2 py-1">You haven&apos;t joined any communities yet.</p>
                ) : (
                  joinedCommunities.slice(0, 4).map((c) => (
                    <Link key={c.id} to={`/communities/${c.id}`} className="flex items-center gap-2.5 text-sm text-text/70 hover:text-primary py-1.5 px-2 -mx-2 rounded-xl hover:bg-secondary transition-colors">
                      <span className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold text-primary shrink-0">{c.name[0]}</span> <span className="truncate">{c.name}</span>
                    </Link>
                  ))
                )}
                <Link to="/communities" className="inline-flex text-xs font-semibold text-primary hover:underline mt-1">
                  View all →
                </Link>
              </div>
              <Link to="/communities" className="flex items-center gap-2 mt-4 text-sm font-medium text-text/60 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">explore</span> Discover more
              </Link>
            </div>
          </Card>
        </aside>

        {/* CENTER: Discover Feed */}
        <main className="space-y-6 min-w-0">
          {/* Composer */}
          <CreatePost
            onPost={handlePost}
            placeholder="What are you working on today? Share your progress..."
            communities={communities}
            communityId={composerCommunityId}
            onCommunityChange={setComposerCommunityId}
            posting={posting}
            disabled={communities.length === 0}
          />

          {loading ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : loadError ? (
            <EmptyState
              icon="cloud_off"
              title="Could not load feed"
              description={loadError}
              action={<Button variant="secondary" onClick={load}>Try again</Button>}
            />
          ) : posts.length === 0 ? (
            <EmptyState
              icon="forum"
              title="No posts yet"
              description="Be the first to share something with your communities."
            />
          ) : (
            posts.map((post) => {
              const authorName = post.author?.name || post.author?.username || "Member";
              return (
                <PostCard
                  key={post.id}
                  author={authorName}
                  avatar={post.author?.avatar_url || avatarFor(authorName)}
                  community={communityNameById[post.community_id] || "Community"}
                  time={timeAgo(post.created_at)}
                  content={post.content}
                  images={post.images}
                  likes={post.likes_count}
                  comments={post.comments_count}
                  liked={post.is_liked}
                  likeLoading={!!busyLikes[post.id]}
                  onLike={() => handleLike(post)}
                  commentsList={post.comments || []}
                  commentsOpen={!!openComments[post.id]}
                  onToggleComments={() => toggleComments(post.id)}
                  onAddComment={(text) => handleAddComment(post, text)}
                  commentPosting={!!busyComments[post.id]}
                  canDelete={post.author_id === user?.id}
                  onDelete={() => handleDelete(post)}
                  deleting={!!busyDeletes[post.id]}
                />
              );
            })
          )}
        </main>

        {/* RIGHT: Nearby Events + Suggestions */}
        <aside className="hidden lg:block space-y-4 self-start sticky top-[4.5rem]">
          <Card padding="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline font-bold text-text text-sm">Nearby events</h3>
              <Link to="/events" className="text-xs font-semibold text-primary hover:underline">
                See all
              </Link>
            </div>
            <div className="space-y-1">
              {events.length === 0 ? (
                <p className="text-xs text-text/50">No upcoming events right now.</p>
              ) : (
                events.map((e) => (
                  <EventCard
                    key={e.id}
                    title={e.title}
                    hobby={communityNameById[e.community_id] || "Community"}
                    dateLabel={new Date(e.starts_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }).toUpperCase()}
                    distance={e.location}
                  />
                ))
              )}
            </div>
            <Link to="/events">
              <Button variant="secondary" size="sm" className="w-full mt-4">
                Explore events
              </Button>
            </Link>
          </Card>

          <Card padding="p-5">
            <h3 className="font-bold text-text mb-1">Suggestions</h3>
            <p className="text-xs text-text/60 mb-4">Communities you may like</p>
            <div className="space-y-3">
              {suggestions.length === 0 ? (
                <p className="text-xs text-text/50">You&apos;ve joined them all — nice!</p>
              ) : (
                suggestions.map((s) => (
                  <div key={s.id} className="flex justify-between items-center gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-text truncate">{s.name}</p>
                      <p className="text-xs text-text/60">{s.members_count} members</p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-full px-4 shrink-0"
                      disabled={!!joiningIds[s.id]}
                      onClick={() => handleJoinSuggestion(s)}
                    >
                      {joiningIds[s.id] ? "Joining…" : "Join"}
                    </Button>
                  </div>
                ))
              )}
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

