export default function HobbyCard({ hobby, selected, onToggle }) {
  return (
    <button
      aria-pressed={selected}
      onClick={() => onToggle(hobby.id)}
      className={`hobby-card group relative text-left rounded-2xl overflow-hidden border shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 h-48 md:h-52 flex flex-col justify-end transition-all duration-200 ${
        selected ? "selected border-primary bg-primary" : "border-border bg-white hover:border-border-strong"
      }`}
    >
      {/* Background photo with error fallback */}
      <img
        src={hobby.image}
        alt={hobby.alt || hobby.title}
        className="absolute inset-0 z-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 bg-secondary"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
      {/* Scrim: light for unselected, dark primary for selected so white text stays legible */}
      <div
        className={`image-overlay absolute inset-x-0 bottom-0 z-10 h-[74%] bg-gradient-to-t transition-colors duration-200 ${selected ? "from-primary via-primary/85 via-[58%] to-transparent" : "from-background via-background/90 via-[58%] to-transparent"}`}
      />
      {/* Content */}
      <div className="relative z-20 p-4 w-full min-w-0">
        {/* Top row: icon chip + check badge with fixed spacing to avoid Fitness collision */}
        <div className="flex justify-between items-start gap-3 mb-2">
          <div className="bg-background/90 backdrop-blur-sm p-2 rounded-full inline-flex shrink-0">
            <span className="material-symbols-outlined card-icon text-primary filled text-xl leading-none">
              {hobby.icon}
            </span>
          </div>
          <div className="check-icon bg-secondary text-primary rounded-full p-1.5 shadow-sm shrink-0 ml-auto flex items-center justify-center w-7 h-7">
            <span className="material-symbols-outlined text-[16px] font-bold leading-none">check</span>
          </div>
        </div>
        {/* Text with conditional scrim - stronger on light images, hidden on selected dark bg */}
        <div className="rounded-md">
          <h3
            className="card-title font-headline font-bold text-lg leading-tight mb-1 break-words line-clamp-2"
            style={
              selected
                ? { textShadow: "none" }
                : { textShadow: "0 1px 10px rgba(245,243,237,0.98), 0 1px 4px rgba(245,243,237,0.9)", color: "#272822" }
            }
          >
            {hobby.title}
          </h3>
          <p
            className="card-count font-body text-xs font-medium break-words"
            style={
              selected
                ? { textShadow: "none" }
                : { textShadow: "0 1px 8px rgba(245,243,237,0.95)", color: "rgba(39,40,34,0.7)" }
            }
          >
            {hobby.count}
          </p>
        </div>
      </div>
    </button>
  );
}
