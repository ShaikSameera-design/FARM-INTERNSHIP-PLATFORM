# FarmIntern Platform 4.0 (Enterprise AgTech Release)

**FarmIntern** is a real-time Operating System for Agricultural Internships, bridging agricultural students, certified farm partners, and academic institutions with verifiable field task execution, dual evaluations, and encrypted communications.

---

## What's New in this Release

1. **Modern, Premium AgTech Landing Page**:
   - **Theme**: Seamless blend of modern agriculture and high-tech telemetry.
   - **Visuals**: Dynamic precision farming command deck featuring SVG illustrations of contoured crop fields, automated smart greenhouses, autonomous drone laser scanners, and IoT soil probe telemetry.
   - **Interactive Elements**: Real-time telemetry badges (Soil Moisture, Multispectral NDVI, Variable Irrigation, Live Placements), interactive AgTech specialization cards, and role previews.
   - **Live Statistics**: Connected to live platform metrics (`/api/home/stats`) for Students, Farm Partners, Academic Institutions, and Placements.
   - **Responsive Design**: Polished layout across desktop, tablet, and mobile with clear call-to-action pathways.

2. **Confidential Admin Module**:
   - **Hidden Public Footprint**: Administrative access is strictly hidden from public navigation, marketing cards, footers, and public login tabs (Student, Farmer, College only).
   - **Zero Role Enumeration**: Public login rejects admin emails with a generic `401 Invalid email or password`, preventing username/role harvesting.
   - **Dedicated Direct URL**: Secure, restricted administrative login portal located exclusively at `/admin/login`.
   - **Full-Stack Role Authorization**: Frontend guards unauthorized view access, while backend APIs (`/api/admin/*`) enforce strict role-based access (`require_roles("admin")`). Unauthorized users receive `403 Forbidden` on direct API requests and navigation.
   - **Secure Admin Setup**: Enhanced `backend/scripts/create_admin.py` supports masked interactive password prompts with confirmation, password strength validation, and PBKDF2-HMAC-SHA256 hashing without any hardcoded credentials.

3. **Data Integrity & Continuity**:
   - **Preserved Database**: The SQLite database (`backend/farmintern.db`) and all existing records (users, applications, placements, tasks, messages, notifications) remain intact. No data is reset, dropped, or seeded over.

---

## Quick Start on Ubuntu (Exact Commands)

### 1. Prerequisites (Ubuntu System Packages)
```bash
sudo apt update && sudo apt install -y python3 python3-venv python3-pip nodejs npm unzip
# Note: Node.js 18+ and Python 3.10+ are recommended.
```

### 2. Extract the Archive
```bash
unzip FarmIntern-Repaired.zip -d FarmIntern-Repaired
cd FarmIntern-Repaired
```

### 3. Safe Database Configuration
The existing SQLite database is already bundled at `backend/farmintern.db` with all records preserved. **No reset or seed step is needed.**

If using SQLite (Default Local Mode):
```bash
cd backend
cp .env.example .env
# Ensure DATABASE_URL is left blank or commented out in backend/.env to use farmintern.db safely.
cd ..
```

If using PostgreSQL (Optional Production Mode):
```bash
sudo apt install -y postgresql
sudo -u postgres psql -c "CREATE USER farm_user WITH PASSWORD 'YourStrongPassword';"
sudo -u postgres psql -c "CREATE DATABASE farm_internship_db OWNER farm_user;"
# In backend/.env set:
# DATABASE_URL=postgresql://farm_user:YourStrongPassword@localhost:5432/farm_internship_db
```

### 4. Install Dependencies & Start the Backend

Open **Terminal 1**:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start FastAPI server on port 8000
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- API Docs: `http://127.0.0.1:8000/docs`
- Health Endpoint: `http://127.0.0.1:8000/api/health`

### 5. Install Dependencies & Start the Frontend

Open **Terminal 2**:
```bash
cd frontend
npm install
npm run dev

# Or directly from the project root:
# npm run dev
```
Open your browser at: **`http://localhost:5173`**

---

## Confidential Admin Module

### Admin Login URL
- **Direct Login Route**: `http://localhost:5173/admin/login`
- **Existing Default Admin**:
  - Email: `admin@farmintern.local`
  - Password: `Admin@123`

### Secure Initial Admin Account Setup (No Hardcoded Passwords)

To create a new administrator or reset credentials safely:

