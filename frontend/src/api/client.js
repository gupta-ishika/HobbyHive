// Central API client for the HobbyHive backend.
//
// Base URL resolution (per RULES: never hardcode backend URLs):
//   1. `import.meta.env.VITE_API_URL` when set (e.g. production)
//   2. Otherwise the Vite dev proxy (`/api` -> http://127.0.0.1:8000, see vite.config.js)
const API_BASE = import.meta.env.VITE_API_URL || "/api/v1";

export const TOKEN_KEY = "hobbyhive-token";
export const UNAUTHORIZED_EVENT = "hobbyhive:unauthorized";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(status, detail) {
    super(detail);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

function buildUrl(path, params) {
  let url = `${API_BASE}${path}`;
  if (params) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") qs.append(key, value);
    }
    const query = qs.toString();
    if (query) url += `?${query}`;
  }
  return url;
}

async function request(path, { method = "GET", body, auth = true, params, signal } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(buildUrl(path, params), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    // === ABORT PASSTHROUGH (Fix 10 abort-contract) ===
    // Cancellation is not a failure: rethrow AbortError unwrapped so callers
    // can distinguish it from ApiError. It must NOT clear auth or fire the
    // 401 logout path (an aborted request produces no response at all).
    if (err?.name === "AbortError") throw err;
    throw new ApiError(0, "Could not reach the server. Is the backend running?");
  }

  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const raw = data?.detail ?? `Request failed (${res.status})`;
    const detail = Array.isArray(raw)
      ? raw.map((d) => (typeof d === "object" ? d.msg ?? JSON.stringify(d) : d)).join(", ")
      : typeof raw === "object"
        ? JSON.stringify(raw)
        : String(raw);

    if (res.status === 401 && auth) {
      // Session expired / invalid: drop the token and let AuthContext log out.
      setToken(null);
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    throw new ApiError(res.status, detail);
  }

  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};
