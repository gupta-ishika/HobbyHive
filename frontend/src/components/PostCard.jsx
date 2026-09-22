import Avatar from "./Avatar";
import Badge from "./Badge";

export default function PostCard({
  author,
  avatar,
  community,
  time,
  content,
  image,
  likes = 0,
  comments = 0,
}) {
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
        <button type="button" aria-label="More options" className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-text/40 hover:text-text transition shrink-0">
          <span className="material-symbols-outlined text-xl">more_horiz</span>
        </button>
      </div>

      <p className="mt-4 text-[15px] text-text leading-relaxed break-words">{content}</p>

      {image && (
        <div className="mt-4 rounded-2xl overflow-hidden border border-border bg-secondary">
          <img
            src={image}
            alt=""
            className="w-full h-auto object-cover max-h-[420px]"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        </div>
      )}

      <div className="flex items-center gap-1 mt-4 pt-3 border-t border-border">
        <button type="button" aria-label="Like post" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-accent/50 text-sm text-text/60 hover:text-primary transition font-medium">
          <span className="material-symbols-outlined text-[18px]">favorite</span> {likes}
        </button>
        <button type="button" aria-label="Comment on post" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary text-sm text-text/60 hover:text-text transition font-medium">
          <span className="material-symbols-outlined text-[18px]">chat_bubble</span> {comments}
        </button>
        <button type="button" aria-label="Share post" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary text-sm text-text/60 hover:text-text transition font-medium ml-auto">
          <span className="material-symbols-outlined text-[18px]">share</span> Share
        </button>
      </div>
    </article>
  );
}