#### Method A: Interactive CLI (Recommended)
From `backend/` with active virtual environment:
```bash
python scripts/create_admin.py
```
Prompts:
```text
==================================================
       FarmIntern Secure Admin Account Setup      
==================================================
Admin Email: admin@example.com
Admin Full Name [Platform Administrator]: Jane Doe
Enter secure admin password: <hidden>
Confirm secure admin password: <hidden>

[SUCCESS] Administrator account created successfully for 'admin@example.com'.
--------------------------------------------------
  Account Email  : admin@example.com
  Assigned Role  : admin
  Verified Status: True
  Active Status  : True
  Admin Login URL: /admin/login
--------------------------------------------------
```

#### Method B: Direct CLI Arguments
```bash
python scripts/create_admin.py admin@example.com "System Administrator"
# Securely prompts for masked password and confirmation
```

#### Method C: Headless / Environment Variable (CI/CD)
```bash
ADMIN_PASSWORD='YourStrongPassword123!' python scripts/create_admin.py admin@example.com "System Administrator"
```

*Admins cannot register through public interfaces. The script performs password strength verification (8+ characters, letters, digits) and securely stores PBKDF2-HMAC-SHA256 hashes without ever writing plain-text passwords.*

---

## Role-Based Access Control Matrix

| Surface / Endpoint | Student | Farmer | College | Admin | Public / Unauth |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Landing Page** (`/`) | Yes | Yes | Yes | Yes | Yes |
| **Public Login Tabs** | Student | Farmer | College | Hidden | N/A |
| **Direct Admin Login** (`/admin/login`) | Blocked (403) | Blocked (403) | Blocked (403) | Granted | Auth Form |
| **User Directory** (`/api/admin/users`) | 403 Forbidden | 403 Forbidden | 403 Forbidden | 200 OK | 401 Unauthorized |
| **Verify Users** (`/api/admin/users/{id}/verify`) | 403 Forbidden | 403 Forbidden | 403 Forbidden | 200 OK | 401 Unauthorized |
| **Deactivate Users** (`/api/admin/users/{id}/active`) | 403 Forbidden | 403 Forbidden | 403 Forbidden | 200 OK | 401 Unauthorized |
| **Post Internships** (`/api/internships`) | 403 Forbidden | 200 OK | 403 Forbidden | Status Only | 401 Unauthorized |
| **Apply for Internships** (`/api/applications`) | 200 OK | 403 Forbidden | 403 Forbidden | 403 Forbidden | 401 Unauthorized |
| **Student Task Management** | Update progress | Assign / Delete | Monitor | Monitor | 401 Unauthorized |

---

## Test Verification & Security Audit Results

All automated test suites executed successfully against the database and API routes:

```text
================ RUNNING COMPREHENSIVE TEST SUITE ================
[PASS] Health check: online
[PASS] Home stats: students=4, farmers=2, colleges=1, internships=3
[PASS] Public login confidentiality: Admin email with student tab returns 401 generic error (No role leak)
[PASS] Public login confidentiality: Admin email with farmer tab returns 401 generic error (No role leak)
[PASS] Admin login protection: Non-admin rejected with 401 Unauthorized
[PASS] Admin login protection: Wrong admin password rejected with 401 Unauthorized
[PASS] Admin login success: Authenticated via /api/admin/login with role=admin and valid signed JWT
[PASS] Role authorization: Student blocked from /api/admin/users with 403 Forbidden
[PASS] Role authorization: Farmer blocked from /api/admin/users with 403 Forbidden
[PASS] Role authorization: College blocked from /api/admin/users with 403 Forbidden
[PASS] Role authorization: Student blocked from /api/admin/users/1/verify with 403 Forbidden
[PASS] Admin access: Successfully retrieved all 8 users
[PASS] Existing workflow: 3 active internships retrieved
[PASS] Existing workflow: Placements accessible for authenticated student
[PASS] Database integrity: users=8, internships=3, apps=4, placements=2, tasks=1 (ALL PRESERVED)
================ ALL TESTS PASSED SUCCESSFULLY! ================
```

### Frontend Build Verification
```bash
npm run build
# Result: 31 modules transformed.
# dist/index.html                   0.59 kB
# dist/assets/index-BOCuWl2B.css   63.01 kB
# dist/assets/index-CHje10iQ.js   245.59 kB
# built in 14.79s (0 errors)
```

---

## Production Deployment (Single Container Docker)

```bash
docker build -t farmintern .
docker run -p 8000:8000 --env-file backend/.env -e ENVIRONMENT=production farmintern
```
The FastAPI backend serves the production-compiled frontend assets at `/` and `/admin/login` with SPA fallback.
