# Architecture Decision Records (ADR) — HobbyHive

## ADR-001: FastAPI for Backend Framework
- **Date:** 2026-09-29
- **Status:** Accepted
- **Context:** The frontend is built in React 19 / Vite. We need a performant, typed backend for authentication, community management, feed generation, and event RSVPs.
- **Decision:** Use **FastAPI (Python)** with Pydantic v2 and SQLAlchemy 2.0.
- **Consequences:** 
  - High execution performance with automatic OpenAPI documentation.
  - Strict type validation on all incoming payload requests.
  - Keep architecture pragmatic: simple 3-tier layer (`api/` -> `services/` -> `models/`). No repositories, CQRS, or external message queues for MVP.

---

## ADR-002: JWT Stateless Authentication (No Refresh Tokens for MVP)
- **Date:** 2026-09-29
- **Status:** Accepted
- **Context:** Need an authentication scheme that is simple, secure, and works smoothly with a single-page application (SPA) client without overcomplicating token rotation for MVP.
- **Decision:** Use single JWT Access Tokens signed with `HS256` secret, passed via `Authorization: Bearer <token>` headers with a **7-day expiration period**. No refresh tokens will be implemented for MVP.
- **Consequences:**
  - Stateless auth eliminates server-side session stores and complex rotation logic.
  - When the 7-day token expires, the client receives `401 Unauthorized` and prompts re-login.

---

## ADR-003: Alembic Migrations with SQLite (Dev) and PostgreSQL (Prod)
- **Date:** 2026-09-29
- **Status:** Accepted
- **Context:** Need zero-configuration local development while preserving clean schema evolution and seamless production migration to PostgreSQL.
- **Decision:** Use **Alembic migrations** from day one rather than `Base.metadata.create_all()`.
  - Schema workflow: SQLAlchemy Models → Alembic Migrations (`alembic revision --autogenerate`) → Apply to SQLite (`hobbyhive.db`) in Dev → Apply to PostgreSQL in Prod.
- **Consequences:**
  - Zero-drift database schemas.
  - Predictable, version-controlled table creations and index modifications.
