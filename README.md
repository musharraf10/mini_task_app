# Mini SaaS Task Management App

Production-ready **mini-SaaS task manager** with:

- **Secure auth**: signup/login, bcrypt password hashing, JWT auth, protected routes
- **Multi-user tasks**: each user only sees/edits their own tasks
- **Backend**: Node.js + Express + Sequelize + PostgreSQL, validation + error middleware
- **Frontend**: React + Tailwind, API integration, state handling

## Project structure

- `backend/`: Express API (`/api/auth/*`, `/api/tasks/*`)
- `frontend/`: React app (Vite + Tailwind)

## Prerequisites

- Node.js 20+
- PostgreSQL 14+

## Backend setup

1. Create a Postgres database (example `mini_saas_tasks`).
2. Configure env:

Copy `backend/.env.example` to `backend/.env` and fill values.

3. Run migrations:

```bash
cd backend
npm run db:migrate
```

4. Start the API:

```bash
cd backend
npm run dev
```

API runs on `http://localhost:4000` and has `GET /health`.

## Frontend setup

1. Configure env (optional):

Copy `frontend/.env.example` to `frontend/.env`. If omitted, the app uses `http://localhost:4000`.

2. Start the frontend:

```bash
cd frontend
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

## API overview

### Auth

- `POST /api/auth/signup` `{ email, password }` → `{ token, user }`
- `POST /api/auth/login` `{ email, password }` → `{ token, user }`
- `GET /api/auth/me` (Bearer token) → `{ user }`

### Tasks (protected)

- `GET /api/tasks` → `{ tasks }`
- `POST /api/tasks` `{ title, description? }` → `{ task }`
- `PATCH /api/tasks/:id` `{ status?, title?, description? }` → `{ task }`
- `DELETE /api/tasks/:id` → `204`

