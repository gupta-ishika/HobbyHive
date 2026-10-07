import { api } from "./client";

// GET /users/hobbies — public catalog for onboarding
export function listHobbies() {
  return api.get("/users/hobbies", { auth: false });
}

// POST /users/hobbies { hobby_ids } — save onboarding selection
export function saveMyHobbies(hobbyIds) {
  return api.post("/users/hobbies", { hobby_ids: hobbyIds });
}

// GET /users/profile — own profile with stats
export function fetchMyProfile() {
  return api.get("/users/profile");
}

// GET /users/profile/{id} — public profile of any user
export function fetchProfileById(userId) {
  return api.get(`/users/profile/${userId}`);
}

// PUT /users/profile — update own profile
export function updateMyProfile(payload) {
  return api.put("/users/profile", payload);
}
