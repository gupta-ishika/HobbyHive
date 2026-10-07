# Security & Data Protection Guidelines — HobbyHive

## 1. Authentication & Token Management
- **Password Hashing:** Directly using the `bcrypt` library (`bcrypt.hashpw` / `bcrypt.checkpw` with work factor 12). Plaintext passwords are never stored, logged, or returned in API responses.
- **JWT Encoding/Decoding:** Standard `PyJWT` library.
- **JWT Secret Key:** Configured via `JWT_SECRET_KEY` environment variable (minimum 32-character random string).
- **Access Tokens:** Single stateless JWT access token signed with `HS256`, valid for **7 days** (`ACCESS_TOKEN_EXPIRE_MINUTES=10080`).
- **No Refresh Tokens (MVP):** When the access token expires or is invalid, the backend returns `401 Unauthorized` and the frontend redirects to `/login`.

---

## 2. Authorization & Ownership Checks
- **Resource Ownership:**
  - **Posts:** Only the original author (`post.user_id == current_user.id`) can edit or delete their post.
  - **Comments:** Only the comment author (`comment.user_id == current_user.id`) can delete their comment.
  - **Communities:** Only the community creator / owner (`community.creator_id == current_user.id`) can edit or delete the community.
  - **Profiles:** Users can only update their own profile details.
- **Enforcement:** Enforced at the service layer in FastAPI before executing any database write or delete.

---

## 3. Input Validation & Sanitization
- All request payloads strictly parsed and validated using **Pydantic v2 schemas**.
- String trimming on titles, bios, content, and URLs.
- Email format validation using standard email regex / email validator.

---

## 4. CORS Policy
- Allowed origins explicitly restricted to frontend development and production URLs (`http://localhost:5173`, `http://127.0.0.1:5173`).
- Wildcard `*` origins prohibited in production.

---

## 5. Environment Secrets & Configuration
- Real secret values kept in `.env` (ignored by git).
- Clean template maintained in `.env.example`.
