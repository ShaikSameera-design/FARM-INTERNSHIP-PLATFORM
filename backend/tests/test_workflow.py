"""End-to-end workflow tests against the real FastAPI app and a real (temporary) database."""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models.all_models import User
from app.auth import hash_password

client = TestClient(app)
PW = "Passw0rd!x"


def register(role, name, email, institution=""):
    r = client.post("/api/auth/register", json={"name": name, "email": email, "password": PW, "role": role, "institution": institution})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['token']}"}, r.json()["user"]


@pytest.fixture(scope="module")
def world():
    s, su = register("student", "Sam Student", "sam@t.io", "Test College")
    s2, su2 = register("student", "Sue Student", "sue@t.io", "Test College")
    f, fu = register("farmer", "Fay Farmer", "fay@t.io")
    c, cu = register("college", "Test College", "col@t.io", "Test College")
    db = SessionLocal()
    db.add(User(name="Root", email="root@t.io", password_hash=hash_password(PW), role="admin", verified=True, active=True))
    db.commit(); db.close()
    a = client.post("/api/auth/login", json={"email": "root@t.io", "password": PW}).json()
    return dict(s=s, su=su, s2=s2, su2=su2, f=f, fu=fu, c=c, cu=cu, a={"Authorization": f"Bearer {a['token']}"})


def test_full_workflow(world):
    w = world
    # farmer publishes ONE opening
    i = client.post("/api/internships", headers=w["f"], json={"title": "Field Intern", "openings": 1, "description": "x"}).json()
    # student applies (and cannot apply twice)
    r = client.post("/api/applications", headers=w["s"], json={"internship_id": i["id"], "cover_letter": "hi"})
    assert r.status_code == 200
    aid = r.json()["id"]
    assert client.post("/api/applications", headers=w["s"], json={"internship_id": i["id"]}).status_code == 409
    client.post("/api/applications", headers=w["s2"], json={"internship_id": i["id"]})
    # farmer sees applicants; other roles cannot decide
    assert any(a["id"] == aid for a in client.get("/api/applications", headers=w["f"]).json())
    assert client.patch(f"/api/applications/{aid}", headers=w["s"], json={"status": "Selected"}).status_code == 403
    assert client.patch(f"/api/applications/{aid}", headers=w["f"], json={"status": "Shortlisted"}).status_code == 200
    # select -> real placement
    r = client.patch(f"/api/applications/{aid}", headers=w["f"], json={"status": "Selected"})
    assert r.status_code == 200 and r.json()["placement"]["status"] == "Active"
    pl = client.get("/api/placements", headers=w["f"]).json()
    assert len(pl) == 1
    # over-hiring blocked, internship auto-marked Filled
    aid2 = [a for a in client.get("/api/applications", headers=w["f"]).json() if a["student"]["email"] == "sue@t.io"][0]["id"]
    assert client.patch(f"/api/applications/{aid2}", headers=w["f"], json={"status": "Selected"}).status_code == 409
    assert client.get("/api/internships?status=all", headers=w["f"]).json()[0]["status"] == "Filled"
    # student sees Selected + notification; college of same institution sees the student
    assert client.get("/api/applications", headers=w["s"]).json()[0]["status"] == "Selected"
    assert any("selected" in n["title"].lower() for n in client.get("/api/notifications", headers=w["s"]).json())
    assert client.get("/api/college/students", headers=w["c"]).json()["students"][0]["selected"] == 1
    # tasks: only for placed students
    pid = pl[0]["id"]
    assert client.post("/api/tasks", headers=w["f"], json={"internship_id": i["id"], "student_id": w["su2"]["id"], "title": "Nope"}).status_code == 403
    t = client.post("/api/tasks", headers=w["f"], json={"placement_id": pid, "title": "Soil report"}).json()
    # student progress (the original build crashed here)
    r = client.patch(f"/api/tasks/{t['id']}", headers=w["s"], json={"progress": 60})
    assert r.status_code == 200 and r.json()["status"] == "In Progress"
    assert client.patch(f"/api/tasks/{t['id']}", headers=w["s2"], json={"progress": 10}).status_code == 403
    assert client.patch(f"/api/tasks/{t['id']}", headers=w["s"], json={"progress": 100}).json()["status"] == "Completed"
    # evaluations by farmer and by college; unplaced student cannot be evaluated
    assert client.post("/api/evaluations", headers=w["f"], json={"placement_id": pid, "rating": 5, "feedback": "great"}).status_code == 200
    assert client.post("/api/evaluations", headers=w["c"], json={"placement_id": pid, "rating": 4, "feedback": "good"}).status_code == 200
    assert client.post("/api/evaluations", headers=w["f"], json={"student_id": w["su2"]["id"], "internship_id": i["id"], "rating": 5, "feedback": "x y z"}).status_code == 404
    assert len(client.get("/api/evaluations", headers=w["s"]).json()) == 2
    # terminating the placement frees the opening
    assert client.patch(f"/api/placements/{pid}", headers=w["f"], json={"status": "Terminated"}).status_code == 200
    assert client.get("/api/internships?status=all", headers=w["f"]).json()[0]["status"] == "Active"
    rep = client.get("/api/reports", headers=w["f"]).json()
    assert rep["evaluations"] == 2 and rep["completed_tasks"] == 1


