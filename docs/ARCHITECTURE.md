# System Architecture — HobbyHive

## 1. High-Level Architecture Overview

```
                   ┌──────────────────────────────────────┐
                   │          React 19 + Vite UI          │
                   │ (Tailwind CSS v4, React Router v7)   │
                   └──────────────────┬───────────────────┘
                                      │ HTTP / REST (JSON) + Bearer JWT
                                      ▼
                   ┌──────────────────────────────────────┐
                   │         FastAPI Backend Server       │
                   │  - CORS Middleware                  │
                   │  - Single 7-Day Access Token Auth    │
                   │  - Pydantic v2 Request/Response      │
                   └──────────────────┬───────────────────┘
                                      │ SQLAlchemy 2.0 ORM (via Alembic)
                                      ▼
                   ┌──────────────────────────────────────┐
                   │        Database (SQLite / PG)        │
                   │  - Versioned by Alembic Migrations   │
                   │  - Users, Communities, Posts,        │
                   │    Comments, Events, RSVPs           │
                   └──────────────────────────────────────┘
```

---

## 2. Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router v7 | Fast client, modern styling, snappy SPA navigation |
| **Backend** | Python 3.10+, FastAPI, Uvicorn | High performance, auto-generated OpenAPI docs, robust Pydantic data validation |
| **ORM & Migrations** | SQLAlchemy 2.0 + Alembic | Strict relational integrity, declarative models, reproducible migrations |
| **Database** | SQLite (Dev) / PostgreSQL (Prod) | Zero setup in dev, seamless transition in production via Alembic |
| **Password Hashing** | `bcrypt` (work factor: 12) | Direct, modern, and reliable cryptographic password hashing |
| **JWT Authentication** | `PyJWT` (algorithm: `HS256`) | Industry standard, lightweight token encoding and validation |
| **Data Validation** | Pydantic v2 | Type safety, request payload validation, and clean serialization |

---

## 3. Project Directory Structure

```
HobbyHive/
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN.md
│   ├── DECISIONS.md
│   ├── MEMORY.md
│   ├── TEST_PLAN.md
│   └── SECURITY.md
├── RULES.md
├── TASKS.md
├── README.md
├── .env.example
├── .gitignore
├── backend/
│   ├── alembic/                     # Alembic migration scripts
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   ├── alembic.ini
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py              # Auth & DB session dependencies
│   │   │   └── v1/
│   │   │       ├── auth.py          # /api/v1/auth (signup, login, me)
│   │   │       ├── users.py         # /api/v1/users (profiles, hobbies)
│   │   │       ├── communities.py   # /api/v1/communities (crud, join, leave)
│   │   │       ├── posts.py         # /api/v1/posts (feed, likes, comments)
│   │   │       ├── events.py        # /api/v1/events (crud, rsvp)
│   │   │       └── router.py        # Combined v1 API router
│   │   ├── core/
│   │   │   ├── config.py            # Pydantic Settings & env configuration
│   │   │   ├── database.py          # SQLAlchemy engine & sessionmaker
│   │   │   └── security.py          # bcrypt password hashing & PyJWT token handlers
│   │   ├── models/                  # SQLAlchemy ORM Models
│   │   │   ├── user.py
│   │   │   ├── community.py
│   │   │   ├── post.py
│   │   │   ├── event.py
│   │   │   └── associations.py
│   │   ├── schemas/                 # Pydantic v2 Schemas (DTOs)
│   │   │   ├── user.py
│   │   │   ├── community.py
│   │   │   ├── post.py
│   │   │   └── event.py
│   │   ├── services/                # Business logic & ORM operations
│   │   │   ├── user_service.py
│   │   │   ├── community_service.py
│   │   │   ├── post_service.py
│   │   │   └── event_service.py
│   │   └── main.py                  # Application entry point
│   ├── requirements.txt
│   └── tests/
└── frontend/
    ├── src/
    │   ├── api/                     # Axios / Fetch client modules
    │   ├── components/              # UI components
    │   ├── contexts/                # AuthContext
    │   ├── pages/                   # Route views
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## 4. Architectural Invariants & Anti-Overengineering Constraints

1. **Pragmatic 3-Tier Layering:**
   - **Routes (`app/api/`)**: Accept HTTP requests, parse Pydantic DTOs, call services, and return responses.
   - **Services (`app/services/`)**: Contain all business logic and execute SQLAlchemy ORM queries directly.
   - **Models & Schemas (`app/models/`, `app/schemas/`)**: Define DB entities and serialization contracts.
2. **Strict Anti-Overengineering Rule:**
   - **Do NOT introduce:** Repositories layer, CQRS, event buses, microservices, Redis caching, Celery workers, WebSockets, or background job queues. Keep the architecture direct, clean, and maintainable.
3. **Database Migrations:**
   - Never call `Base.metadata.create_all()` in production code. All table creation and schema modifications must be executed via **Alembic migration revisions**.
4. **Stateless 7-Day Access Token:**
   - Single access token via `PyJWT`. No refresh tokens or token blacklist database tables for MVP. Simple bearer token auth decoded via `get_current_user`.
