import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AppHeader({ variant = "app" }) {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  const homeLink = isAuthenticated ? "/feed" : "/";

  const isActive = (p) => pathname === p || pathname.startsWith(p + "/");
  const linkCls = (active) =>
    `pb-3 pt-3 border-b-2 transition font-medium ${
      active ? "border-primary text-primary font-bold" : "border-transparent text-text/70 hover:text-primary"
    }`;

  if (variant === "landing") {
    return (
      <header className="bg-background sticky top-0 z-50 flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <Link to={homeLink} className="font-headline font-bold text-primary flex items-center gap-2 text-xl">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            widgets
          </span>
          Hobby Hub
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
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-accent/50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center gap-6">
        <Link to={homeLink} className="font-headline font-black text-xl text-text tracking-tight shrink-0">
          Hobby Hub
        </Link>

        <nav className="hidden md:flex items-center gap-6 ml-6">
          <Link to="/feed" className={linkCls(isActive("/feed"))}>
            Discover
          </Link>
          <Link to="/communities" className={linkCls(isActive("/communities"))}>
            Communities
          </Link>
          <Link to="/events" className={linkCls(isActive("/events"))}>
            Events
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-secondary/40 border border-accent rounded-full px-3 py-1.5 w-64">
            <span className="material-symbols-outlined text-text/50 text-xl">search</span>
            <input
              aria-label="Search hobbies, events"
              placeholder="Search hobbies, events..."
              className="bg-transparent outline-none text-sm text-text placeholder:text-text/40 w-full"
            />
          </div>
          <button type="button" aria-label="Notifications" className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center text-text/70">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <Link to="/profile/me" className="w-9 h-9 rounded-full bg-secondary border-2 border-accent overflow-hidden flex items-center justify-center">
            <span className="material-symbols-outlined text-text/70">person</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
