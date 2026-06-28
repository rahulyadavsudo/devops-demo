# kind deployment for DevOps Demo

## Prerequisites

- `kind` installed
- `kubectl` installed
- Docker daemon running

## Create cluster

```bash
kind create cluster --name devops-demo --config k8s/kind-config.yaml
```

The cluster config maps service port `30080` from the kind node to your host.

## Load local Docker images into kind

```bash
kind load docker-image deploy-backend:latest --name devops-demo
kind load docker-image deploy-frontend:latest --name devops-demo
```

## Deploy services

```bash
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

## Access the frontend

Visit: http://localhost:30080

## Make the backend available to the frontend

The frontend in your browser sends requests to `http://localhost:4000/api/...`, but the backend is currently exposed only inside the cluster.

Run this in another terminal:

```bash
kubectl port-forward svc/backend-service 4000:4000
```

Then the frontend can save messages correctly.

## Verify pods

```bash
kubectl get pods
kubectl get svc
```

## Cleanup

```bash
kind delete cluster --name devops-demo
```
