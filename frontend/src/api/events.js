import { api } from "./client";

// GET /events?community_id&upcoming_only&search&limit&offset
export function listEvents(params) {
  return api.get("/events", { params });
}

// POST /events (201) | 404 unknown community | 400 past date
export function createEvent(payload) {
  return api.post("/events", payload);
}

// GET /events/{id}
export function fetchEvent(id) {
  return api.get(`/events/${id}`);
}

// PUT /events/{id} — creator only (403)
export function updateEvent(id, payload) {
  return api.put(`/events/${id}`, payload);
}

// DELETE /events/{id} — creator only, cascades RSVPs
export function deleteEvent(id) {
  return api.delete(`/events/${id}`);
}

// POST /events/{id}/rsvp { status: "going" | "interested" } — upserts
export function rsvpToEvent(id, status) {
  return api.post(`/events/${id}/rsvp`, { status });
}

// DELETE /events/{id}/rsvp — cancel own RSVP (404 if none)
export function cancelRsvp(id) {
  return api.delete(`/events/${id}/rsvp`);
}
