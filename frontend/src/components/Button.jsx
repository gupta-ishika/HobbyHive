export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  onClick,
  className = "",
  disabled = false,
  loading = false,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none";
  const variants = {
    primary: "bg-primary text-background hover:bg-[#3E403A] shadow-[0_1px_2px_rgba(39,40,34,0.08)] hover:shadow-[0_4px_12px_rgba(39,40,34,0.12)] border border-primary",
    secondary: "bg-white text-text border border-border hover:border-border-strong hover:bg-background shadow-sm",
    ghost: "bg-transparent text-text hover:bg-white border border-transparent hover:border-border",
    outline: "bg-transparent text-text border border-border-strong hover:border-primary hover:text-primary hover:bg-white",
  };
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-full gap-1.5",
    md: "px-6 py-2.5 text-sm rounded-full gap-2",
    lg: "px-8 py-3.5 text-[15px] rounded-full gap-2",
    icon: "p-2.5 rounded-full aspect-square",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
