/**
 * @param {Object} props
 * @param {string} props.dateLabel - Must be in short "MON DD" format (e.g. "OCT 12", "JAN 5").
 *   The string is split on the first space to render month and day separately.
 *   Full month names ("October 12") or other formats will not display correctly.
 */
export default function EventCard({ title, hobby, dateLabel = "OCT 12", distance, onClick }) {
  const parts = dateLabel.split(" ");
  const mon = parts[0] || "";
  const day = parts[1] || "";
  return (
    <button onClick={onClick} className="w-full flex gap-3 text-left hover:bg-secondary/40 p-2 -mx-2 rounded-lg transition">
      <div className="w-11 h-14 rounded-lg bg-accent/60 border border-accent flex flex-col items-center justify-center shrink-0">
        <span className="text-xs font-bold text-text/60 leading-none">{mon}</span>
        <span className="text-lg font-black text-text leading-none">{day}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-sm text-text leading-tight line-clamp-1">{title}</p>
        <p className="text-xs text-text/60 line-clamp-1">{hobby} · {distance}</p>
      </div>
    </button>
  );
}
