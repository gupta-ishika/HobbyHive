export default function Badge({ children, variant = "accent", size = "md", icon, className = "", ...props }) {
  const variants = {
    accent: "bg-accent text-primary border-accent",
    secondary: "bg-secondary text-text border-secondary",
    primary: "bg-primary text-background border-primary",
    outline: "bg-transparent text-text/70 border-accent",
    muted: "bg-background text-text/60 border-accent/50",
  };
  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-3 py-1",
    lg: "text-sm px-3.5 py-1.5",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
      {children}
    </span>
  );
}
