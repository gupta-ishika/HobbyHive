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
        className={`bg-background p-4 rounded-xl border-2 border-accent flex gap-3 items-center ${
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
          className="flex-1 bg-secondary/30 border border-accent rounded-full px-4 py-2.5 text-sm text-text placeholder:text-text/40 focus:outline-none focus:border-primary disabled:cursor-not-allowed"
        />
        <button
          type="button"
          disabled={disabled}
          onClick={handlePost}
          aria-label="Add image"
          className="w-9 h-9 rounded-full bg-secondary hover:bg-accent flex items-center justify-center text-primary disabled:opacity-50 transition shrink-0"
        >
          <span className="material-symbols-outlined text-xl">image</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-xl border-2 border-accent shadow-sm p-4 md:p-5">
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
            className="w-full bg-secondary/30 border border-accent rounded-xl p-3 text-sm text-text placeholder:text-text/40 focus:outline-none focus:border-primary focus:bg-background resize-none transition"
          />
          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Add image"
                className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-text/60 transition"
              >
                <span className="material-symbols-outlined text-xl">image</span>
              </button>
              <button
                type="button"
                aria-label="Add link"
                className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-text/60 transition"
              >
                <span className="material-symbols-outlined text-xl">link</span>
              </button>
            </div>
            <Button size="sm" disabled={!canPost} onClick={handlePost}>
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
