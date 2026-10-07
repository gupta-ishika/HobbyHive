# Test Plan — HobbyHive

## 1. Authentication & Session Edge Cases
- [ ] **Signup (Success):** User registers with valid name, email, password; receives 201 + access token.
- [ ] **Duplicate Email:** Signup with existing email returns `409 Conflict`.
- [ ] **Login (Success):** User logs in with valid credentials; receives 200 + 7-day JWT access token.
- [ ] **Invalid Password / Email:** Login with wrong password returns `401 Unauthorized`.
- [ ] **Missing Token:** Requesting protected endpoint without `Authorization` header returns `401 Unauthorized`.
- [ ] **Malformed / Invalid Token:** Requesting with garbage Bearer token returns `401 Unauthorized`.
- [ ] **Expired Token:** Requesting with an expired JWT returns `401 Unauthorized`.

---

## 2. Authorization & Ownership Enforcement
- [ ] **Post Editing/Deletion:** User A cannot update or delete User B's post (returns `403 Forbidden`).
- [ ] **Comment Deletion:** User A cannot delete User B's comment (returns `403 Forbidden`).
- [ ] **Community Management:** User A cannot edit or delete a community created by User B (returns `403 Forbidden`).
- [ ] **Profile Modification:** User A cannot modify User B's profile data (returns `403 Forbidden`).

---

## 3. Duplicate Operations & Idempotency
- [ ] **Community Join:** Joining an already-joined community is idempotent (does not duplicate membership or artificially inflate count).
- [ ] **Post Likes:** Liking a post once increments like count. Liking the same post again acts as a toggle (unlikes, decrements count).
- [ ] **Event RSVPs:** Submitting an RSVP twice for the same event updates the existing status (e.g., from `interested` to `going`) rather than creating a duplicate record.

---

## 4. Database Integrity & Cascading Deletions
- [ ] **Post Deletion Cascade:** When a post is deleted, all associated comments and likes are cleanly removed from the database.
- [ ] **Community Deletion Cascade:** When a community is deleted by its owner, all associated posts, events, and memberships are removed.
- [ ] **Event Deletion Cascade:** When an event is deleted, all associated user RSVPs are removed.

---

## 5. Functional Features Verification
- [ ] **Onboarding:** Saving hobby selections stores tags on user record and filters recommendations.
- [ ] **Feed Fetching:** Feed returns posts in order with accurate like counts, author info, and comments.
- [ ] **Community Discovery:** Can search/filter communities by category and tags.
- [ ] **Event Discovery & RSVP:** Events list shows upcoming dates, location, and RSVP counts accurately.

---

## 6. Responsive & Viewport Verification
- [ ] Mobile Viewport: 375px (iPhone SE)
- [ ] Tablet Viewport: 768px (iPad)
- [ ] Desktop Viewport: 1280px / 1440px
