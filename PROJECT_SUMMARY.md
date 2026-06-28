# DevOps Demo Project Summary

## Overview
This project is a simple full-stack DevOps practice app with:

- `frontend/` — React UI
- `backend/` — Express API
- `deploy/` — Docker Compose config for local development
- `.github/workflows/deploy.yml` — GitHub Actions CI workflow
- `k8s/` — Kubernetes manifests for local `kind` deployment

The app stores user messages in PostgreSQL and shows them in the frontend.

## Project Structure

- `frontend/`
  - React app that calls backend APIs
  - uses `react-scripts` for development
- `backend/`
  - Express server exposing `/api/messages` and `/api/health`
  - connects to PostgreSQL with `pg`
- `deploy/`
  - `docker-compose.yml` for backend + frontend + db
- `k8s/`
  - `kind-config.yaml`
  - Kubernetes Deployment and Service YAML files

## Local Docker Compose Setup

### Files created

- `deploy/docker-compose.yml`
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `.gitignore`
- `.dockerignore` files for backend and frontend

### Commands used

```bash
cd backend && npm install
cd ../frontend && npm install
cd deploy
docker compose up --build
```

### What it starts

- Frontend on `http://localhost:3000`
- Backend on `http://localhost:4000`
- PostgreSQL on port `5432`

## GitHub Actions CI

### Workflow file
- `.github/workflows/deploy.yml`

### What it does

- triggers on `push` to `main` and `master`
- checks out the repository
- sets up Node.js 24
- installs backend and frontend dependencies
- builds the frontend
- logs in to Docker Hub using secrets
- builds and pushes Docker images for frontend and backend

### Required GitHub secrets

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

### Commands and fixes

- Updated `actions/setup-node` to use Node 24 because Node 20 is deprecated on GitHub runners
- Verified workflow configuration by pushing to `main`

## Kubernetes with kind

### Manifests created

- `k8s/kind-config.yaml`
- `k8s/postgres-deployment.yaml`
- `k8s/backend-deployment.yaml`
- `k8s/frontend-deployment.yaml`
- `k8s/README.md`

### kind setup commands

```bash
kind create cluster --name devops-demo --config k8s/kind-config.yaml
kind load docker-image deploy-backend:latest --name devops-demo
kind load docker-image deploy-frontend:latest --name devops-demo
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

### Access

- Frontend: `http://localhost:30080`
- Backend inside cluster: `http://backend-service:4000`

## Troubleshooting and fixes

### Docker Compose issues

- `docker-compose up --build` failed because the system had an outdated `docker-compose` binary. The correct command is `docker compose up --build`.
- The Github Actions runner showed Node 20 deprecation; workflow was updated to Node 24.

### Backend startup issue

- Backend initially failed when connecting to PostgreSQL in Docker Compose because the database was not ready.
- Added a retry loop in `backend/index.js` to wait for Postgres before initializing the database and starting the server.

### kind access issue

- The frontend app could not save messages because the backend was only exposed internally inside the kind cluster.
- Added documentation for port forwarding:

```bash
kubectl port-forward svc/backend-service 4000:4000
```

### Kubernetes image configuration

- Updated `k8s/backend-deployment.yaml` and `k8s/frontend-deployment.yaml` to use Docker Hub image names instead of local image tags.

## Validation commands

### Docker Compose validation

```bash
docker compose version
docker compose up --build
```

### kind / Kubernetes validation

```bash
kind get clusters
kubectl get pods
kubectl get svc
kubectl logs deployment/backend-deployment
kubectl run curl-test --rm -i --restart=Never --image=curlimages/curl -- sh -c "curl -sS http://backend-service:4000/api/health"
kubectl port-forward svc/backend-service 4000:4000
```

### Git validation

```bash
git status
git remote -v
git push -u origin main
```

## Notes

- `backend-service` is `ClusterIP` in Kubernetes, so external access requires port forwarding or a NodePort/Ingre` option.
- `frontend-service` is exposed as `NodePort` on `30080`.
- The backend uses the environment variables in `k8s/backend-deployment.yaml` to connect to PostgreSQL.

## Summary

This project now supports:

1. local development with Docker Compose
2. continuous integration via GitHub Actions building and pushing Docker Hub images
3. local Kubernetes deployment using kind

The current setup is validated and working, including the message save functionality through the backend and PostgreSQL.
