import { api } from "./client";

// GET /posts?community_id&author_id&search&limit&offset
export function listPosts(params, opts) {
  return api.get("/posts", { params, ...opts });
}

// POST /posts (201) | 404 unknown community
export function createPost(payload) {
  return api.post("/posts", payload);
}

// GET /posts/{id}
export function fetchPost(id) {
  return api.get(`/posts/${id}`);
}

// PUT /posts/{id} — author only (403)
export function updatePost(id, payload) {
  return api.put(`/posts/${id}`, payload);
}

// DELETE /posts/{id} — author only, cascades
export function deletePost(id) {
  return api.delete(`/posts/${id}`);
}

// POST /posts/{id}/like — toggle -> { post_id, is_liked, likes_count }
export function toggleLike(id) {
  return api.post(`/posts/${id}/like`);
}

// POST /posts/{id}/comments (201)
export function addComment(postId, payload) {
  return api.post(`/posts/${postId}/comments`, payload);
}

// DELETE /posts/{postId}/comments/{commentId} — comment author only
export function deleteComment(postId, commentId) {
  return api.delete(`/posts/${postId}/comments/${commentId}`);
}
