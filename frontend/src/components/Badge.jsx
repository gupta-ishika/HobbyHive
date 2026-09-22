export default function Badge({ children, variant = "accent", size = "md", icon, className = "", ...props }) {
  const variants = {
    accent: "bg-accent text-primary border-accent",
    secondary: "bg-secondary text-text border-secondary",
    primary: "bg-primary text-background border-primary",
    outline: "bg-transparent text-text/70 border-border",
    muted: "bg-white text-text/60 border-border",
  };
  const sizes = {
    sm: "text-[11px] px-2.5 py-0.5 tracking-wide",
    md: "text-xs px-3 py-1 font-semibold",
    lg: "text-xs px-3.5 py-1.5 font-semibold tracking-wide",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="material-symbols-outlined text-[14px] leading-none">{icon}</span>}
      {children}
    </span>
  );
}
