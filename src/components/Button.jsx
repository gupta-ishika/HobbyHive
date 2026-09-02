export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  onClick,
  className = "",
  disabled = false,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  const variants = {
    primary: "bg-primary text-background hover:bg-primary/90 shadow-sm hover:shadow-md border border-primary",
    secondary: "bg-secondary text-primary hover:bg-accent border border-accent",
    ghost: "bg-transparent text-primary hover:bg-secondary border border-transparent",
    outline: "bg-transparent text-text border-2 border-accent hover:border-primary hover:text-primary",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
    icon: "p-2.5",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
