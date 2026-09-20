export default function Card({ children, className = "", hover = false, padding = "p-6", ...props }) {
  return (
    <div
      className={`bg-background rounded-xl border-2 border-accent shadow-sm ${hover ? "hover:shadow-md hover:border-primary/20 transition-all duration-300" : ""} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
