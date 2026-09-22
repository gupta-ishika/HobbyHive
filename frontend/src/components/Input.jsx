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
        <label htmlFor={inputId} className="block text-sm font-semibold text-text mb-1.5">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text/40 group-focus-within:text-primary material-symbols-outlined text-[20px] transition-colors">
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
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full bg-white border rounded-xl px-4 py-3 text-[15px] text-text placeholder:text-text/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all ${icon ? "pl-10" : ""} ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500/10 bg-red-50/30" : "border-border hover:border-border-strong"}`}
          {...props}
        />
      </div>
      {error && <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-600 flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{error}</p>}
    </div>
  );
}
