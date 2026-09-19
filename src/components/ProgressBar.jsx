export default function ProgressBar({ selectedCount, required = 3 }) {
  const pct = Math.min((selectedCount / required) * 100, 100);
  return (
    <div className="w-full max-w-sm mb-4 px-2">
      <div className="flex justify-between text-xs font-label text-text/60 mb-1">
        <span>Selection Progress</span>
        <span id="progress-text" className={selectedCount >= required ? "text-primary font-bold" : ""}>
          {selectedCount >= required ? `${selectedCount} selected - Ready!` : `${selectedCount}/${required} minimum`}
        </span>
      </div>
      <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
        <div
          id="progress-fill"
          className={`h-full bg-primary transition-all duration-300 ease-out rounded-full ${selectedCount > required ? "animate-pulse" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
