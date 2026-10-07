import { api } from "./client";

// GET /users/hobbies — public catalog for onboarding
export function listHobbies(opts) {
  return api.get("/users/hobbies", { auth: false, ...opts });
}

// POST /users/hobbies { hobby_ids } — save onboarding selection
export function saveMyHobbies(hobbyIds) {
  return api.post("/users/hobbies", { hobby_ids: hobbyIds });
}

// GET /users/profile — own profile with stats
export function fetchMyProfile(opts) {
  return api.get("/users/profile", opts);
}

// GET /users/profile/{id} — public profile of any user
export function fetchProfileById(userId, opts) {
  return api.get(`/users/profile/${userId}`, opts);
}

// PUT /users/profile — update own profile
export function updateMyProfile(payload) {
  return api.put("/users/profile", payload);
}
