def test_signup_success(client):
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "username": "ishika_dev",
            "name": "Ishika Gupta",
            "email": "ishika@example.com",
            "password": "strongPassword123!"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["username"] == "ishika_dev"
    assert data["user"]["email"] == "ishika@example.com"
    assert "hashed_password" not in data["user"]


def test_signup_duplicate_email(client):
    payload = {
        "username": "user1",
        "name": "User One",
        "email": "duplicate@example.com",
        "password": "password123"
    }
    res1 = client.post("/api/v1/auth/signup", json=payload)
    assert res1.status_code == 201

    payload["username"] = "user2"
    res2 = client.post("/api/v1/auth/signup", json=payload)
    assert res2.status_code == 409
    assert "email already exists" in res2.json()["detail"]


def test_signup_duplicate_username(client):
    payload1 = {
        "username": "samename",
        "name": "User One",
        "email": "user1@example.com",
        "password": "password123"
    }
    res1 = client.post("/api/v1/auth/signup", json=payload1)
    assert res1.status_code == 201

    payload2 = {
        "username": "samename",
        "name": "User Two",
        "email": "user2@example.com",
        "password": "password123"
    }
    res2 = client.post("/api/v1/auth/signup", json=payload2)
    assert res2.status_code == 409
    assert "username is already taken" in res2.json()["detail"]


def test_signup_invalid_username_regex(client):
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "username": "invalid username with spaces!",
            "name": "Invalid User",
            "email": "invalid@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 422


def test_login_success_and_wrong_password(client):
    # Signup
    client.post(
        "/api/v1/auth/signup",
        json={
            "username": "johndoe",
            "name": "John Doe",
            "email": "john@example.com",
            "password": "mysecretpassword"
        }
    )

    # Valid login
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "john@example.com", "password": "mysecretpassword"}
    )
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

    # Invalid password
    bad_login = client.post(
        "/api/v1/auth/login",
        json={"email": "john@example.com", "password": "wrongpassword"}
    )
    assert bad_login.status_code == 401


def test_get_me_protected_route(client):
    # Register & get token
    signup_res = client.post(
        "/api/v1/auth/signup",
        json={
            "username": "authuser",
            "name": "Auth User",
            "email": "auth@example.com",
            "password": "password123"
        }
    )
    token = signup_res.json()["access_token"]

    # Request without token -> 401
    unauth_res = client.get("/api/v1/auth/me")
    assert unauth_res.status_code == 401

    # Request with invalid token -> 401
    bad_token_res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer bad.token.here"}
    )
    assert bad_token_res.status_code == 401

    # Request with valid token -> 200
    auth_res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert auth_res.status_code == 200
    assert auth_res.json()["username"] == "authuser"


def test_user_profile_and_hobbies_onboarding(client):
    # Register user
    signup_res = client.post(
        "/api/v1/auth/signup",
        json={
            "username": "hobbyist1",
            "name": "Hobbyist One",
            "email": "hobbyist1@example.com",
            "password": "password123"
        }
    )
    token = signup_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch hobbies list
    hobbies_res = client.get("/api/v1/users/hobbies")
    assert hobbies_res.status_code == 200
    hobbies = hobbies_res.json()
    assert len(hobbies) >= 5

    # Select 2 hobbies for onboarding
    selected_ids = [hobbies[0]["id"], hobbies[1]["id"]]
    save_hobbies_res = client.post(
        "/api/v1/users/hobbies",
        headers=headers,
        json={"hobby_ids": selected_ids}
    )
    assert save_hobbies_res.status_code == 200
    saved_user = save_hobbies_res.json()
    assert len(saved_user["hobbies"]) == 2

    # Update profile
    update_res = client.put(
        "/api/v1/users/profile",
        headers=headers,
        json={"bio": "Passionate about mechanical keyboards and coffee.", "name": "Updated Name"}
    )
    assert update_res.status_code == 200
    profile_data = update_res.json()
    assert profile_data["bio"] == "Passionate about mechanical keyboards and coffee."
    assert profile_data["name"] == "Updated Name"
    assert profile_data["posts_count"] == 0
    assert profile_data["joined_communities_count"] == 0
