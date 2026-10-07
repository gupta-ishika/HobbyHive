import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HobbyCard from "../components/HobbyCard";
import ProgressBar from "../components/ProgressBar";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../components/Toast";
import { listHobbies, saveMyHobbies } from "../api/users";

export default function HobbySelectionMinimal() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [hobbies, setHobbies] = useState([]);
  const [selected, setSelected] = useState(() => (user?.hobbies || []).map((h) => h.id));
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        const data = await listHobbies();
        if (!cancelled) setHobbies(data);
      } catch (err) {
        if (!cancelled) setLoadError(err?.detail || "Could not load hobbies.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const canProceed = selected.length >= 3;

  const handleContinue = async () => {
    if (!canProceed || saving) return;
    setSaving(true);
    try {
      await saveMyHobbies(selected);
      await refreshUser().catch(() => {});
      toast("Interests saved — welcome to your hub!");
      navigate("/feed");
    } catch (err) {
      toast(err?.detail || "Could not save your interests.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-background text-text pt-8 pb-32">
      <header className="w-full max-w-6xl px-4 md:px-6 mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="text-center md:text-left">
          <h1 className="font-headline font-black text-3xl md:text-4xl tracking-tight text-text mb-2">What are you into?</h1>
          <p className="text-text/60 text-base">Pick at least 3 to personalize your hub.</p>
        </div>
        <div className="hidden md:flex items-center gap-2.5 bg-white border border-border px-4 py-2 rounded-full shadow-sm">
          <span className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-primary"><span className="material-symbols-outlined text-base">favorite</span></span>
          <span className="text-sm font-semibold text-text">{selected.length}/3 selected</span>
        </div>
        <div className="md:hidden inline-flex items-center gap-2 bg-white border border-border px-3 py-1.5 rounded-full shadow-sm mx-auto">
          <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-primary"><span className="material-symbols-outlined text-sm">favorite</span></span>
          <span className="text-sm font-semibold text-text">{selected.length}/3</span>
        </div>
      </header>

      <main className="w-full max-w-6xl px-4 md:px-6 flex-1">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4" aria-label="Loading hobbies">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-48 md:h-52 rounded-2xl" />
            ))}
          </div>
        ) : loadError ? (
          <EmptyState
            icon="cloud_off"
            title="Could not load hobbies"
            description={loadError}
            action={<Button variant="secondary" onClick={() => window.location.reload()}>Try again</Button>}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {hobbies.map((h) => (
              <HobbyCard
                key={h.id}
                hobby={{ id: h.id, title: h.name, icon: h.icon || "label", image: h.image_url, alt: h.name }}
                selected={selected.includes(h.id)}
                onToggle={toggle}
              />
            ))}
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 w-full z-50 flex flex-col justify-center items-center px-4 md:px-6 pb-6 pt-4 bg-surface/90 backdrop-blur-xl border-t border-border shadow-[0_-8px_24px_rgba(39,40,34,0.06)]">
        <ProgressBar selectedCount={selected.length} />
        <button
          disabled={!canProceed || saving}
          onClick={handleContinue}
          aria-disabled={!canProceed || saving}
          className={`inline-flex items-center justify-center gap-2 font-semibold text-sm rounded-full px-10 py-3 transition-all duration-200 ${
            canProceed && !saving
              ? "bg-primary text-background hover:bg-[#3E403A] hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
              : "bg-primary/40 text-background/60 cursor-not-allowed"
          }`}
        >
          {saving ? "Saving…" : "Continue"}
          <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </span>
        </button>
        <p className="text-xs text-text/40 mt-2">{canProceed ? "Ready to explore" : "Select at least 3 interests"}</p>
      </div>
    </div>
  );
}
