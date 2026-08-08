# AgriIntern — Public Module

Frontend-only React implementation of the **Public Module** for the Farm Internship
Platform: Home, Login, Student Registration, and Farmer Registration.

## Tech Stack
- React (JavaScript) + Vite
- React Router DOM
- Bootstrap 5 + custom CSS
- Static/dummy data only — no backend, no APIs, no authentication logic

## Getting Started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Folder Structure

```
src/
├── assets/
├── components/   # Navbar, Footer, HeroSection, cards, form fields, etc.
├── data/         # Static dummy data (stats, categories, internships, etc.)
├── layouts/      # PublicLayout (navbar+footer) and AuthLayout (login/register)
├── pages/        # Home, Login, StudentRegistration, FarmerRegistration
├── routes/       # AppRoutes.jsx — route definitions
├── styles/       # Design tokens + component CSS
├── App.jsx
├── main.jsx
└── index.css
```

## Routes

| Path                | Page                 |
|---------------------|----------------------|
| `/`                  | Home                 |
| `/login`             | Login                |
| `/register/student`  | Student Registration |
| `/register/farmer`   | Farmer Registration  |

No dashboard or private routes are included, per the Public Module scope.

## Notes
- All images use placeholder URLs (picsum.photos); swap in real agriculture imagery
  as needed.
- Forms perform client-side validation only (required fields, email format,
  password confirmation) and do not submit to any server.
- The codebase is structured so a FastAPI backend can be integrated later without
  major restructuring.
