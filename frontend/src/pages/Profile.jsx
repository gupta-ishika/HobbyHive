import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import Input from "../components/Input";
import MobileBottomNav from "../components/MobileBottomNav";
import EmptyState from "../components/EmptyState";
import PostCard, { avatarFor } from "../components/PostCard";
import { PostSkeleton, Skeleton } from "../components/Skeleton";
import { useAuth } from "../contexts/AuthContext";
import { usePostActions } from "../hooks/usePostActions";
import { fetchMyProfile, fetchProfileById, updateMyProfile } from "../api/users";
import { listPosts } from "../api/posts";
import { timeAgo } from "../utils/time";

function EditProfileModal({ profile, onClose, onSaved }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: profile.name || "",
    username: profile.username || "",
    bio: profile.bio || "",
    avatar_url: profile.avatar_url || "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.username.trim()) newErrors.username = "Username is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const updated = await updateMyProfile({
        name: form.name.trim(),
        username: form.username.trim(),
        bio: form.bio.trim() || null,
        avatar_url: form.avatar_url.trim() || null,
      });
      toast("Profile updated!");
      onSaved(updated);
    } catch (err) {
      if (err?.status === 409) setErrors({ username: "This username is already taken." });
      else setErrors({ form: err?.detail || "Could not update your profile." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Edit profile">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-surface rounded-2xl border border-border shadow-xl w-full max-w-md p-6 md:p-8">
        <h2 className="font-headline font-black text-xl text-text">Edit profile</h2>
        <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
          {errors.form && (
            <p role="alert" className="text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              {errors.form}
            </p>
          )}
          <Input label="Full name" name="name" value={form.name} onChange={update("name")} error={errors.name} icon="person" />
          <Input label="Username" name="username" value={form.username} onChange={update("username")} error={errors.username} icon="alternate_email" />
          <Input label="Avatar URL" name="avatar_url" placeholder="https://…" value={form.avatar_url} onChange={update("avatar_url")} icon="image" />
          <div>
            <label htmlFor="profile-bio" className="block text-sm font-semibold text-text mb-1.5">Bio</label>
            <textarea
              id="profile-bio"
              rows={3}
              placeholder="Tell people what you're into…"
              value={form.bio}
              onChange={update("bio")}
              className="w-full bg-background border border-border rounded-2xl p-3.5 text-sm text-text placeholder:text-text/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none transition"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="secondary" className="flex-1" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: me, logout, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  const isOwn = !id || (me && String(me.id) === String(id));

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
    setNotFound(false);
    setLoadError("");
    try {
      const data = id && (!me || String(me.id) !== String(id))
        ? await fetchProfileById(id)
        : await fetchMyProfile();
      setProfile(data);
      setPosts(await listPosts({ author_id: data.id, limit: 30 }).catch(() => []));
    } catch (err) {
      if (err?.status === 404) setNotFound(true);
      else setLoadError(err?.detail || "Could not load this profile.");
    } finally {
      setLoading(false);
    }
  }, [id, me]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaved = async (updated) => {
    setShowEdit(false);
    setProfile((prev) => ({ ...prev, ...updated }));
    await refreshUser().catch(() => {});
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader variant="app" />
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-6">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <PostSkeleton />
        </div>
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
            icon="person_off"
            title="Profile not found"
            description="This user does not exist."
            action={<Button variant="secondary" onClick={() => navigate("/feed")}>Back to feed</Button>}
          />
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  if (loadError || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader variant="app" />
        <div className="max-w-5xl mx-auto px-4 py-16">
          <EmptyState
            icon="cloud_off"
            title="Could not load profile"
            description={loadError}
            action={<Button variant="secondary" onClick={load}>Try again</Button>}
          />
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  const hobbyNames = (profile.hobbies || []).map((h) => h.name);
  const joinedDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : null;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader variant="app" />
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <Card className="flex flex-col md:flex-row gap-5 md:gap-6 items-start">
          {/* On mobile (< 768px): Avatar & Edit Profile button sit side-by-side at top */}
          <div className="flex justify-between items-center w-full md:w-auto">
            <Avatar size="xl" alt={profile.name} src={profile.avatar_url || avatarFor(profile.name)} status="online" />
            {isOwn && <Button size="sm" className="md:hidden" onClick={() => setShowEdit(true)}>Edit profile</Button>}
          </div>

          {/* User info gets full width on mobile */}
          <div className="flex-1 min-w-0 w-full">
            <h1 className="font-headline font-black text-2xl md:text-3xl text-text tracking-tight">{profile.name}</h1>
            <p className="text-primary font-semibold text-sm">@{profile.username}</p>
            {profile.bio && (
              <p className="text-text/60 mt-3 max-w-xl leading-relaxed text-sm md:text-base">{profile.bio}</p>
            )}
            {hobbyNames.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {hobbyNames.map((h) => (
                  <Badge key={h} variant="secondary">{h}</Badge>
                ))}
              </div>
            )}
          </div>

          {/* On desktop (>= 768px): actions sit at top right */}
          {isOwn && (
            <div className="hidden md:flex flex-col gap-2 shrink-0">
              <Button onClick={() => setShowEdit(true)}>Edit profile</Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <span className="material-symbols-outlined text-base">logout</span> Log out
              </Button>
            </div>
          )}
        </Card>
        {isOwn && (
          <div className="md:hidden mt-4">
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <span className="material-symbols-outlined text-base">logout</span> Log out
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card hover><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary"><span className="material-symbols-outlined">palette</span></div><div><h3 className="font-semibold text-text text-sm">Hobbies</h3><p className="text-xs text-text/50 mt-0.5">{hobbyNames.length} interest{hobbyNames.length === 1 ? "" : "s"}</p></div></div><p className="text-sm text-text/60 mt-3 leading-relaxed">{hobbyNames.length > 0 ? hobbyNames.join(", ") : "No interests selected yet."}</p></Card>
          <Card hover><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary"><span className="material-symbols-outlined">groups</span></div><div><h3 className="font-semibold text-text text-sm">Communities</h3><p className="text-xs text-text/50 mt-0.5">{profile.joined_communities_count} joined</p></div></div><p className="text-sm text-text/60 mt-3">{profile.joined_communities_count > 0 ? `Active in ${profile.joined_communities_count} ${profile.joined_communities_count === 1 ? "community" : "communities"}` : "Hasn't joined any communities yet."}</p></Card>
          <Card hover><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary"><span className="material-symbols-outlined">article</span></div><div><h3 className="font-semibold text-text text-sm">Posts</h3><p className="text-xs text-text/50 mt-0.5">{profile.posts_count} post{profile.posts_count === 1 ? "" : "s"}</p></div></div><p className="text-sm text-text/60 mt-3">{posts.length > 0 ? `Last post ${timeAgo(posts[0].created_at)}` : "No posts yet."}</p></Card>
        </div>

        <Card className="mt-6">
          <h3 className="font-semibold text-text">About</h3>
          <p className="text-sm text-text/60 mt-2 leading-relaxed">
            {profile.bio || `${profile.name} hasn't written a bio yet.`}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {joinedDate && (
              <span className="inline-flex items-center gap-1.5 text-xs text-text/60"><span className="material-symbols-outlined text-sm">calendar_today</span> Joined {joinedDate}</span>
            )}
          </div>
        </Card>

        <h2 className="font-headline font-bold text-lg text-text mt-8 mb-4">
          {isOwn ? "Your posts" : `Posts by ${profile.name}`}
        </h2>
        {posts.length === 0 ? (
          <Card className="text-center py-10">
            <p className="font-semibold text-text">No posts yet</p>
            <p className="text-sm text-text/60 mt-1">{isOwn ? "Share your first creation from the feed." : "Nothing shared here so far."}</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                author={profile.name}
                avatar={profile.avatar_url || avatarFor(profile.name)}
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
                canDelete={isOwn}
                onDelete={() => handleDelete(post)}
                deleting={!!busyDeletes[post.id]}
              />
            ))}
          </div>
        )}
      </div>

      {showEdit && isOwn && (
        <EditProfileModal profile={profile} onClose={() => setShowEdit(false)} onSaved={handleSaved} />
      )}
      <MobileBottomNav />
    </div>
  );
}
