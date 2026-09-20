export default function Avatar({ src, alt = "User", size = "md", status, bordered = true }) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
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
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizes[size]} rounded-full object-cover ${bordered ? "border-2 border-secondary" : ""} bg-secondary`}
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-full flex items-center justify-center font-bold bg-secondary text-primary border-2 border-accent`}
        >
          {initials || "?"}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
            status === "online" ? "bg-primary" : status === "offline" ? "bg-accent" : "bg-secondary"
          }`}
        />
      )}
    </div>
  );
}
