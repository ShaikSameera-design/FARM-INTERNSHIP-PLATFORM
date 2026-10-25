from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
PW = "Passw0rd!x"


def reg(role, name, email):
    r = client.post("/api/auth/register", json={"name": name, "email": email, "password": PW, "role": role, "institution": "Test College"})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['token']}"}


def test_recommendations():
    s, f = reg("student", "Rec Student", "rec.s@t.io"), reg("farmer", "Rec Farmer", "rec.f@t.io")
    client.put("/api/profile", headers=s, json={"skills": "drone, soil, python", "headline": "Precision agriculture", "location": "Guntur"})
    client.post("/api/internships", headers=f, json={"title": "Drone Soil Mapping Intern", "category": "Agriculture",
                "description": "Drone imagery and soil sensors", "location": "Guntur", "openings": 2})
    r = client.get("/api/recommendations", headers=s)
    assert r.status_code == 200
    items = r.json()["items"]
    assert items and items[0]["internship"]["title"] == "Drone Soil Mapping Intern"
    assert 0 < items[0]["match"] <= 100 and items[0]["reasons"]
    iid = items[0]["internship"]["id"]
    assert client.post("/api/applications", headers=s, json={"internship_id": iid, "cover_letter": "hi"}).status_code == 200
    assert all(i["internship"]["id"] != iid for i in client.get("/api/recommendations", headers=s).json()["items"])
    assert client.get("/api/recommendations", headers=f).status_code == 403
    assert client.get("/api/recommendations").status_code == 401
