# ApplyNow

ApplyNow is a polished job application tracker built as a monorepo with a React frontend and a Node/Express backend. It helps you track applications, statuses, referrals, work type, notes, and progress at a glance.

## Features

- Google OAuth login with HTTP-only cookie authentication
- Job CRUD with edit, delete, status updates, and referral tracking
- Work type support for Remote, Hybrid, and On-site roles
- Notes for each application with a dedicated view modal
- Dashboard cards, status overview, and activity trend charts
- CSV export for application history
- Responsive UI with a clean dashboard and table-first workflow

## Tech Stack

- Frontend: React 18, Vite, React Router, Tailwind CSS, Recharts, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, Passport Google OAuth
- Auth: JWT stored in an HTTP-only cookie

## Project Structure

```text
ApplyNow/
	backend/
	frontend/
	README.md
```

## Prerequisites

- Node.js 18+ recommended
- MongoDB connection string
- Google Cloud OAuth credentials

## Environment Setup

Copy the example environment files:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

### Backend `.env`

Set these values in `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/applynow
JWT_SECRET=your_strong_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
NODE_ENV=development
```

### Frontend `.env`

Set this value in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.developers.google.com).
2. Create a project or choose an existing one.
3. Open **APIs & Services** > **Credentials**.
4. Create an **OAuth 2.0 Client ID** for a **Web application**.
5. Add the following local URLs:
	 - Authorized JavaScript origins: `http://localhost:5173`
	 - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
6. Copy the client ID and client secret into `backend/.env`.

## Run Locally

Install dependencies from the repository root and start the app:

```bash
npm install
npm run dev
```

This root workspace uses `concurrently` to start both apps together.

If you prefer, you can also run the backend and frontend separately:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000` by default.

## Build

```bash
npm run build
```

This root build script installs workspace dependencies and builds the frontend.

## Deploy on Render

This repository is set up well for a two-service Render deployment.

### 1) Deploy the backend as a Web Service

- Create a new **Web Service** on Render.
- Connect this GitHub repository.
- Set **Root Directory** to `backend`.
- Use these commands:
	- Build Command: `npm ci`
	- Start Command: `npm start`
- Add backend environment variables:
	- `NODE_ENV=production`
	- `MONGO_URI=<your_mongodb_connection_string>`
	- `JWT_SECRET=<strong_random_secret>`
	- `GOOGLE_CLIENT_ID=<your_google_client_id>`
	- `GOOGLE_CLIENT_SECRET=<your_google_client_secret>`
	- `CLIENT_URL=<your_render_frontend_url>`
	- `SERVER_URL=<your_render_backend_url>`

### 2) Deploy the frontend as a Static Site

- Create a new **Static Site** on Render.
- Connect the same GitHub repository.
- Set **Root Directory** to `frontend`.
- Use these commands:
	- Build Command: `npm ci && npm run build`
	- Publish Directory: `dist`
- Add frontend environment variables:
	- `VITE_API_URL=<your_render_backend_url>`

### 3) Update Google OAuth for production

In the Google Cloud Console, add your Render URLs:

- Authorized JavaScript origins:
	- `https://<your-frontend>.onrender.com`
- Authorized redirect URIs:
	- `https://<your-backend>.onrender.com/api/auth/google/callback`

### 4) Final check

- Open the frontend URL.
- Sign in with Google.
- Confirm jobs load, can be created, edited, and deleted.

## API Summary

- `GET /api/auth/me` - current user
- `GET /api/jobs` - list jobs
- `POST /api/jobs` - create job
- `PUT /api/jobs/:id` - update job
- `DELETE /api/jobs/:id` - delete job
- `GET /api/jobs/analytics` - dashboard analytics

## Notes

- Auth uses cookies, so frontend and backend URLs must be configured correctly for local and production environments.
- If Google login fails in production, double-check `CLIENT_URL`, `SERVER_URL`, and the Google OAuth redirect URI.

## License

No license file has been added yet.

