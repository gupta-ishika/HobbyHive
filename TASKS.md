# Project Tasks Roadmap — HobbyHive

## Phase 1: Backend Foundation & Database Migrations
- [x] **TASK-001:** Setup `backend/` directory, `requirements.txt` (FastAPI, Uvicorn, SQLAlchemy 2.0, Alembic, Pydantic v2, PyJWT, bcrypt), and virtual environment.
- [x] **TASK-002:** Configure `app/core/config.py` (settings, CORS, 7-day JWT secret) and `app/core/database.py` (SQLAlchemy engine & sessionmaker).
- [x] **TASK-003:** Create SQLAlchemy Models with cascading relationships (`User`, `Hobby`, `Community`, `CommunityMember`, `Post`, `Comment`, `PostLike`, `Event`, `EventRsvp`).
- [x] **TASK-004:** Initialize Alembic (`alembic init alembic`), configure `env.py` with SQLAlchemy `Base.metadata`, and generate initial migration (`alembic revision --autogenerate -m "initial_schema"`). Apply migration to SQLite.
- [x] **TASK-005:** Create Pydantic v2 Schemas for request/response DTOs.

## Phase 2: Authentication & User Profile
- [ ] **TASK-006:** Implement password hashing (`bcrypt`, work factor: 12), JWT generation (`PyJWT`, 7-day single access token), and `get_current_user` dependency (`deps.py`).
- [ ] **TASK-007:** Implement Auth API endpoints (`POST /api/v1/auth/signup` with 409 duplicate check, `POST /api/v1/auth/login` with 401 check, `GET /api/v1/auth/me`).
- [ ] **TASK-008:** Implement User & Onboarding API endpoints (`GET/PUT /api/v1/users/profile`, `POST /api/v1/users/hobbies`).

## Phase 3: Communities, Posts & Events Backend
- [ ] **TASK-009:** Implement Communities Service & API (`GET/POST /api/v1/communities`, `GET/PUT/DELETE /api/v1/communities/{id}` with owner-only checks, `POST /api/v1/communities/{id}/join`, `POST /api/v1/communities/{id}/leave`).
- [ ] **TASK-010:** Implement Posts & Feed Service & API (`GET/POST /api/v1/posts`, `DELETE /api/v1/posts/{id}` with author-only checks, `POST /api/v1/posts/{id}/like` toggle endpoint, `POST/DELETE /api/v1/posts/{id}/comments`).
- [ ] **TASK-011:** Implement Events Service & API (`GET/POST /api/v1/events`, `DELETE /api/v1/events/{id}` with creator-only checks, `POST /api/v1/events/{id}/rsvp`, `DELETE /api/v1/events/{id}/rsvp`).

## Phase 4: Frontend API Integration & Data Sync
- [ ] **TASK-012:** Create Frontend API Client (`frontend/src/api/client.js`) and endpoint modules (`auth.js`, `communities.js`, `posts.js`, `events.js`, `users.js`).
- [ ] **TASK-013:** Connect `AuthContext.jsx` with real backend auth endpoints, store 7-day JWT in `localStorage`, and handle 401 auto-logout.
- [ ] **TASK-014:** Wire up Onboarding (`HobbySelectionMinimal.jsx`) with backend user hobbies endpoint.
- [ ] **TASK-015:** Wire up Feed page with real backend posts and likes toggle/comment submission.
- [ ] **TASK-016:** Wire up Communities & Community Details pages with real join/leave actions.
- [ ] **TASK-017:** Wire up Events page with real RSVP functionality.
- [ ] **TASK-018:** Wire up Profile page with dynamic user statistics and activity.

## Phase 5: Verification & Quality Assurance
- [ ] **TASK-019:** Run authorization edge-case test suite (User A vs User B permissions, duplicate constraints, cascade deletes).
- [ ] **TASK-020:** Final end-to-end audit (Signup -> Onboarding -> Feed -> Communities -> Events -> Profile) and responsive check.
