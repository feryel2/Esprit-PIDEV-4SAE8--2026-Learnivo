# Kubernetes Deployment for Learnivo

This directory contains all Kubernetes manifests needed to deploy the Learnivo platform in a Kubernetes cluster.

## Project Structure

```
k8s/
├── 00-namespace.yaml          # Creates the 'learnivo' namespace
├── 01-configmap.yaml          # ConfigMaps for all services
├── 02-secrets.yaml            # Secrets for sensitive data
├── 03-network-policies.yaml   # Network policies for security
├── 04-ingress.yaml            # Ingress configuration
├── backend/                   # Backend microservices
│   ├── 01-discovery-server.yaml  # Eureka Discovery Server
│   ├── 02-api-gateway.yaml       # API Gateway
│   ├── 03-user-service.yaml      # User/Auth Service
│   ├── 04-course-service.yaml    # Course Service
│   └── 05-quiz-service.yaml      # Quiz Service
└── frontend/
    └── 01-frontend.yaml       # Angular Frontend
```

## Architecture

```
                    ┌──────────────────┐
                    │   Frontend       │
                    │  (LoadBalancer)  │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  API Gateway     │
                    │ (LoadBalancer)   │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼─────────────────────┐
        │                    │                     │
   ┌────▼───┐      ┌────────▼─────────┐   ┌──────▼──┐
   │ Course │      │ Quiz Service     │   │ User    │
   │ Service│      │                  │   │ Service │
   └────┬───┘      └────────┬─────────┘   └──────┬──┘
        │                   │                    │
        └───────────────────┼────────────────────┘
                            │
                    ┌───────▼───────┐
                    │ Discovery     │
                    │ Server(Eureka)│
                    └───────────────┘
```

## Prerequisites

1. **Kubernetes Cluster**: v1.20 or higher
   - kubeadm installed locally
   - kubectl configured to access your cluster
   - Docker daemon running on worker nodes

If you need a **shared, reproducible kubeadm cluster** for the whole group (Windows-friendly), use `k8s/kubeadm-lab/` (Vagrant + VirtualBox).

2. **NVIDIA or Docker Images**: All services must be built as Docker images

3. **Ingress Controller**: NGINX Ingress Controller (optional, for domain-based routing)

## Quick Start

### 1. Build Docker Images

Build all Docker images for your services:

```bash
cd backend
mvn clean package spring-boot:build-image

cd ../frontend
npm run build && docker build -t learnivo/frontend:latest .
```

Image names should follow:
- `learnivo/discovery-server:latest`
- `learnivo/api-gateway:latest`
- `learnivo/user-service:latest`
- `learnivo/course-service:latest`
- `learnivo/quiz-service:latest`
- `learnivo/frontend:latest`

### 2. Create Namespace and Deploy

```bash
# Create namespace
kubectl apply -f k8s/00-namespace.yaml

# Deploy ConfigMaps and Secrets
kubectl apply -f k8s/01-configmap.yaml
kubectl apply -f k8s/02-secrets.yaml

# Deploy backend services
kubectl apply -f k8s/backend/

# Deploy frontend
kubectl apply -f k8s/frontend/

# (Optional) Apply network policies
kubectl apply -f k8s/03-network-policies.yaml

# (Optional) Apply Ingress
kubectl apply -f k8s/04-ingress.yaml
```

## Déploiement minimal (frontend + quiz + course)

Si votre PC est trop lent avec l’ensemble des services, vous pouvez déployer un environnement plus léger en conservant seulement :
- `discovery-server`
- `api-gateway`
- `course-service`
- `quiz-service`
- `frontend`

Cela réduit la charge en évitant `user-service` et les autres services non nécessaires.

### Avec Kustomize

```bash
kubectl apply -k k8s/minimal
```

### Sans Kustomize

```bash
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/01-configmap.yaml
kubectl apply -f k8s/02-secrets.yaml
kubectl apply -f k8s/backend/01-discovery-server.yaml
kubectl apply -f k8s/backend/02-api-gateway.yaml
kubectl apply -f k8s/backend/04-course-service.yaml
kubectl apply -f k8s/backend/05-quiz-service.yaml
kubectl apply -f k8s/frontend/01-frontend.yaml
```

> Note : le frontend utilise l'`api-gateway` pour accéder aux services. Vous pouvez laisser SonarQube arrêté pendant ce déploiement pour libérer des ressources.

### 3. Verify Deployment

```bash
# Check if all pods are running
kubectl get pods -n learnivo

# Check services
kubectl get svc -n learnivo

# Check logs of a specific pod
kubectl logs -n learnivo <pod-name>

# Port forward to access services locally
kubectl port-forward -n learnivo svc/frontend 4200:80
kubectl port-forward -n learnivo svc/api-gateway 8080:8080
```

## Accessing Services

### Local Access (Port Forwarding)

```bash
# Frontend
kubectl port-forward -n learnivo svc/frontend 4200:80
# Access at http://localhost:4200

# API Gateway
kubectl port-forward -n learnivo svc/api-gateway 8080:8080
# Access at http://localhost:8080

# Discovery Server (Eureka)
kubectl port-forward -n learnivo svc/discovery-server 8761:8761
# Access at http://localhost:8761
```

### Via LoadBalancer (Requires Load Balancer Support)

```bash
# Get external IP
kubectl get svc -n learnivo

# Access frontend at LoadBalancer external IP
# Access API gateway at LoadBalancer external IP:8080
```

### Via Ingress (Requires Ingress Controller)

```bash
# First install NGINX Ingress Controller
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --create-namespace

# Add to your /etc/hosts (Linux/Mac) or C:\Windows\System32\drivers\etc\hosts (Windows)
127.0.0.1 learnivo.local api.learnivo.local

# Access services
# Frontend: http://learnivo.local
# API Gateway: http://api.learnivo.local or http://learnivo.local/api
```

