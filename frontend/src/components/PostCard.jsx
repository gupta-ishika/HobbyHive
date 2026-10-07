import { useState } from "react";
import Avatar from "./Avatar";
import Badge from "./Badge";
import { timeAgo } from "../utils/time";

// Stable fallback avatar for users without one.
export function avatarFor(name) {
  return `https://i.pravatar.cc/100?u=${encodeURIComponent(name || "hive")}`;
}

function CommentItem({ comment, depth = 0 }) {
  const authorName = comment.author?.name || comment.author?.username || "Member";
  return (
    <div className={depth > 0 ? "ml-8 mt-2" : "mt-2"}>
      <div className="flex gap-2.5">
        <Avatar src={comment.author?.avatar_url || avatarFor(authorName)} alt={authorName} size="sm" />
        <div className="min-w-0 flex-1 bg-background border border-border rounded-2xl rounded-tl-md px-3.5 py-2.5">
          <p className="text-[13px] font-semibold text-text leading-tight">{authorName}</p>
          <p className="text-sm text-text/80 mt-0.5 break-words">{comment.content}</p>
          <p className="text-[11px] text-text/40 mt-1">{timeAgo(comment.created_at)}</p>
        </div>
      </div>
      {(comment.replies || []).map((r) => (
        <CommentItem key={r.id} comment={r} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function PostCard({
  author,
  avatar,
  community,
  time,
  content,
  image,
  images,
  likes = 0,
  comments = 0,
  // Interactive (backend-backed) props — all optional.
  liked = false,
  likeLoading = false,
  onLike,
  commentsList = null,
  commentsOpen = false,
  onToggleComments,
  onAddComment,
  commentPosting = false,
  canDelete = false,
  onDelete,
  deleting = false,
}) {
  const [draft, setDraft] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const gallery = images && images.length > 0 ? images : image ? [{ url: image }] : [];
  const likeCount = typeof likes === "number" ? likes : 0;
  const commentCount = typeof comments === "number" ? comments : 0;

  const submitComment = () => {
    const text = draft.trim();
    if (!text || commentPosting || !onAddComment) return;
    onAddComment(text);
    setDraft("");
  };

  return (
    <article className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden p-5">
      <div className="flex justify-between items-start gap-3">
        <div className="flex gap-3 min-w-0">
          <Avatar src={avatar} alt={author} size="md" />
          <div className="min-w-0">
            <h3 className="font-semibold text-text leading-tight line-clamp-1 text-[15px]">{author}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {community && (
                <Badge variant="secondary" size="sm" icon="groups">
                  {community}
                </Badge>
              )}
              {time && <span className="text-xs text-text/50">· {time}</span>}
            </div>
          </div>
        </div>
        {canDelete && onDelete && (
          <button
            type="button"
            aria-label={confirmingDelete ? "Confirm delete" : "Delete post"}
            disabled={deleting}
            onClick={() => {
              if (confirmingDelete) onDelete();
              else {
                setConfirmingDelete(true);
                setTimeout(() => setConfirmingDelete(false), 3000);
              }
            }}
            className={`h-8 px-3 rounded-full text-xs font-semibold flex items-center gap-1 transition shrink-0 disabled:opacity-50 ${
              confirmingDelete
                ? "bg-red-600 text-white hover:bg-red-700"
                : "hover:bg-secondary text-text/40 hover:text-red-600"
            }`}
          >
            <span className="material-symbols-outlined text-base">delete</span>
            {confirmingDelete ? (deleting ? "Deleting…" : "Confirm?") : ""}
          </button>
        )}
      </div>

      <p className="mt-4 text-[15px] text-text leading-relaxed break-words">{content}</p>

      {gallery.slice(0, 1).map((img) => (
        <div key={img.url} className="mt-4 rounded-2xl overflow-hidden border border-border bg-secondary">
          <img
            src={img.url}
            alt=""
            className="w-full h-auto object-cover max-h-[420px]"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        </div>
      ))}

      <div className="flex items-center gap-1 mt-4 pt-3 border-t border-border">
        <button
          type="button"
          aria-label={liked ? "Unlike post" : "Like post"}
          aria-pressed={liked}
          disabled={!onLike || likeLoading}
          onClick={onLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
            !onLike
              ? "text-text/60"
              : liked
                ? "text-primary bg-accent/60 hover:bg-accent"
                : "text-text/60 hover:text-primary hover:bg-accent/50"
          } disabled:opacity-60`}
        >
          <span className="material-symbols-outlined text-[18px]" style={liked ? { fontVariationSettings: "'FILL' 1" } : undefined}>
            favorite
          </span>{" "}
          {likeCount}
        </button>
        <button
          type="button"
          aria-label="Comment on post"
          aria-expanded={commentsList ? commentsOpen : undefined}
          disabled={!onToggleComments}
          onClick={onToggleComments}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
            onToggleComments ? "text-text/60 hover:text-text hover:bg-secondary" : "text-text/60"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">chat_bubble</span> {commentCount}
        </button>
        <button type="button" aria-label="Share post" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary text-sm text-text/60 hover:text-text transition font-medium ml-auto">
          <span className="material-symbols-outlined text-[18px]">share</span> Share
        </button>
      </div>

      {commentsList && commentsOpen && (
        <div className="mt-3 pt-3 border-t border-border">
          {commentsList.length === 0 ? (
            <p className="text-sm text-text/50">No comments yet — start the conversation.</p>
          ) : (
            commentsList.map((c) => <CommentItem key={c.id} comment={c} />)
          )}
          {onAddComment && (
            <div className="flex gap-2 mt-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submitComment();
                  }
                }}
                placeholder="Write a comment…"
                aria-label="Write a comment"
                disabled={commentPosting}
                className="flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm text-text placeholder:text-text/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-60 transition"
              />
              <button
                type="button"
                onClick={submitComment}
                disabled={!draft.trim() || commentPosting}
                aria-label="Send comment"
                className="w-9 h-9 rounded-full bg-primary text-background hover:bg-[#3E403A] flex items-center justify-center disabled:opacity-40 transition shrink-0"
              >
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
