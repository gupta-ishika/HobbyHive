# Project Memory & Active State — HobbyHive

## Current Project Status
- **Current Phase:** Phase 5 (Verification & Quality Assurance)
- **Active Task:** Ready to begin `TASK-019`
- **Frontend Status:** React 19 + Vite + Tailwind v4 UI fully wired to live backend (auth, onboarding, feed, communities, events, profile). Mock `src/data/` no longer imported anywhere.
- **Backend Status:** Phase 1, Phase 2 & Phase 3 complete and verified with automated test suite (11/11 passed). Auth, onboarding, communities, posts, and events endpoints fully functional.

---

## Architectural & Model Guarantees Established
- **Password Hashing:** Direct `bcrypt` library (`bcrypt.hashpw` / `bcrypt.checkpw`, work factor: 12).
- **JWT Auth:** `PyJWT` library (`algorithm="HS256"`, 7-day single access token, no refresh tokens for MVP).
- **Auth & Route Protection:** `get_current_user` dependency in `app/api/deps.py` returns 401 on expired/malformed/missing Bearer tokens.
- **Validation:** Username regex validation (`re.fullmatch(r"^[a-zA-Z0-9_]{3,20}$", username)`), email uniqueness check (409 Conflict), and username uniqueness check (409 Conflict).
- **Database:** SQLite (dev) / PostgreSQL (prod) version-controlled via Alembic migrations.

---

## Completed Milestones
- [x] Project documentation suite established & refined (`PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`, `RULES.md`, `TASKS.md`, `DECISIONS.md`, `TEST_PLAN.md`, `SECURITY.md`, `.env.example`, `README.md`).
- [x] **Phase 1 Complete:**
  - `TASK-001`: Setup `backend/` structure, `requirements.txt`, and virtual environment.
  - `TASK-002`: Configured `app/core/config.py` and `app/core/database.py`.
  - `TASK-003`: Created updated SQLAlchemy models with cascading foreign keys and constraints.
  - `TASK-004`: Initialized Alembic, generated migration (`2926323a790d_initial_schema_v2.py`), and applied to database.
  - `TASK-005`: Created Pydantic v2 DTO schemas with regex validation for usernames and length bounds.
- [x] **Phase 2 Complete:**
  - `TASK-006`: Implemented `bcrypt` password hashing (work factor 12), `PyJWT` 7-day access token generation/decoding, and `get_current_user` dependency in `app/api/deps.py`.
  - `TASK-007`: Implemented `/api/v1/auth/signup` (201, 409 duplicate checks), `/api/v1/auth/login` (200, 401 checks), and `/api/v1/auth/me` (200).
  - `TASK-008`: Implemented `/api/v1/users/profile` (GET/PUT), `/api/v1/users/hobbies` (GET/POST), and default hobby seeder.
  - Automated test suite created in `tests/test_auth_and_users.py` (7/7 tests passing).

---

## Immediate Next Step
- Execute `TASK-019`: Run authorization edge-case test suite (User A vs User B permissions, duplicate constraints, cascade deletes).

## Phase 4 Notes (completed 2026-10-07)
- `TASK-012`: Added `src/api/client.js` (fetch wrapper, `VITE_API_URL` → `/api/v1` proxy fallback, `ApiError`, 401 auto-logout event) + `auth/users/communities/posts/events` modules; Vite `/api` proxy in `vite.config.js`; `frontend/.env.example`; `Toast` provider + `timeAgo` utils.
- `TASK-013`: `AuthContext` now uses real signup/login/me, 7-day JWT in `localStorage` (`hobbyhive-token`), session restore, 401 auto-logout; `Login/Signup` show server errors (401/409) with submitting states; `ProtectedRoute` waits for restore.
- `TASK-014`: Onboarding fetches `GET /users/hobbies`, persists via `POST /users/hobbies`, skeletons + error/ retry.
- `TASK-015`: Feed fetches posts/communities/upcoming events; like toggle, nested comments + submit, composer with community picker, joined-community sidebar + joinable suggestions. `PostCard`/`CreatePost` extended backward-compatibly; shared `usePostActions` hook.
- `TASK-016`: Communities list (server search, category chips, pagination, join/leave, create modal); Details (detail/members/posts/events/about tabs, join/leave, composer, 404 handling).
- `TASK-017`: Events (upcoming filter, My-RSVPs filter, Going/Interested toggle + cancel, live counts).
- `TASK-018`: Profile (own + public, live stats, user posts, edit modal, logout).
- Verification: `npm run lint` 0 errors, `npm run build` succeeds, no `src/data/` imports remain.
- `TASK-009`: Added `app/api/v1/communities.py` (list/create/detail/update/delete/join/leave) wired into v1 router; reused existing `community_service.py` (owner-only 403, duplicate-name 409, idempotent join, owner-leave 400).
- `TASK-010`: Added `app/services/post_service.py` + `app/api/v1/posts.py` (feed filters, author-only edit/delete, like toggle, nested comments with parent validation); added `PostUpdate` schema + `CommentResponse.model_rebuild()`.
- `TASK-011`: Added `app/services/event_service.py` + `app/api/v1/events.py` (upcoming/search filters, creator-only edit/delete, RSVP upsert, cancel 404, past-date 400).
- Verification: `tests/test_phase3_communities_posts_events.py` (4 tests) — full suite 11/11 passing, including ownership 403s, idempotent join, like toggle, RSVP update, and cascade deletes.
