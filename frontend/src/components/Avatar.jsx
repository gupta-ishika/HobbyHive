import { useState } from "react";

export default function Avatar({ src, alt = "User", size = "md", status, bordered = true }) {
  // failedSrc (not a boolean) scopes the error to the URL that failed, so
  // changing src never flashes initials for a URL that hasn't failed.
  const [failedSrc, setFailedSrc] = useState(null);
  const failed = failedSrc === src;
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-sm",
    xl: "w-20 h-20 text-lg",
  };
  const initials = alt
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative inline-flex shrink-0">
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailedSrc(src)}
          className={`${sizes[size]} rounded-full object-cover ${bordered ? "ring-1 ring-black/5 shadow-sm" : ""} bg-secondary`}
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-full flex items-center justify-center font-bold bg-secondary text-primary ring-1 ring-black/5`}
        >
          {initials || "?"}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
            status === "online" ? "bg-emerald-500" : status === "offline" ? "bg-zinc-300" : "bg-secondary"
          }`}
        />
      )}
    </div>
  );
}
