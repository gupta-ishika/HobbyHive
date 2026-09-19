import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HobbyCard from "../components/HobbyCard";
import ProgressBar from "../components/ProgressBar";
import { hobbies } from "../data/hobbies";

export default function HobbySelectionMinimal() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const canProceed = selected.length >= 3;

  return (
    <div className="min-h-screen flex flex-col items-center bg-background text-text pt-8 pb-32">
      <header className="w-full max-w-7xl px-6 md:px-8 mb-8 text-center md:text-left flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline font-black text-4xl md:text-5xl tracking-tight text-text mb-2">What are you into?</h1>
          <p className="text-text/70 text-lg">Pick at least 3 to personalize your hub.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-accent/30 px-4 py-2 rounded-lg border border-accent">
          <span className="material-symbols-outlined text-primary text-xl">favorite</span>
          <span className="font-bold text-text"><span>{selected.length}</span>/3 Selected</span>
        </div>
      </header>

      <main className="w-full max-w-7xl px-4 md:px-8 flex-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
          {hobbies.map((h) => (
            <HobbyCard key={h.id} hobby={h} selected={selected.includes(h.id)} onToggle={toggle} />
          ))}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full z-50 flex flex-col justify-center items-center px-6 pb-8 pt-4 bg-background border-t border-accent/50 shadow-[0_-10px_40px_rgba(39,40,34,0.05)]">
        <ProgressBar selectedCount={selected.length} />
        <button
          disabled={!canProceed}
          onClick={() => canProceed && navigate("/feed")}
          className={`flex items-center justify-center gap-2 font-medium text-sm rounded-full px-12 py-3 transition-all duration-300 transform ${
            canProceed
              ? "bg-primary text-background hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg"
              : "bg-primary/50 text-background/70 opacity-50 cursor-not-allowed scale-100"
          }`}
        >
          Next <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
