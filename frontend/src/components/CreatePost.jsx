import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "./Button";
import Avatar from "./Avatar";

export default function CreatePost({
  onPost,
  placeholder = "Share your hobby...",
  variant = "full",
  disabled = false,
}) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const canPost = text.trim().length > 0 && !disabled;

  const handlePost = () => {
    if (canPost && onPost) {
      onPost(text.trim());
      setText("");
    }
  };

  if (variant === "compact") {
    return (
      <div
        className={`bg-surface p-4 rounded-2xl border border-border flex gap-3 items-center shadow-sm ${
          disabled ? "opacity-60" : "opacity-100"
        }`}
      >
        <Avatar src={user?.avatar} alt={user?.name || "You"} size="md" />
        <input
          disabled={disabled}
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canPost) {
              e.preventDefault();
              handlePost();
            }
          }}
          className="flex-1 bg-background border border-border rounded-full px-4 py-2.5 text-sm text-text placeholder:text-text/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed transition"
        />
        <button
          type="button"
          disabled={disabled || !canPost}
          onClick={handlePost}
          aria-label="Post"
          className="w-9 h-9 rounded-full bg-primary text-background hover:bg-[#3E403A] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0"
        >
          <span className="material-symbols-outlined text-lg">send</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-4 md:p-5">
      <div className="flex gap-3">
        <Avatar src={user?.avatar} alt={user?.name || "You"} size="md" />
        <div className="flex-1 min-w-0">
          <textarea
            rows={3}
            placeholder={placeholder}
            aria-label="Create post"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && canPost) {
                e.preventDefault();
                handlePost();
              }
            }}
            className="w-full bg-background border border-border rounded-2xl p-3.5 text-sm text-text placeholder:text-text/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white resize-none transition"
          />
          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-1.5">
              <button
                type="button"
                aria-label="Add image"
                className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-text/50 hover:text-primary transition"
              >
                <span className="material-symbols-outlined text-xl">image</span>
              </button>
              <button
                type="button"
                aria-label="Add link"
                className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-text/50 hover:text-primary transition"
              >
                <span className="material-symbols-outlined text-xl">link</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-text/40 hidden sm:block">{text.length > 0 ? `${text.length} characters` : "Share something"}</span>
              <Button size="sm" disabled={!canPost} onClick={handlePost}>
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
