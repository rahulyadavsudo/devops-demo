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
## Run on kind

There is a `k8s/` folder with manifests for PostgreSQL, backend, and frontend deployments.

1. Create a kind cluster:

```bash
kind create cluster --name devops-demo --config k8s/kind-config.yaml
```

2. Load your local Docker images into kind:

```bash
kind load docker-image deploy-backend:latest --name devops-demo
kind load docker-image deploy-frontend:latest --name devops-demo
```

3. Deploy the workloads:

```bash
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

4. Access the app:

- Frontend: `http://localhost:30080`
