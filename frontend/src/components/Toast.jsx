import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);
let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (message, type = "success") => {
      const id = nextId++;
      setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
      timers.current.set(id, setTimeout(() => dismiss(id), 3600));
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4 w-full max-w-md" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2.5 pl-3 pr-2 py-2.5 rounded-2xl shadow-lg border text-sm font-medium w-full ${
              t.type === "error"
                ? "bg-[#3A2B2B] text-white border-white/10"
                : "bg-primary text-background border-black/10"
            }`}
          >
            <span className="material-symbols-outlined text-lg shrink-0">
              {t.type === "error" ? "error" : "check_circle"}
            </span>
            <span className="flex-1 leading-snug">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="w-7 h-7 rounded-full hover:bg-white/15 flex items-center justify-center shrink-0 transition"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
