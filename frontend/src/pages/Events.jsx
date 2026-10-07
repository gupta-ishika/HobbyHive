import { useCallback, useEffect, useMemo, useState } from "react";
import AppHeader from "../components/AppHeader";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import MobileBottomNav from "../components/MobileBottomNav";
import EmptyState from "../components/EmptyState";
import { CardSkeleton } from "../components/Skeleton";
import { useToast } from "../components/Toast";
import { useAbortable } from "../hooks/useAbortable";
import { listEvents, fetchEvent, rsvpToEvent, cancelRsvp } from "../api/events";
import { listCommunities } from "../api/communities";
import { eventDateLabel, eventTimeLabel } from "../utils/time";

function EventRsvpControls({ event, busy, onRsvp, onCancel }) {
  const status = event.user_rsvp_status;
  const disabled = !!busy;
  return (
    <div className="flex gap-2 mt-4">
      <Button
        variant={status === "going" ? "primary" : "secondary"}
        size="sm"
        className="flex-1"
        disabled={disabled}
        onClick={() => onRsvp(event, "going")}
      >
        <span className="material-symbols-outlined text-base">check</span>
        {status === "going" ? "Going ✓" : "Going"}
      </Button>
      <Button
        variant={status === "interested" ? "primary" : "secondary"}
        size="sm"
        className="flex-1"
        disabled={disabled}
        onClick={() => onRsvp(event, "interested")}
      >
        <span className="material-symbols-outlined text-base">star</span>
        Interested
      </Button>
      {status && (
        <Button variant="ghost" size="sm" className="shrink-0" disabled={disabled} onClick={() => onCancel(event)}>
          Leave
        </Button>
      )}
    </div>
  );
}

export default function Events() {
  const { toast } = useToast();
  const runAbortable = useAbortable();
  const [events, setEvents] = useState([]);
  const [communityNames, setCommunityNames] = useState({});
  const [filter, setFilter] = useState("Upcoming");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [busyIds, setBusyIds] = useState({});

  const load = useCallback(async () => {
    return runAbortable(async (signal) => {
      setLoading(true);
      setLoadError("");
      try {
        const [eventsData, communitiesData] = await Promise.all([
          listEvents({ upcoming_only: true, limit: 50 }, { signal }),
          listCommunities({ limit: 100 }, { signal }).catch((err) => {
            if (err?.name === "AbortError") throw err;
            return [];
          }),
        ]);
        setEvents(eventsData);
        const names = {};
        for (const c of communitiesData) names[c.id] = c.name;
        setCommunityNames(names);
      } catch (err) {
        if (err?.name === "AbortError") return;
        setLoadError(err?.detail || "Could not load events.");
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    });
  }, [runAbortable]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(
    () => (filter === "My RSVPs" ? events.filter((e) => e.user_rsvp_status) : events),
    [events, filter]
  );

  const refreshOne = async (id) => {
    const updated = await fetchEvent(id);
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const handleRsvp = async (event, status) => {
    if (busyIds[event.id]) return;
    // Tapping the active status again cancels the RSVP (toggle behavior).
    const cancel = event.user_rsvp_status === status;
    setBusyIds((p) => ({ ...p, [event.id]: true }));
    try {
      if (cancel) {
        await cancelRsvp(event.id);
        toast("RSVP removed.");
      } else {
        await rsvpToEvent(event.id, status);
        toast(status === "going" ? "You're on the list!" : "Marked as interested.");
      }
      await refreshOne(event.id);
    } catch (err) {
      toast(err?.detail || "Could not update your RSVP.", "error");
    } finally {
      setBusyIds((p) => ({ ...p, [event.id]: false }));
    }
  };

  const handleCancel = async (event) => {
    if (busyIds[event.id]) return;
    setBusyIds((p) => ({ ...p, [event.id]: true }));
    try {
      await cancelRsvp(event.id);
      await refreshOne(event.id);
      toast("RSVP removed.");
    } catch (err) {
      toast(err?.detail || "Could not cancel your RSVP.", "error");
    } finally {
      setBusyIds((p) => ({ ...p, [event.id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader variant="app" />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary">Events</p>
          <h1 className="font-headline font-black text-3xl md:text-4xl text-text tracking-tight mt-1">Upcoming events</h1>
          <p className="text-text/60 mt-2 leading-relaxed">Meet people and take your hobbies offline.</p>
        </div>

        <div className="flex gap-2 mb-8">
          {["Upcoming", "My RSVPs"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${filter === f ? "bg-primary text-background border-primary shadow-sm" : "bg-white text-text/70 border-border hover:border-border-strong hover:text-text"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" aria-label="Loading events">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : loadError ? (
          <EmptyState
            icon="cloud_off"
            title="Could not load events"
            description={loadError}
            action={<Button variant="secondary" onClick={load}>Try again</Button>}
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon="event_busy"
            title={filter === "My RSVPs" ? "No RSVPs yet" : "No events yet"}
            description={filter === "My RSVPs" ? "Tap Going or Interested on any event to track it here." : "There are no upcoming events. Check back soon."}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((e) => {
              const attending = e.going_count + e.interested_count;
              return (
                <Card key={e.id} padding="p-0" className="overflow-hidden group card-hover">
                  <div className="h-32 bg-gradient-to-br from-secondary via-accent to-secondary flex items-center justify-center relative overflow-hidden">
                    <span className="material-symbols-outlined text-4xl text-primary/30">event</span>
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-black/5 rounded-full px-2.5 py-1 text-xs font-semibold text-text shadow-sm">
                      {eventDateLabel(e.starts_at)}
                    </div>
                    {e.user_rsvp_status && (
                      <div className="absolute top-3 right-3 bg-primary text-background rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm">
                        {e.user_rsvp_status === "going" ? "Going" : "Interested"}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-text leading-tight line-clamp-1">{e.title}</h3>
                    {(communityNames[e.community_id] || e.is_online) && (
                      <Badge variant="secondary" size="sm" className="mt-2">
                        {communityNames[e.community_id] || "Online event"}
                      </Badge>
                    )}
                    <p className="text-xs text-text/50 mt-2.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">schedule</span> {eventTimeLabel(e.starts_at)}
                    </p>
                    <p className="text-xs text-text/50 flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-sm">location_on</span> {e.location}
                    </p>
                    <p className="text-xs text-text/50 flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-sm">group</span>{" "}
                      {attending > 0 ? `${attending} attending (${e.going_count} going)` : "Be the first to RSVP"}
                    </p>
                    <EventRsvpControls
                      event={e}
                      busy={busyIds[e.id]}
                      onRsvp={handleRsvp}
                      onCancel={handleCancel}
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <MobileBottomNav />
    </div>
  );
}
