# DevOps Demo

Simple full-stack application for DevOps practice.

## Project structure

- `frontend/` - React app
- `backend/` - Express API
- `deploy/` - Docker Compose configuration

## Install dependencies

From the project root run:

```bash
cd backend && npm install
cd ../frontend && npm install
```

## Run with Docker Compose

From the `deploy` folder:

```bash
cd deploy
docker-compose up --build
```

Then visit:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api/health

## Database

The backend connects to PostgreSQL running in the `db` service. The app creates the `messages` table automatically on startup.

## How it works

- Frontend sends requests to the backend API.
- Backend stores messages in PostgreSQL.
- This setup is useful for practicing containerization, CI/CD, and DevOps workflows.
