# Farm Internship Platform

A web-based platform that connects students, farmers, and colleges to simplify agricultural internship management.

The Farm Internship Platform provides a centralized environment for discovering internship opportunities, managing applications, coordinating internship activities, and monitoring student progress.

## Overview

Agricultural internships provide students with practical field experience, but coordinating opportunities, applications, and progress across students, farmers, and colleges can be challenging.

The Farm Internship Platform aims to streamline this process through a role-based web application that brings the major participants together.

## Key Features

- **Student Module** — Explore internship opportunities, view internship details, and manage applications and internship activities.
- **Farmer Module** — Create and manage internship opportunities and review student applications.
- **College Module** — Monitor student internship participation and progress.
- **Admin Module** — Provide platform-level management through a restricted administrative interface.
- **Communication** — Support coordination and communication between platform participants.
- **Responsive Interface** — Provide a consistent experience across desktop and mobile devices.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite, JavaScript |
| Backend | Python, FastAPI |
| Database | SQLite for local development; PostgreSQL configuration supported |
| API | RESTful APIs |
| Authentication | Token-based authentication |
| Version Control | Git and GitHub |
| Deployment | Docker |

## Project Structure

```text
FARM-INTERNSHIP-PLATFORM/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── auth.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   └── recommender.py
│   ├── scripts/
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env.example
├── Dockerfile
├── package.json
└── README.md
```

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Install the following:

- Python 3.10 or later
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/ShaikSameera-design/FARM-INTERNSHIP-PLATFORM.git
cd FARM-INTERNSHIP-PLATFORM
```

### 2. Configure the Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create the environment configuration file:

```bash
cp .env.example .env
```

Review `backend/.env` and configure the database connection and application settings for your environment.

For local development, configure the application to use its SQLite database. For PostgreSQL, provide a valid database URL and ensure the database is available.

### 3. Start the Backend

From the `backend` directory, run:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The backend API will be available at:

- API: `http://127.0.0.1:8000`
- API documentation: `http://127.0.0.1:8000/docs`
- Health endpoint: `http://127.0.0.1:8000/api/health`

### 4. Configure and Start the Frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

`http://localhost:5173`

## Administrator Setup

Administrative accounts should be created using the backend's administrator setup script.

From the `backend` directory, with the virtual environment activated:

```bash
python scripts/create_admin.py
```

Follow the prompts to provide the administrator's email, name, and password.

Administrator access is restricted and is not intended to be available through public registration.

**Security note:** Do not commit real passwords, application secrets, database credentials, or environment files to the repository. Use the provided `.env.example` files as configuration templates.

## Running Tests

The backend includes automated tests.

From the `backend` directory, install the development dependencies:

```bash
pip install -r requirements-dev.txt
```

Then run:

```bash
pytest
```

## Docker

The repository includes a Dockerfile for containerized deployment.

Build the image from the project root:

```bash
docker build -t farm-internship-platform .
```

Configure the required production environment variables before running the container. Use a secure application secret, a production database, and appropriate frontend and backend settings.

Refer to the deployment configuration and environment example files for the settings required by your environment.

## Future Improvements

Potential improvements include:

- Enhanced internship recommendation capabilities
- Additional reporting and analytics
- Improved communication and notification workflows
- Expanded deployment and monitoring support
- Additional automated test coverage

## Contributing

Contributions, suggestions, and bug reports are welcome.

When contributing:

1. Create a branch for your changes.
2. Keep changes focused and well documented.
3. Test the affected functionality.
4. Submit a pull request with a clear description.

## License

A license has not yet been specified for this repository.

## Project Repository

[Farm Internship Platform — GitHub](https://github.com/ShaikSameera-design/FARM-INTERNSHIP-PLATFORM)
