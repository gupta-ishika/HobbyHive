import { useCallback, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import MobileBottomNav from "../components/MobileBottomNav";
import CreatePost from "../components/CreatePost";
import PostCard, { avatarFor } from "../components/PostCard";
import EmptyState from "../components/EmptyState";
import { PostSkeleton, Skeleton } from "../components/Skeleton";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../components/Toast";
import { usePostActions } from "../hooks/usePostActions";
import { useAbortable } from "../hooks/useAbortable";
import { fetchCommunity, joinCommunity, leaveCommunity } from "../api/communities";
import { listPosts, createPost } from "../api/posts";
import { listEvents } from "../api/events";
import { timeAgo, eventDateLabel } from "../utils/time";

export default function CommunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const runAbortable = useAbortable();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [joining, setJoining] = useState(false);
  const [posting, setPosting] = useState(false);
  const [activeTab, setActiveTab] = useState("Posts");

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
    return runAbortable(async (signal) => {
      setLoading(true);
      setNotFound(false);
      setLoadError("");
      try {
        const detail = await fetchCommunity(id, { signal });
        setCommunity(detail);
        const [postsData, eventsData] = await Promise.all([
          listPosts({ community_id: id, limit: 50 }, { signal }).catch((err) => {
            if (err?.name === "AbortError") throw err;
            return [];
          }),
          listEvents({ community_id: id, upcoming_only: true, limit: 10 }, { signal }).catch((err) => {
            if (err?.name === "AbortError") throw err;
            return [];
          }),
        ]);
        setPosts(postsData);
        setEvents(eventsData);
      } catch (err) {
        if (err?.name === "AbortError") return;
        if (err?.status === 404) setNotFound(true);
        else setLoadError(err?.detail || "Could not load this community.");
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    });
  }, [id, runAbortable]);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggleJoin = async () => {
    if (!community || joining) return;
    setJoining(true);
    try {
      const updated = community.is_member
        ? await leaveCommunity(community.id)
        : await joinCommunity(community.id);
      setCommunity((prev) => ({ ...prev, ...updated }));
      toast(community.is_member ? `Left ${community.name}.` : `Joined ${updated.name}!`);
    } catch (err) {
      toast(err?.detail || "Could not update membership.", "error");
    } finally {
      setJoining(false);
    }
  };

  const handleCreatePost = async (text) => {
    const content = text.trim();
    if (!content || !community?.is_member || posting) return;
    setPosting(true);
    try {
      const created = await createPost({
        title: content.length > 60 ? `${content.slice(0, 60)}…` : content,
        content,
        community_id: community.id,
      });
      setPosts((prev) => [created, ...prev]);
      toast("Post shared!");
    } catch (err) {
      toast(err?.detail || "Could not share your post.", "error");
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader variant="app" />
        <main className="max-w-5xl mx-auto md:px-6 px-4 py-6 flex flex-col gap-6">
          <Skeleton className="w-full h-48 md:h-64 rounded-2xl" />
          <Skeleton className="h-8 w-64" />
          <PostSkeleton />
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader variant="app" />
        <div className="max-w-5xl mx-auto px-4 py-16">
          <EmptyState
            icon="search_off"
            title="Community not found"
            description="This community does not exist or was deleted."
            action={<Button variant="secondary" onClick={() => navigate("/communities")}>Browse communities</Button>}
          />
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  if (loadError || !community) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader variant="app" />
        <div className="max-w-5xl mx-auto px-4 py-16">
          <EmptyState
            icon="cloud_off"
            title="Could not load community"
            description={loadError}
            action={<Button variant="secondary" onClick={load}>Try again</Button>}
          />
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  const joined = community.is_member;

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
            {community.banner_url || community.avatar_url ? (
              <img src={community.banner_url || community.avatar_url} alt={community.name} className="w-full h-full object-cover" loading="eager" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary via-accent to-secondary">
                <span className="material-symbols-outlined text-5xl text-primary/40">groups</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-5">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="accent">
                  {community.category}
                </Badge>
                <span className="text-xs font-medium text-text/50 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">group</span> {community.members_count} members
                </span>
              </div>
              <h1 className="font-headline font-black text-2xl md:text-3xl text-text tracking-tight">{community.name}</h1>
              <p className="text-sm text-text/60 max-w-2xl leading-relaxed">{community.description}</p>
            </div>

            <Button
              variant={joined ? "secondary" : "primary"}
              size="md"
              className="w-full md:w-auto"
              disabled={joining}
              onClick={handleToggleJoin}
            >
              <span className="material-symbols-outlined text-lg">{joined ? "check" : "add"}</span>
              {joining ? "…" : joined ? "Joined" : "Join community"}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border gap-6 overflow-x-auto scrollbar-none">
          {["Posts", "Members", "Events", "About"].map((tab) => (
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
            {activeTab === "Posts" && (
              <>
                <CreatePost
                  variant="compact"
                  disabled={!joined || posting}
                  placeholder={joined ? "Share your latest creation or ask a question..." : "Join community to post"}
                  onPost={handleCreatePost}
                />

                {posts.length === 0 ? (
                  <div className="bg-surface rounded-2xl border border-dashed border-border p-12 text-center">
                    <p className="font-semibold text-text">No posts yet</p>
                    <p className="text-sm text-text/60 mt-1">{joined ? "Start the conversation!" : "Join to start the conversation."}</p>
                  </div>
                ) : (
                  posts.map((post) => {
                    const authorName = post.author?.name || post.author?.username || "Member";
                    return (
                      <PostCard
                        key={post.id}
                        author={authorName}
                        avatar={post.author?.avatar_url || avatarFor(authorName)}
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
              </>
            )}

            {activeTab === "Members" && (
              <div className="bg-surface rounded-2xl border border-border p-5">
                {(community.members || []).length === 0 ? (
                  <p className="text-sm text-text/60 text-center py-6">No members to show.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {community.members.map((m) => (
                      <li key={m.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                        <Avatar src={m.user?.avatar_url || avatarFor(m.user?.name)} alt={m.user?.name || "Member"} size="md" />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm text-text truncate">{m.user?.name || m.user?.username || "Member"}</p>
                          <p className="text-xs text-text/50">@{m.user?.username} · joined {timeAgo(m.joined_at)}</p>
                        </div>
                        {m.role === "admin" && <Badge variant="accent" size="sm">Admin</Badge>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeTab === "Events" && (
              <>
                {events.length === 0 ? (
                  <div className="bg-surface rounded-2xl border border-dashed border-border p-12 text-center">
                    <p className="font-semibold text-text">No events yet</p>
                    <p className="text-sm text-text/60 mt-1">Check back soon or explore all events.</p>
                    <Link to="/events" className="inline-block mt-4 text-sm font-semibold text-primary hover:underline">
                      View all events →
                    </Link>
                  </div>
                ) : (
                  events.map((e) => (
                    <div key={e.id} className="bg-surface rounded-2xl border border-border p-5 flex gap-4 items-start shadow-sm">
                      <div className="w-12 h-14 rounded-xl bg-accent/60 border border-border flex flex-col items-center justify-center shrink-0">
                        <span className="text-[11px] font-semibold text-text/60 uppercase tracking-wide">{eventDateLabel(e.starts_at).split(" ")[0]}</span>
                        <span className="font-headline font-bold text-lg leading-none text-text">{eventDateLabel(e.starts_at).split(" ")[1]}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-sm text-text leading-tight">{e.title}</h4>
                        <p className="text-xs text-text/50 mt-1">{e.location} · {e.going_count + e.interested_count} going</p>
                      </div>
                      <Link to="/events" className="text-xs font-semibold text-primary hover:underline shrink-0 mt-1">
                        Details →
                      </Link>
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === "About" && (
              <div className="bg-surface rounded-2xl border border-border p-5 space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-text">Description</h4>
                  <p className="text-sm text-text/60 mt-1 leading-relaxed">{community.description}</p>
                </div>
                {community.rules && (
                  <div>
                    <h4 className="font-semibold text-sm text-text">Rules</h4>
                    <p className="text-sm text-text/60 mt-1 leading-relaxed whitespace-pre-line">{community.rules}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-4 text-xs text-text/50 pt-1">
                  <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">label</span> {community.category}</span>
                  <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">calendar_today</span> Created {timeAgo(community.created_at)}</span>
                  <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">forum</span> {community.posts_count} posts</span>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Upcoming Events + Rules */}
          <div className="hidden md:flex flex-col gap-4">
            <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
              <h3 className="font-headline font-bold text-text text-sm mb-4">Upcoming events</h3>
              {events.length === 0 ? (
                <p className="text-xs text-text/50">No upcoming events.</p>
              ) : (
                events.slice(0, 2).map((e) => (
                  <div key={e.id} className="flex gap-3 items-start mb-3 last:mb-0">
                    <div className="w-12 h-14 rounded-xl bg-accent/60 border border-border flex flex-col items-center justify-center shrink-0">
                      <span className="text-[11px] font-semibold text-text/60 uppercase tracking-wide">{eventDateLabel(e.starts_at).split(" ")[0]}</span>
                      <span className="font-headline font-bold text-lg leading-none text-text">{eventDateLabel(e.starts_at).split(" ")[1]}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-text leading-tight line-clamp-2">{e.title}</h4>
                      <p className="text-xs text-text/50 mt-1">{e.location}</p>
                    </div>
                  </div>
                ))
              )}
              <Link to="/events" className="block text-center mt-4 text-xs font-semibold text-primary hover:underline">
                View all events →
              </Link>
            </div>

            <div className="bg-secondary/30 p-4 rounded-2xl border border-border">
              <h4 className="font-semibold text-sm text-text flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">info</span> Community guidelines
              </h4>
              {community.rules ? (
                <p className="text-xs text-text/60 mt-2.5 leading-relaxed whitespace-pre-line">{community.rules}</p>
              ) : (
                <ul className="text-xs text-text/60 mt-2.5 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Be kind and supportive</li>
                  <li>Share only relevant content</li>
                  <li>No spam or self-promotion</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
