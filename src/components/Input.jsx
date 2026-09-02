export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  label,
  error,
  icon,
  id,
  ...props
}) {
  const inputId = id || (name ? `input-${name}` : undefined);
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-bold text-text mb-1.5 font-label">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50 material-symbols-outlined text-[20px]">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          aria-invalid={!!error}
          className={`w-full bg-background border-2 rounded-lg px-4 py-2.5 text-text placeholder:text-text/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition ${icon ? "pl-10" : ""} ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-accent"}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
