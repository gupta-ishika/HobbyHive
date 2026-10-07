import { api } from "./client";

// POST /auth/signup (201) | 409 duplicate | 422 validation
export function signup(payload) {
  return api.post("/auth/signup", payload, { auth: false });
}

// POST /auth/login (200) | 401 bad credentials
export function login(payload) {
  return api.post("/auth/login", payload, { auth: false });
}

// GET /auth/me — current session user
export function fetchMe() {
  return api.get("/auth/me");
}
