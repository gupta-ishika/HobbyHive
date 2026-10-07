# Project Memory & Active State — HobbyHive

## Current Project Status
- **Current Phase:** Phase 2 (Authentication & User Profile Backend)
- **Active Task:** Ready to begin `TASK-006`
- **Frontend Status:** React 19 + Vite + Tailwind v4 UI views completed with mock static data.
- **Backend Status:** Phase 1 complete and updated with model specifications. Database engine, Alembic migrations (`2926323a790d_initial_schema_v2.py`), SQLAlchemy models, Pydantic v2 schemas, and FastAPI entry point initialized and verified.

---

## Architectural & Model 
 Established
- **User Model:** `username` (indexed, unique, 3-20 chars regex validated), `bio` (String 200), `DateTime(timezone=True)`, `passive_deletes=True` on posts and comments for DB-level `SET NULL`.
- **Hobby Model:** `name`, `normalized_name` (indexed, unique), nullable `icon`, and `image_url`.
- **Community Model:** `name` (String 50), `normalized_name` (indexed, unique), `description` (String 1000), `creator_id` with `ondelete="RESTRICT"`, `CheckConstraint("length(name) >= 3")`, and timezone-aware timestamps.
- **Post & Comment Models:** Nullable `author_id` with `ondelete="SET NULL"` (frontend displays "Deleted User"), `Post.content` (String 2000), `Comment.content` (String 500), `parent_comment_id` for nested comment replies.
- **PostImage Model:** Supports up to 5 images per post with `CheckConstraint("position BETWEEN 0 AND 4")` and `UniqueConstraint("post_id", "position")`.
- **Event Model:** `starts_at` (DateTime with timezone) replacing separate date/time columns.
- **Password Hashing:** Direct `bcrypt` library (work factor: 12).
- **JWT Auth:** `PyJWT` library (algorithm: `HS256`, 7-day single access token, no refresh tokens for MVP).
- **Database:** SQLite (dev) / PostgreSQL (prod) managed via Alembic migrations.

---

## Completed Milestones
- [x] Project documentation suite established & refined (`PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`, `RULES.md`, `TASKS.md`, `DECISIONS.md`, `TEST_PLAN.md`, `SECURITY.md`, `.env.example`, `README.md`).
- [x] **Phase 1 Complete:**
  - `TASK-001`: Setup `backend/` structure, `requirements.txt`, and virtual environment.
  - `TASK-002`: Configured `app/core/config.py` and `app/core/database.py`.
  - `TASK-003`: Created updated SQLAlchemy models with cascading foreign keys and constraints.
  - `TASK-004`: Initialized Alembic, generated updated migration (`2926323a790d_initial_schema_v2.py`), and applied to database.
  - `TASK-005`: Created Pydantic v2 DTO schemas with regex validation for usernames and length bounds.

---

## Immediate Next Step
- Execute `TASK-006`: Implement password hashing (`bcrypt`), JWT generation (`PyJWT`, 7-day single access token), and `get_current_user` auth dependency in `app/api/deps.py`.
