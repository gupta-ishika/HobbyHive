import AppHeader from "../components/AppHeader";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import MobileBottomNav from "../components/MobileBottomNav";
import EmptyState from "../components/EmptyState";
import events from "../data/events";

export default function Events() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader variant="app" />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary">Events</p>
          <h1 className="font-headline font-black text-3xl md:text-4xl text-text tracking-tight mt-1">Upcoming events</h1>
          <p className="text-text/60 mt-2 leading-relaxed">Meet people and take your hobbies offline.</p>
        </div>
        {events.length === 0 ? (
          <EmptyState icon="event_busy" title="No events yet" description="There are no upcoming events. Check back soon or create your own." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.slice(0, 6).map((e) => (
              <Card key={e.id} padding="p-0" className="overflow-hidden group card-hover">
                <div className="h-32 bg-secondary flex items-center justify-center relative overflow-hidden">
                  {e.image ? (
                    <img src={e.image} alt={e.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" loading="lazy" />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-primary/30">event</span>
                  )}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-black/5 rounded-full px-2.5 py-1 text-xs font-semibold text-text shadow-sm">
                    {e.date || e.dateLabel || "OCT 12"}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-text leading-tight line-clamp-1">{e.title}</h3>
                  <Badge variant="secondary" size="sm" className="mt-2">{e.hobby}</Badge>
                  <p className="text-xs text-text/50 mt-2.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">schedule</span> {e.dateLabel || e.time} • {e.distance || e.location}
                  </p>
                  <p className="text-xs text-text/50 flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-sm">group</span> {e.attendees ? `${e.attendees} attending` : "Join to see attendees"}
                  </p>
                  <Button variant="primary" size="sm" className="w-full mt-4">Join event</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <MobileBottomNav />
    </div>
  );
}
