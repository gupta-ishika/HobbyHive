import { useCallback, useState } from "react";
import { useToast } from "../components/Toast";
import { toggleLike, addComment, deletePost } from "../api/posts";

// Shared like / comment / delete behavior for post lists (Feed, Community Details).
export function usePostActions(posts, setPosts) {
  const { toast } = useToast();
  const [openComments, setOpenComments] = useState({});
  const [busyLikes, setBusyLikes] = useState({});
  const [busyComments, setBusyComments] = useState({});
  const [busyDeletes, setBusyDeletes] = useState({});

  const patchPost = useCallback(
    (id, patch) => setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p))),
    [setPosts]
  );

  const toggleComments = useCallback(
    (id) => setOpenComments((prev) => ({ ...prev, [id]: !prev[id] })),
    []
  );

  const handleLike = useCallback(
    async (post) => {
      if (busyLikes[post.id]) return;
      setBusyLikes((p) => ({ ...p, [post.id]: true }));
      try {
        const res = await toggleLike(post.id);
        patchPost(post.id, { is_liked: res.is_liked, likes_count: res.likes_count });
      } catch (err) {
        toast(err?.detail || "Could not update like.", "error");
      } finally {
        setBusyLikes((p) => ({ ...p, [post.id]: false }));
      }
    },
    [busyLikes, patchPost, toast]
  );

  const handleAddComment = useCallback(
    async (post, text) => {
      if (busyComments[post.id]) return;
      setBusyComments((p) => ({ ...p, [post.id]: true }));
      try {
        const created = await addComment(post.id, { content: text });
        const current = posts.find((p) => p.id === post.id);
        patchPost(post.id, {
          comments: [...((current || post).comments || []), created],
          comments_count: ((current || post).comments_count || 0) + 1,
        });
      } catch (err) {
        toast(err?.detail || "Could not post your comment.", "error");
      } finally {
        setBusyComments((p) => ({ ...p, [post.id]: false }));
      }
    },
    [busyComments, patchPost, posts, toast]
  );

  const handleDelete = useCallback(
    async (post) => {
      if (busyDeletes[post.id]) return;
      setBusyDeletes((p) => ({ ...p, [post.id]: true }));
      try {
        await deletePost(post.id);
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
        toast("Post deleted.");
      } catch (err) {
        toast(err?.detail || "Could not delete your post.", "error");
      } finally {
        setBusyDeletes((p) => ({ ...p, [post.id]: false }));
      }
    },
    [busyDeletes, setPosts, toast]
  );

  return {
    openComments,
    toggleComments,
    busyLikes,
    busyComments,
    busyDeletes,
    handleLike,
    handleAddComment,
    handleDelete,
  };
}
