# Development Rules & AI Guardrails

## 1. General Principles
- **Clarity over cleverness:** Write clean, self-documenting code with explicit typing.
- **Maintain Modular Architecture:** Keep route handlers, business logic (services), and data persistence (models/schemas) strictly separated.
- **Do not modify unrelated code:** When completing a task, focus strictly on the files relevant to the current task.
- **Preserve design consistency:** Strictly adhere to the design tokens in `docs/DESIGN.md`.

---

## 2. Anti-Overengineering Rule (CRITICAL)
- **Do NOT introduce:**
  - Generic Repository layer patterns or Unit of Work wrappers.
  - CQRS, Event Sourcing, or Event Buses.
  - Microservices, Redis, Celery, RabbitMQ, Kafka, or background worker queues.
  - WebSockets or complex pub/sub systems.
  - Multiple token rotation / refresh token mechanisms (MVP strictly uses single 7-day JWT access tokens).
- Keep code straightforward: `API route` -> `Service function (ORM query)` -> `Return Pydantic DTO`.

---

## 3. Backend Rules (FastAPI / Python)
- **Migrations:** Always manage database schema changes using **Alembic migrations** (`alembic revision --autogenerate`, `alembic upgrade head`). Never use `Base.metadata.create_all()` in runtime app code.
- **Password Hashing:** Use direct `bcrypt` library (`bcrypt.hashpw` / `bcrypt.checkpw`, work factor: 12).
- **JWT Handling:** Use standard `PyJWT` library (algorithm: `HS256`, 7-day expiration).
- **Validation:** Always use **Pydantic v2 schemas** for request validation and response serialization.
- **Authentication:** Protect private routes using the `get_current_user` FastAPI dependency in `app/api/deps.py`.
- **Ownership Checks:** Always verify that `current_user.id` owns the entity before permitting update or delete operations.
- **Status Codes:** Return appropriate HTTP status codes (201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity).

---

## 4. Frontend Rules (React 19 / Vite / Tailwind)
- Use standard React hooks (`useState`, `useEffect`, `useContext`, `useCallback`).
- Centralize API calls in dedicated API service helper modules (`src/api/`).
- Never hardcode backend URLs; use `import.meta.env.VITE_API_URL` or configured Vite proxy (`/api`).
- Maintain full responsiveness (mobile, tablet, desktop) across all views.
- Ensure all interactive actions provide immediate visual feedback (loading spinners, disabled buttons, toast notifications).

---

## 5. Security & Safety
- **Never commit `.env` or sensitive secrets to git.**
- Store password hashes securely using `bcrypt` (never plaintext).
- Verify ownership of resources on update/delete operations (e.g., users can only edit/delete their own posts/comments/communities).

---

## 6. Workflow Execution
- Execute tasks one at a time following `TASKS.md`.
- Mark completed tasks with `[x]` as soon as they are tested and verified.
- Update `docs/MEMORY.md` whenever transitioning between major feature tasks.
