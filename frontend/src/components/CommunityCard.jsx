import Button from "./Button";

function HobbyIcon({ hobby, icon }) {
  if (icon) return <span className="material-symbols-outlined text-sm">{icon}</span>;
  const map = {
    Pottery: "palette",
    Woodworking: "handyman",
    Photography: "photo_camera",
    Gardening: "local_florist",
    Cooking: "restaurant",
    Gaming: "sports_esports",
    Painting: "brush",
    Crochet: "content_cut",
    Music: "music_note",
    Cycling: "directions_bike",
    Chess: "extension",
    Reading: "menu_book",
  };
  return <span className="material-symbols-outlined text-sm">{map[hobby] || "label"}</span>;
}

export default function CommunityCard({ title, hobby = "Pottery", members = 128, description = "", image, icon, onJoin, onClick }) {
  const memberLabel = typeof members === "number" && members >= 1000 ? `${(members / 1000).toFixed(1)}k` : `${members}`;
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      className={`bg-background rounded-2xl border border-accent overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col ${onClick ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" : ""}`}>
      <div className="relative h-48 bg-secondary overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary via-accent to-secondary">
            <span className="material-symbols-outlined text-4xl text-primary/40">groups</span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm border border-accent rounded-full px-3 py-1 flex items-center gap-1.5 text-xs font-bold text-text shadow-sm">
          <HobbyIcon hobby={hobby} icon={icon} />
          {hobby}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-headline font-bold text-xl text-text leading-tight">{title}</h3>
        <p className="text-sm text-text/70 mt-2 line-clamp-3 leading-relaxed flex-1">{description}</p>
        <div className="border-t border-accent/60 mt-4 pt-4 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold text-text">
            <span className="material-symbols-outlined text-base">group</span>
            {typeof members === "number" ? `${memberLabel} Members` : members}
          </span>
          <Button
            size="sm"
            className="rounded-full px-6"
            onClick={(e) => {
              e.stopPropagation();
              if (onJoin) onJoin();
            }}
          >
            Join
          </Button>
        </div>
      </div>
    </div>
  );
}
