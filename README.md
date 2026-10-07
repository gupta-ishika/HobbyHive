# 🐝 HobbyHive

HobbyHive is a modern, community-driven social platform for hobbyists to discover niche groups, share project progress, RSVP to events, and connect with like-minded creators.

---

## 📁 Project Architecture & Docs

This repository is organized following structured documentation practices:

- 📄 [PRD.md](file:///c:/Users/gishi/coding/HobbyHive/docs/PRD.md) — Product Requirements, Scope & Objectives
- 🏛️ [ARCHITECTURE.md](file:///c:/Users/gishi/coding/HobbyHive/docs/ARCHITECTURE.md) — Tech Stack & Folder Hierarchy
- 🎨 [DESIGN.md](file:///c:/Users/gishi/coding/HobbyHive/docs/DESIGN.md) — Design Tokens, Typography & Component Standards
- 📜 [RULES.md](file:///c:/Users/gishi/coding/HobbyHive/RULES.md) — Engineering & AI Guardrails
- 📋 [TASKS.md](file:///c:/Users/gishi/coding/HobbyHive/TASKS.md) — Step-by-Step Implementation Roadmap
- 🧠 [MEMORY.md](file:///c:/Users/gishi/coding/HobbyHive/docs/MEMORY.md) — Active Project State & Next Actions
- ⚖️ [DECISIONS.md](file:///c:/Users/gishi/coding/HobbyHive/docs/DECISIONS.md) — Architecture Decision Records (ADRs)
- 🧪 [TEST_PLAN.md](file:///c:/Users/gishi/coding/HobbyHive/docs/TEST_PLAN.md) — Feature Verification Checklist
- 🛡️ [SECURITY.md](file:///c:/Users/gishi/coding/HobbyHive/docs/SECURITY.md) — Security & Authorization Policies

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router v7
- **Backend:** FastAPI (Python 3.10+), Pydantic v2, SQLAlchemy 2.0, Alembic
- **Password Hashing:** `bcrypt` (work factor: 12)
- **Authentication:** `PyJWT` (HS256, 7-day single access token)
- **Database:** SQLite (local dev) / PostgreSQL (production)

---

## 🚀 Getting Started

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```
