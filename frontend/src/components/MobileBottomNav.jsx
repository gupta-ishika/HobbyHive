import { Link, useLocation } from "react-router-dom";

export default function MobileBottomNav() {
  const { pathname } = useLocation();

  const isActive = (path) => {
    if (path === "/feed") return pathname === "/feed";
    if (path === "/communities") return pathname.startsWith("/communities");
    if (path === "/events") return pathname.startsWith("/events");
    if (path === "/profile/me") return pathname.startsWith("/profile");
    return pathname === path;
  };

  const navItems = [
    { label: "Feed", icon: "home", to: "/feed" },
    { label: "Groups", icon: "groups", to: "/communities" },
    { label: "Events", icon: "event", to: "/events" },
    { label: "Profile", icon: "person", to: "/profile/me" },
  ];

  return (
    <>
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-accent flex justify-around items-center py-2 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      >
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-full transition-colors ${
                active ? "bg-secondary text-primary font-bold" : "text-text/60 hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      {/* Spacer so fixed bottom nav does not overlay content */}
      <div className="h-16 md:hidden" />
    </>
  );
}