## Environment Variables

All services use the following environment variables defined in ConfigMaps and Secrets:

### From ConfigMaps
- `EUREKA_SERVER`: Discovery server URL
- `SPRING_PROFILES_ACTIVE`: kubernetes
- `LOG_LEVEL`: INFO

### From Secrets
- `JWT_SECRET`: JWT signing secret
- `COURSE_AI_API_KEY`: OpenAI API key (optional)
- `COURSE_AI_RECOMMENDATIONS_ENABLED`: Enable/disable AI features
- Database credentials (if using MySQL instead of H2)

## Database

By default, services use **H2 in-file database**:
- Location: `/data/h2/{service-name}`
- Mounted as `emptyDir` (data persists during pod lifetime, not across restarts)

### To Use MySQL Instead

Edit ConfigMaps to use:
```properties
spring.datasource.url=jdbc:mysql://mysql:3306/learnivo_db
spring.datasource.username=learnivo
spring.datasource.password=learnivo123
```

Deploy MySQL:
```bash
# Create MySQL deployment and service (separate YAML)
kubectl apply -f mysql-deployment.yaml  # (create this file)
```

## Scaling Services

Scale any service with:

```bash
# Scale to 3 replicas
kubectl scale deployment api-gateway -n learnivo --replicas=3

# Or edit the deployment directly
kubectl edit deployment api-gateway -n learnivo
```

## Monitoring & Logging

### View Logs
```bash
# Real-time logs
kubectl logs -f -n learnivo <pod-name>

# All pods of a service
kubectl logs -f -n learnivo -l app=course-service
```

### Debugging
```bash
# Describe pod for events
kubectl describe pod -n learnivo <pod-name>

# Execute command in pod
kubectl exec -it -n learnivo <pod-name> -- /bin/bash

# Check readiness/liveness probes
kubectl get pods -n learnivo -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.conditions[*].type}{"\n"}{end}'
```

## Resource Management

Current resource requests/limits per pod:

| Service | Memory Request | Memory Limit | CPU Request | CPU Limit |
|---------|---|---|---|---|
| discovery-server | 256Mi | 512Mi | 100m | 500m |
| api-gateway | 256Mi | 512Mi | 200m | 500m |
| user-service | 256Mi | 512Mi | 200m | 500m |
| course-service | 256Mi | 512Mi | 200m | 500m |
| quiz-service | 256Mi | 512Mi | 200m | 500m |
| frontend | 64Mi | 256Mi | 50m | 200m |

**Total minimum resources**: ~2.5GB RAM, 1000m CPU

### Adjust Resources

Edit the deployment YAML files or use kubectl patch:
```bash
kubectl set resources deployment api-gateway \
  -n learnivo \
  --requests=memory=512Mi,cpu=300m \
  --limits=memory=1Gi,cpu=1000m
```

## Health Checks

All services expose health check endpoints:
```bash
# Example: Check API Gateway health
kubectl exec -n learnivo <api-gateway-pod> -- \
  wget -qO- http://localhost:8080/actuator/health
```

## Security Considerations

1. **Secrets Management**: 
   - Replace all dummy secrets in `02-secrets.yaml` with strong values
   - Use Kubernetes Secret management tools (Sealed Secrets, External Secrets)
   - Use a Secret rotation mechanism in production

2. **Network Policies**:
   - Restrict traffic between pods (see `03-network-policies.yaml`)
   - Enable only necessary ingress/egress rules

3. **Pod Security**:
   - Containers run as non-root by default
   - Use read-only root filesystems where possible
   - Apply Pod Security Standards

4. **Image Security**:
   - Use private container registry
   - Sign images with tools like Notary or Cosign
   - Regular vulnerability scanning

## Troubleshooting

### Pods not starting

```bash
# Check pod events
kubectl describe pod -n learnivo <pod-name>

# Check resource availability
kubectl top nodes
kubectl top pods -n learnivo

# Check image pull errors
kubectl get events -n learnivo
```

### Services unable to communicate

```bash
# Check service DNS resolution
kubectl exec -n learnivo <pod-name> -- nslookup discovery-server

# Check network policies
kubectl get networkpolicies -n learnivo

# Test connectivity between pods
kubectl exec -n learnivo <pod1> -- wget -qO- http://<service-name>:<port>/health
```

### Database connection issues

```bash
# Verify database URL and credentials in ConfigMaps
kubectl get configmap -n learnivo api-gateway-config -o yaml

# Check if /data volume is accessible
kubectl exec -n learnivo <pod-name> -- ls -la /data/
```

## Cleanup

```bash
# Delete all resources in the namespace
kubectl delete namespace learnivo

# Or delete individual resources
kubectl delete deployment -n learnivo --all
kubectl delete service -n learnivo --all
kubectl delete configmap -n learnivo --all
kubectl delete secret -n learnivo --all
```

## Production Considerations

1. **Persistence**: Use PersistentVolumes for data
2. **High Availability**: Deploy multiple replicas with PodDisruptionBudgets
3. **Load Balancing**: Configure proper LoadBalancer or Ingress
4. **Monitoring**: Add Prometheus/Grafana (see monitoring setup guide)
5. **Logging**: Centralize logs with ELK or Loki
6. **GitOps**: Use ArgoCD or Flux for declarative deployments
7. **Backup**: Implement etcd backup strategy
8. **Autoscaling**: Add HorizontalPodAutoscaler (HPA) for automatic scaling

## Next Steps

1. Build all Docker images
2. Push images to a container registry
3. Update image references if not using local Docker
4. Deploy to Kubernetes cluster
5. Setup monitoring and logging
6. Configure ingress/load balancer
7. Implement CI/CD pipeline for automatic deployments