def test_authorization(world):
    w = world
    assert client.get("/api/applications").status_code == 401
    assert client.post("/api/internships", headers=w["s"], json={"title": "Nope"}).status_code == 403
    assert client.get("/api/admin/users", headers=w["f"]).status_code == 403
    assert client.get("/api/admin/users", headers=w["a"]).status_code == 200
    assert client.post("/api/messages", headers=w["s"], json={"recipient_id": 99999, "body": "x"}).status_code == 403


def test_messages_and_calls(world):
    w = world
    r = client.post("/api/messages", headers=w["s"], json={"recipient_id": w["fu"]["id"], "body": "hello"})
    assert r.status_code == 200
    cid = r.json()["conversation_id"]
    assert client.post("/api/messages", headers=w["s"], json={"recipient_id": w["fu"]["id"], "body": "again"}).json()["conversation_id"] == cid
    assert client.get("/api/poll", headers=w["f"]).json()["messages"] == 2
    assert client.post("/api/messages", headers=w["s2"], json={"conversation_id": cid, "body": "intruder"}).status_code == 403
    call = client.post("/api/calls", headers=w["s"], json={"recipient_id": w["fu"]["id"], "kind": "video"}).json()
    assert client.get("/api/calls/incoming", headers=w["f"]).json()["id"] == call["id"]
    assert client.post(f"/api/calls/{call['id']}/respond", headers=w["f"], json={"action": "accept"}).json()["status"] == "accepted"
    with pytest.raises(Exception):  # unauthenticated websocket is rejected
        with client.websocket_connect(f"/ws/call/{cid}?token=bad") as ws:
            ws.receive_json()
    tok = w["s"]["Authorization"].split()[1]
    with client.websocket_connect(f"/ws/call/{cid}?token={tok}") as ws:
        assert ws.receive_json()["type"] == "peers"


def test_password_reset_and_profile(world):
    w = world
    # Unregistered email should fail with 404 and clear message
    unreg_res = client.post("/api/auth/forgot-password", json={"email": "unregistered@t.io"})
    assert unreg_res.status_code == 404
    assert "no account is registered" in unreg_res.json()["detail"].lower()

    r = client.post("/api/auth/forgot-password", json={"email": "sue@t.io"}).json()
    token = r["reset_url"].split("token=")[1]
    assert client.post("/api/auth/reset-password", json={"token": token, "password": "weak"}).status_code == 422
    assert client.post("/api/auth/reset-password", json={"token": token, "password": "NewPassw0rd"}).status_code == 200
    assert client.post("/api/auth/reset-password", json={"token": token, "password": "NewPassw0rd"}).status_code == 400
    assert client.get("/api/auth/me", headers=w["s2"]).status_code == 401  # old token invalidated by password change
    assert client.post("/api/auth/login", json={"email": "sue@t.io", "password": "NewPassw0rd", "role": "farmer"}).status_code == 403
    p = client.put("/api/profile", headers=w["s"], json={"headline": "Hi", "skills": "Python", "phone": "+91 99999"}).json()
    assert client.get("/api/profile", headers=w["s"]).json()["skills"] == "Python" == p["skills"]
