"""Phase 3 verification: Communities, Posts & Events backend (TASK-009/010/011)."""
from datetime import datetime, timedelta, timezone


def _signup(client, username, email):
    res = client.post(
        "/api/v1/auth/signup",
        json={"username": username, "name": username, "email": email, "password": "password123"},
    )
    assert res.status_code == 201
    return res.json()["access_token"]


def _headers(token):
    return {"Authorization": f"Bearer {token}"}


def _make_community(client, headers, name="Pottery Club"):
    res = client.post(
        "/api/v1/communities",
        json={"name": name, "description": "All about clay", "category": "Crafts"},
        headers=headers,
    )
    assert res.status_code == 201
    return res.json()


def test_communities_crud_and_membership(client):
    token_a = _signup(client, "alice_c", "alice_c@test.com")
    token_b = _signup(client, "bob_c", "bob_c@test.com")
    hA, hB = _headers(token_a), _headers(token_b)

    comm = _make_community(client, hA)
    cid = comm["id"]
    assert comm["is_member"] is True
    assert comm["members_count"] == 1

    # Duplicate name (case-insensitive) -> 409
    dup = client.post(
        "/api/v1/communities",
        json={"name": "pottery club", "description": "dup", "category": "Crafts"},
        headers=hB,
    )
    assert dup.status_code == 409

    # Public listing works without auth
    listing = client.get("/api/v1/communities")
    assert listing.status_code == 200
    assert len(listing.json()) == 1

    # Non-owner edit -> 403, owner edit succeeds
    assert client.put(f"/api/v1/communities/{cid}", json={"description": "x"}, headers=hB).status_code == 403
    ok = client.put(f"/api/v1/communities/{cid}", json={"description": "Updated"}, headers=hA)
    assert ok.status_code == 200 and ok.json()["description"] == "Updated"

    # Join is idempotent
    assert client.post(f"/api/v1/communities/{cid}/join", headers=hB).status_code == 200
    again = client.post(f"/api/v1/communities/{cid}/join", headers=hB)
    assert again.status_code == 200 and again.json()["members_count"] == 2

    # Leave works; owner cannot leave without transfer
    left = client.post(f"/api/v1/communities/{cid}/leave", headers=hB)
    assert left.status_code == 200 and left.json()["is_member"] is False
    assert client.post(f"/api/v1/communities/{cid}/leave", headers=hA).status_code == 400

    # Non-owner delete blocked; missing community -> 404
    assert client.delete(f"/api/v1/communities/{cid}", headers=hB).status_code == 403
    assert client.get("/api/v1/communities/9999").status_code == 404


def test_posts_likes_comments(client):
    token_a = _signup(client, "alice_p", "alice_p@test.com")
    token_b = _signup(client, "bob_p", "bob_p@test.com")
    hA, hB = _headers(token_a), _headers(token_b)
    cid = _make_community(client, hA, name="Photo Hive")["id"]
    client.post(f"/api/v1/communities/{cid}/join", headers=hB)

    # Unknown community -> 404
    bad = client.post(
        "/api/v1/posts",
        json={"title": "t", "content": "c", "community_id": 9999},
        headers=hA,
    )
    assert bad.status_code == 404

    post = client.post(
        "/api/v1/posts",
        json={"title": "First shot", "content": "Look!", "community_id": cid},
        headers=hA,
    ).json()
    pid = post["id"]

    # Author-only edit
    assert client.put(f"/api/v1/posts/{pid}", json={"title": "x"}, headers=hB).status_code == 403
    edited = client.put(f"/api/v1/posts/{pid}", json={"title": "First shot v2"}, headers=hA)
    assert edited.status_code == 200 and edited.json()["title"] == "First shot v2"

    # Like toggle
    like1 = client.post(f"/api/v1/posts/{pid}/like", headers=hB)
    assert like1.json()["is_liked"] is True and like1.json()["likes_count"] == 1
    like2 = client.post(f"/api/v1/posts/{pid}/like", headers=hB)
    assert like2.json()["is_liked"] is False and like2.json()["likes_count"] == 0

    # Comments: create + author-only delete
    c1 = client.post(f"/api/v1/posts/{pid}/comments", json={"content": "Nice!"}, headers=hB)
    assert c1.status_code == 201
    cmid = c1.json()["id"]
    assert client.post(f"/api/v1/posts/{pid}/comments", json={"content": "Thanks!"}, headers=hA).status_code == 201
    assert client.delete(f"/api/v1/posts/{pid}/comments/{cmid}", headers=hA).status_code == 403
    assert client.delete(f"/api/v1/posts/{pid}/comments/{cmid}", headers=hB).status_code == 204

    # Author-only delete; deleted post -> 404
    assert client.delete(f"/api/v1/posts/{pid}", headers=hB).status_code == 403
    assert client.delete(f"/api/v1/posts/{pid}", headers=hA).status_code == 204
    assert client.get(f"/api/v1/posts/{pid}").status_code == 404


def test_events_rsvp(client):
    token_a = _signup(client, "alice_e", "alice_e@test.com")
    token_b = _signup(client, "bob_e", "bob_e@test.com")
    hA, hB = _headers(token_a), _headers(token_b)
    cid = _make_community(client, hA, name="Kiln Hive")["id"]
    future = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()

    event = client.post(
        "/api/v1/events",
        json={"title": "Kiln Night", "description": "Fire pots", "starts_at": future,
              "location": "Studio 5", "community_id": cid},
        headers=hA,
    )
    assert event.status_code == 201
    eid = event.json()["id"]

    # Past event rejected
    past = (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()
    assert client.post(
        "/api/v1/events",
        json={"title": "Old", "description": "x", "starts_at": past,
              "location": "y", "community_id": cid},
        headers=hA,
    ).status_code == 400

    # Creator-only edit/delete
    assert client.put(f"/api/v1/events/{eid}", json={"location": "x"}, headers=hB).status_code == 403
    assert client.delete(f"/api/v1/events/{eid}", headers=hB).status_code == 403

    # RSVP upsert (no duplicates) + counts
    assert client.post(f"/api/v1/events/{eid}/rsvp", json={"status": "interested"}, headers=hB).status_code == 200
    assert client.post(f"/api/v1/events/{eid}/rsvp", json={"status": "going"}, headers=hB).status_code == 200
    detail = client.get(f"/api/v1/events/{eid}", headers=hB).json()
    assert detail["going_count"] == 1 and detail["user_rsvp_status"] == "going"

    # Cancel + double-cancel 404
    assert client.delete(f"/api/v1/events/{eid}/rsvp", headers=hB).status_code == 204
    assert client.delete(f"/api/v1/events/{eid}/rsvp", headers=hB).status_code == 404

    assert client.delete(f"/api/v1/events/{eid}", headers=hA).status_code == 204
    assert client.get(f"/api/v1/events/{eid}").status_code == 404


def test_community_delete_cascades(client):
    token_a = _signup(client, "alice_k", "alice_k@test.com")
    hA = _headers(token_a)
    cid = _make_community(client, hA, name="Cascade Hive")["id"]
    future = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()

    pid = client.post(
        "/api/v1/posts", json={"title": "t", "content": "c", "community_id": cid}, headers=hA
    ).json()["id"]
    eid = client.post(
        "/api/v1/events",
        json={"title": "E", "description": "d", "starts_at": future,
              "location": "L", "community_id": cid},
        headers=hA,
    ).json()["id"]

    assert client.delete(f"/api/v1/communities/{cid}", headers=hA).status_code == 204
    assert client.get(f"/api/v1/posts/{pid}").status_code == 404
    assert client.get(f"/api/v1/events/{eid}").status_code == 404
