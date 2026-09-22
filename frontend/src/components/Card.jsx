export default function Card({ children, className = "", hover = false, padding = "p-6", ...props }) {
  return (
    <div
      className={`bg-surface rounded-2xl border border-border shadow-[0_1px_3px_rgba(39,40,34,0.04),0_4px_12px_rgba(39,40,34,0.03)] ${hover ? "card-hover hover:border-border-strong" : ""} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
