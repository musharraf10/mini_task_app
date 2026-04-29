# Mini SaaS Task Manager

This is a simple task management app where users can sign up and manage their own tasks.
I built it as a mini “mini-SaaS” so each user has a private task list (no mixing data between users).

Real-life use case: a small team or person can keep track of tasks in one place, with secure login and per-user data.

## Features

- Signup + login with secure password hashing
- JWT authentication (protected API routes)
- Create tasks with title and optional description
- View only your tasks
- Update task status: `pending → completed`
- Delete tasks

## Tech Stack

- Frontend: React + Vite + Tailwind (UI)
- Backend: Node.js + Express
- Database: PostgreSQL (Supabase Postgres)
- ORM/DB Tooling: Sequelize + migrations

## How It Works (Simple Flow)

1. You open the app and go to **Sign up** or **Log in**.
2. Backend checks your input, stores the user (with a hashed password), then returns a JWT token.
3. Frontend saves the token in `localStorage`.
4. When you open the **Tasks** page, the frontend calls the API using the token.
5. Backend verifies the token, finds your user, and only returns tasks that belong to your user.
6. When you add/update/delete a task, the same “only my tasks” rule applies every time.

## Folder Structure (Short)

- `backend/`
  - `src/app.js` and `src/server.js` (server setup)
  - `src/routes/` (API routes)
  - `src/controllers/` (signup/login/tasks logic)
  - `src/models/` (User and Task tables)
  - `src/middleware/` (auth + error handling)
- `frontend/`
  - `src/pages/` (Login, Signup, Tasks pages)
  - `src/components/` (reusable UI components)
  - `src/api/` and `src/utils/` (API calls + auth state)

## Setup Instructions

### 1) Backend

1. Copy env file:
   - `backend/.env.example` → `backend/.env`
2. Set `DATABASE_URL` to your Supabase connection string and turn on SSL:
   - `DB_SSL=true`
3. Run migrations:
   ```bash
   cd backend
   npm install
   npm run db:migrate
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

Server runs at `http://localhost:4000`.

### 2) Frontend

1. Start the UI:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open the URL Vite shows (usually `http://localhost:5173`).

## Challenges I Faced

- Supabase SSL + connection string issues
  - Fix: added support for `DATABASE_URL` and enabled SSL so Sequelize can connect reliably.
- “Protected routes” still needed a clean loading flow
  - Fix: kept a `tokenReady` state so the UI doesn’t redirect too early while checking the token.
- Preventing cross-user task access
  - Fix: every task query uses `userId` from the authenticated user (so users can’t see other users’ tasks).

## What I Learned

- JWT auth is simple once the flow is clear: login → token → protected requests → backend verifies.
- For multi-user apps, the database relationship (`userId`) is the safety net that prevents data leaks.
- Keeping frontend code readable matters. Simple `useState` + `useEffect` + clean fetch cleanup is enough for this type of app.

## Netlify Deployment (Frontend)

If you deploy from the repository root, Netlify must build the `frontend/` app (not serve source files directly).

- Build command: `npm run build`
- Base directory: `frontend`
- Publish directory: `dist`

This repo includes a root `netlify.toml` with those values so Netlify serves the built JS bundles instead of `/src/main.jsx`.

