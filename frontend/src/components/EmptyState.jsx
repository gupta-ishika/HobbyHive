export default function EmptyState({ icon = "search_off", title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-surface rounded-2xl border border-dashed border-border">
      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary mb-4">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <h3 className="font-headline font-bold text-lg text-text">{title}</h3>
      {description && <p className="text-sm text-text/60 mt-1.5 max-w-sm leading-relaxed">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
