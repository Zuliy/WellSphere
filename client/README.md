# Health Passport AI

A React frontend for the Health Passport AI clinical dashboard, built from provided UI designs.

## Tech Stack

- React + Vite
- React Router DOM
- Tailwind CSS v4
- Lucide React icons
- React Context + localStorage for app state

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Application Flow

```
Login → Home → Create Passport → Dashboard → Add Records → Dashboard / Passport / Doctor Portal
```

## Routes

| Route | Page |
|-------|------|
| `/` | Redirects to Login |
| `/login` | Login Page |
| `/home` | Landing Page (after login) |
| `/create-passport` | Create Health Passport form |
| `/dashboard` | Patient Dashboard |
| `/add-record` | Add Medical Record |
| `/passport` | Health Passport |
| `/doctor-portal` | Doctor Portal |

## Data

All patient information is stored in React Context and persisted to `localStorage`. No hardcoded mock patient data is displayed — values come from:

- Login email
- Create Passport form
- Medical records added by the user

## Project Structure

```
src/
├── components/     # Navbar, Footer, ProtectedRoute
├── context/        # HealthPassportContext
├── layouts/        # MainLayout
├── pages/          # Page components
├── routes/         # AppRoutes
├── utils/          # Helper functions
├── App.jsx
└── main.jsx
```
