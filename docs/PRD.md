# Product Requirements Document (PRD) — HobbyHive

## 1. Product Overview
**Product Name:** HobbyHive  
**Tagline:** Connect, share, and collaborate with hobbyists who share your passions.  
**Description:** HobbyHive is a community-driven social platform designed for enthusiasts to discover niche hobby groups, participate in discussions, share visual progress/posts, discover local or virtual events, and build personal hobbyist profiles.

---

## 2. Problem Statement
Hobbyists often struggle to find dedicated, distraction-free spaces to:
1. Connect with like-minded people around specific niche interests (e.g., pottery, mechanical keyboards, urban gardening, retro gaming).
2. Share progress, ask for feedback, and document projects without algorithmic clutter of general social media.
3. Discover and organize local or virtual hobby meetups, workshops, and events.

---

## 3. Target Users
- **Explorers / Beginners:** Looking to pick up a new hobby and seek curated starter communities.
- **Dedicated Hobbyists:** Wanting to post build logs, showcase artwork/crafts, and exchange tips with peers.
- **Community Leaders / Organizers:** Hosting virtual workshops, local meetups, and managing niche clubs.

---

## 4. Core Features & Explicit Business Rules

### 4.1 Authentication & Onboarding
- **Signup / Login:** Email & password authentication. Rejects duplicate emails with `409 Conflict`.
- **Session:** Single stateless JWT access token (HS256, 7-day expiration). No refresh token mechanism for MVP.
- **Onboarding:** Selection of 1 or more hobby tags during onboarding, persisted to user profile.

### 4.2 Communities (Hives)
- **Names & Slugs:** Community names must be unique across the platform.
- **Creation:** Any authenticated user can create a community and becomes its creator/owner.
- **Join / Leave:** 
  - Any authenticated user can join or leave a community.
  - Joining an already-joined community is idempotent (no duplicate memberships).
- **Edit / Delete:** 
  - Only the community creator can edit details or delete the community.
- **Cascade Deletion:** Deleting a community cascades and removes all associated memberships, posts, and events.

### 4.3 Posts & Discussion Feed
- **Post Creation:** Authenticated user can post text + optional image URL + community/hobby tag.
- **Post Edit / Delete:** 
  - Only the post's author can edit or delete their post.
  - Deleting a post cascades and removes all associated likes and comments.
- **Likes / Upvotes:**
  - 1 like per user per post.
  - Clicking like toggles state: if already liked, it unlikes the post (decrementing like count).
- **Comments:**
  - Authenticated user can post comments on any post.
  - User can delete their own comments. Editing comments is out-of-scope for MVP.

### 4.4 Events & Meetups
- **Event Creation:** Authenticated user can schedule an event (title, description, date/time, location/link, community tag).
- **Event Edit / Delete:** Only the event creator can edit or delete their event. Deleting an event cascades and deletes all associated RSVPs.
- **RSVPs:**
  - 1 RSVP per user per event (status: `going` or `interested`).
  - Selecting a new status updates the existing RSVP.
  - User can cancel their RSVP (deleting the record and updating attendee counts).

### 4.5 User Profiles
- Showcase user's selected hobbies, joined communities, and authored posts.
- Users can update only their own profile (name, bio, avatar URL).

---

## 5. MVP Scope vs. Future Roadmap

### In Scope (MVP)
- User Authentication (JWT-based registration, login, profile fetch, 7-day session).
- User Profile management & hobby tag selections.
- Community discovery, creation, details view, and join/leave actions.
- Post feed with creation, pagination/fetching, likes (toggle), and comments (create/delete).
- Community-linked Events listing and RSVP tracking (`going`, `interested`, cancel).
- Search and filtering across communities and posts.
- Alembic database migrations.

### Out of Scope (Post-MVP)
- Refresh token rotation & session blacklisting.
- Real-time WebSockets direct messaging (1-on-1 chats).
- Paid ticketing & Stripe payment integration for events.
- Push notifications on mobile.
- Comment editing.
- Native mobile applications (iOS / Android).

---

## 6. Success Metrics
- Seamless onboarding with < 60s time-to-first-post or join.
- Fast API response times (< 150ms p95 for feed queries).
- 100% data integrity on member joins, RSVPs, and post reactions with cascading deletes.
