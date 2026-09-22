import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AppHeader({ variant = "app" }) {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  const homeLink = isAuthenticated ? "/feed" : "/";

  const isActive = (p) => pathname === p || pathname.startsWith(p + "/");

  if (variant === "landing") {
    return (
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-8 md:px-6 h-[64px] flex justify-between items-center gap-8">
          <Link to={homeLink} className="font-headline font-bold text-primary flex items-center gap-2 text-xl">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              widgets
            </span>
            HobbyHive
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="font-medium hover:text-primary transition-colors">About Us</a>
              <a href="#" className="font-medium hover:text-primary transition-colors">How It Works</a>
            </nav>
            <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="bg-primary text-background font-bold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md">
              Sign Up
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-[64px] flex items-center gap-4">
        <Link to={homeLink} className="font-headline font-bold text-primary flex items-center gap-2 text-xl shrink-0">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            widgets
          </span>
          HobbyHive
        </Link>

        <nav className="hidden md:flex items-center gap-6 ml-6 h-full">
          <Link
            to="/feed"
            className={`h-[64px] flex items-center border-b-2 text-sm font-medium transition ${
              isActive("/feed")
                ? "border-primary text-primary font-bold"
                : "border-transparent text-text/70 hover:text-primary"
            }`}
          >
            Discover
          </Link>
          <Link
            to="/communities"
            className={`h-[64px] flex items-center border-b-2 text-sm font-medium transition ${
              isActive("/communities")
                ? "border-primary text-primary font-bold"
                : "border-transparent text-text/70 hover:text-primary"
            }`}
          >
            Communities
          </Link>
          <Link
            to="/events"
            className={`h-[64px] flex items-center border-b-2 text-sm font-medium transition ${
              isActive("/events")
                ? "border-primary text-primary font-bold"
                : "border-transparent text-text/70 hover:text-primary"
            }`}
          >
            Events
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 bg-background border border-border rounded-full px-3.5 py-2 w-64 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
            <span className="material-symbols-outlined text-text/40 text-xl">search</span>
            <input
              aria-label="Search hobbies, events"
              placeholder="Search..."
              className="bg-transparent border-0 border-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none text-sm text-text placeholder:text-text/40 w-full"
            />
          </div>
          <button type="button" aria-label="Search" className="lg:hidden w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center text-text/60 transition">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button type="button" aria-label="Notifications" className="relative w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center text-text/60 transition">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white" />
          </button>
          <Link to="/profile/me" className="w-9 h-9 rounded-full bg-secondary ring-1 ring-black/5 overflow-hidden flex items-center justify-center hover:ring-primary/20 transition">
            <span className="material-symbols-outlined text-text/60 text-xl">person</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

