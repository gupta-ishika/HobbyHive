import { api } from "./client";

// GET /communities?category&hobby_id&search&limit&offset
export function listCommunities(params) {
  return api.get("/communities", { params });
}

// POST /communities (201) | 409 duplicate name
export function createCommunity(payload) {
  return api.post("/communities", payload);
}

// GET /communities/{id} — detail with members
export function fetchCommunity(id) {
  return api.get(`/communities/${id}`);
}

// PUT /communities/{id} — owner only (403)
export function updateCommunity(id, payload) {
  return api.put(`/communities/${id}`, payload);
}

// DELETE /communities/{id} — owner only, cascades
export function deleteCommunity(id) {
  return api.delete(`/communities/${id}`);
}

// POST /communities/{id}/join — idempotent
export function joinCommunity(id) {
  return api.post(`/communities/${id}/join`);
}

// POST /communities/{id}/leave — owner gets 400
export function leaveCommunity(id) {
  return api.post(`/communities/${id}/leave`);
}
