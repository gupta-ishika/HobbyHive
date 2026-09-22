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
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl border-t border-border flex justify-around items-center py-2 px-2 safe-area-pb shadow-[0_-8px_24px_rgba(39,40,34,0.06)]"
      >
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.label}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-1 px-5 py-1.5 rounded-2xl transition-all ${
                active ? "bg-primary text-background shadow-sm" : "text-text/60 hover:text-text hover:bg-secondary"
              }`}
            >
              <span className="material-symbols-outlined text-xl leading-none">{item.icon}</span>
              <span className="text-[11px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      {/* Spacer so fixed bottom nav does not overlay content */}
      <div className="h-[72px] md:hidden" />
    </>
  );
}
