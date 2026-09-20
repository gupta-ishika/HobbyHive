import AppHeader from "../components/AppHeader";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import MobileBottomNav from "../components/MobileBottomNav";
import events from "../data/events";

export default function Events() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader variant="app" />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="font-headline font-black text-4xl text-text">Upcoming events</h1>
          <p className="text-text/60 mt-2">Meet people and take your hobbies offline.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 6).map((e) => (
            <Card key={e.id} padding="p-0" className="overflow-hidden">
              <div className="h-32 bg-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary/30">event</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-text">{e.title}</h3>
                <Badge variant="secondary" size="sm" className="mt-2">{e.hobby}</Badge>
                <p className="text-xs text-text/60 mt-2">{e.dateLabel || e.time} · {e.distance || e.location}</p>
                <p className="text-xs text-text/60">{e.attendees ? `${e.attendees} people attending` : "Join to see attendees"}</p>
                <Button variant="primary" size="sm" className="w-full mt-4">Join Event</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}
