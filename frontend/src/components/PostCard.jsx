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
    <article className="bg-background rounded-xl border-2 border-accent shadow-sm overflow-hidden p-5">
      <div className="flex justify-between items-start gap-3">
        <div className="flex gap-3 min-w-0">
          <Avatar src={avatar} alt={author} size="md" />
          <div className="min-w-0">
            <h3 className="font-bold text-text leading-tight line-clamp-1">{author}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {community && (
                <Badge variant="secondary" size="sm" icon="groups">
                  {community}
                </Badge>
              )}
              {time && <span className="text-xs text-text/50">{time}</span>}
            </div>
          </div>
        </div>
        <button type="button" aria-label="More options" className="text-text/40 hover:text-primary p-1 rounded-full hover:bg-secondary transition">
          <span className="material-symbols-outlined text-xl">more_horiz</span>
        </button>
      </div>

      <p className="mt-4 text-sm md:text-base text-text leading-relaxed break-words">{content}</p>

      {image && (
        <div className="mt-4 rounded-xl overflow-hidden border border-accent bg-secondary">
          <img
            src={image}
            alt=""
            className="w-full h-auto object-cover max-h-[420px]"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        </div>
      )}

      <div className="flex items-center justify-between mt-5 pt-3 border-t border-accent/50 text-sm text-text/60">
        <button type="button" aria-label="Like post" className="flex items-center gap-1.5 hover:text-primary transition font-medium">
          <span className="material-symbols-outlined text-xl">favorite</span> {likes}
        </button>
        <button type="button" aria-label="Comment on post" className="flex items-center gap-1.5 hover:text-primary transition font-medium">
          <span className="material-symbols-outlined text-xl">chat_bubble</span> {comments}
        </button>
        <button type="button" aria-label="Share post" className="flex items-center gap-1.5 hover:text-primary transition font-medium">
          <span className="material-symbols-outlined text-xl">share</span> Share
        </button>
      </div>
    </article>
  );
}
