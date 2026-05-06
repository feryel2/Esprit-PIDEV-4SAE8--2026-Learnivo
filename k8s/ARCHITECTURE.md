# Architecture Kubernetes Complète - Learnivo

## Vue d'ensemble

Ceci est une architecture Kubernetes complète et distribuée pour déployer le projet Learnivo (plateforme e-learning microservices).

## Fichiers Créés

### Structure des répertoires

```
k8s/
├── 📄 00-namespace.yaml            # Namespace isolé pour Learnivo
├── 📄 01-configmap.yaml            # Configurations des services
├── 📄 02-secrets.yaml              # Secrets et identifiants
├── 📄 03-network-policies.yaml     # Politiques réseau de sécurité
├── 📄 04-ingress.yaml              # Ingress pour accès externe
├── 📄 kustomization.yaml           # Orchestration Kustomize
├── 📄 README.md                    # Guide complet de déploiement
├── 📄 KUBEADM_SETUP.md            # Guide setup kubeadm (distribution)
├── 📄 LOCAL_SETUP.md              # Guide setup local (Docker Desktop, Minikube)
├── 📁 backend/
│   ├── 01-discovery-server.yaml    # Eureka (Service Registry)
│   ├── 02-api-gateway.yaml         # API Gateway (LoadBalancer)
│   ├── 03-user-service.yaml        # Service Utilisateurs
│   ├── 04-course-service.yaml      # Service Cours
│   └── 05-quiz-service.yaml        # Service Quiz
├── 📁 frontend/
│   └── 01-frontend.yaml            # Frontend Angular (LoadBalancer)
├── 📜 deploy.sh                    # Script d'automatisation
└── 🔍 health-check.sh             # Script de vérification santé
```

## Services Kubernetes Déployés

### 1. Discovery Server (Eureka)
- **Port**: 8761
- **Type**: ClusterIP (accès interne)
- **Replicas**: 1
- **Rôle**: Service Registry - tous les services s'y enregistrent

### 2. API Gateway
- **Port**: 8080
- **Type**: LoadBalancer (accès externe)
- **Replicas**: 2 (haute disponibilité)
- **Rôle**: Point d'entrée unique pour le frontend

### 3. User Service
- **Port**: 8083
- **Type**: ClusterIP (accès interne via gateway)
- **Replicas**: 2
- **Rôle**: Authentification, gestion des utilisateurs

### 4. Course Service
- **Port**: 8081
- **Type**: ClusterIP
- **Replicas**: 2
- **Rôle**: Gestion des cours et chapitres

### 5. Quiz Service
- **Port**: 8082
- **Type**: ClusterIP
- **Replicas**: 2
- **Rôle**: Gestion des quiz et évaluations

### 6. Frontend (Angular)
- **Port**: 80
- **Type**: LoadBalancer (accès externe)
- **Replicas**: 2
- **Rôle**: Interface utilisateur web

## Architecture de Communication

```
┌─────────────────────────────────────────────┐
│              INTERNET / UTILISATEURS        │
└────────┬──────────────────────────┬─────────┘
         │                          │
    (LoadBalancer)            (LoadBalancer)
         │                          │
         ▼                          ▼
    ┌─────────────┐          ┌──────────────┐
    │  Frontend   │          │  API Gateway │
    │  Angular    │          │   Port 8080  │
    │  Port 80    │          └──────┬───────┘
    └────────┬────┘                 │
             │                      │ (Service Discovery)
             │                      ▼
             │            ┌─────────────────┐
             │            │ Discovery Server│
             │            │     Eureka      │
             │            │   Port 8761     │
             │            └────────┬────────┘
             │                     │
             └─────────┬───────────┴──────────────────┐
                       │                              │
              ┌────────▼─────┐           ┌───────────▼─────┐
              │  User Service │           │  Course Service │
              │   Port 8083   │           │    Port 8081    │
              └───────────────┘           └─────────────────┘
              
              ┌──────────────────┐
              │  Quiz Service    │
              │   Port 8082      │
              └──────────────────┘

Data Persistence:
├─ H2 Database (in-file): /data/h2/
│  ├─ user-service.db
│  ├─ course-service.db
│  └─ quiz-service.db
└─ Uploads: /data/uploads/
```

## Configuration pour chaque Service

### ConfigMaps
Chaque service a sa propre ConfigMap avec:
- EUREKA_SERVER URL
- Port du service
- Logging configuration
- Données sensitivity (security.enabled, etc.)

### Secrets
Stockés de manière sécurisée:
- `JWT_SECRET`: Clé de signature JWT
- `MYSQL_*`: Identifiants base de données
- `COURSE_AI_API_KEY`: API keys externes (optionnel)

### Volumes
- **emptyDir**: Données temporaires, survit à la durée du pod
- PersistentVolumes: À ajouter pour production

## Déploiement - Processus

### Phases de Déploiement

```
1. Namespace Creation
   └─► Isoler les ressources Learnivo

2. Configuration
   ├─► ConfigMaps: Configuration de chaque service
   └─► Secrets: Données sensibles

3. Backend Services (ordre de dépendance)
   ├─► Discovery Server (Eureka)
   │   └─ Les autres services en dépendent
   ├─► User Service (peut appeler Eureka)
   ├─► Course Service (peut appeler Eureka)
   ├─► Quiz Service (peut appeler Eureka)
   └─► API Gateway (route vers tous les services)

4. Frontend
   └─► Angular app connectée via API Gateway

5. Security (optionnel)
   ├─► Network Policies
   └─► Ingress Rules
```

## Santé et Monitoring

### Health Checks Intégrés

Chaque service a:
- **Liveness Probe**: Redémarre si "mort"
- **Readiness Probe**: Retire du LoadBalancer si non-prêt

Endpoint: `http://<service>:<port>/actuator/health`

### Logs et Debugging

```bash
# Voir les logs
kubectl logs -f -n learnivo <pod-name>

# Décrire un pod
kubectl describe pod -n learnivo <pod-name>

# Exécuter une commande dans un pod
kubectl exec -it -n learnivo <pod-name> -- bash

# Port forwarding
kubectl port-forward -n learnivo svc/<service> <local-port>:<pod-port>
```

## Scaling

### Horizontal Pod Autoscaling (HPA)

À ajouter pour auto-scaling:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
  namespace: learnivo
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Sécurité

### Network Policies

Actuellement configurées:
- ✅ Frontend → API Gateway (8080)
- ✅ API Gateway → Services internes
- ✅ Services → Discovery Server
- ✅ Inter-service communication

### Secrets Management

Production: Utiliser
- **Sealed Secrets**: Chiffrer les secrets
- **External Secrets Operator**: Intégration HashiCorp Vault
- **Workload Identity**: Pour Azure/GCP

## Performance

### Resource Requests & Limits

| Service | Memory Req | Memory Limit | CPU Req | CPU Limit |
|---------|-----------|--------------|---------|-----------|
| discovery-server | 256Mi | 512Mi | 100m | 500m |
| api-gateway | 256Mi | 512Mi | 200m | 500m |
| user-service | 256Mi | 512Mi | 200m | 500m |
| course-service | 256Mi | 512Mi | 200m | 500m |
| quiz-service | 256Mi | 512Mi | 200m | 500m |
| frontend | 64Mi | 256Mi | 50m | 200m |

**Total minimum pour fonctionner**: 
- CPU: 1000m (1 vCore)
- RAM: 1.5GB

**Total avec headroom**:
- CPU: 2500m (2.5 vCores recommandés)
- RAM: 3GB

## Intégration CI/CD

### Build et Push des Images

```bash
# Backend
cd backend
mvn clean package spring-boot:build-image \
  -Dspring-boot.build-image.imageName=myregistry.azurecr.io/learnivo/api-gateway:latest

# Frontend
cd frontend
npm run build
docker build -t myregistry.azurecr.io/learnivo/frontend:latest .
docker push myregistry.azurecr.io/learnivo/frontend:latest
```

### Déploiement Automatisé

```bash
# Avec Kustomize
kubectl apply -k k8s/

# Avec Helm (à implémenter)
helm install learnivo ./helm-chart -n learnivo

# Avec ArgoCD (à implémenter)
argocd app create learnivo --repo <repo> --path k8s
```

## Production Checklist

- [ ] Utiliser un registre privé pour les images
- [ ] Configurer RBAC (Role-Based Access Control)
- [ ] Activer Network Policies
- [ ] Configurer PersistentVolumes pour les données
- [ ] Mettre en place des sauvegardes
- [ ] Configurer des alertes de monitoring
- [ ] Utiliser Sealed Secrets pour les credentials
- [ ] Configurer un Ingress Controller
- [ ] Mettre en place logging centralisé (ELK, Loki)
- [ ] Mettre en place monitoring (Prometheus, Grafana)
- [ ] Configurer pod disruption budgets
- [ ] Configurer des resource quotas
- [ ] Activer les pod security policies
- [ ] Mettre en place les health checks
- [ ] Tester la disaster recovery

## Documentation Supplémentaire

- [README.md](./README.md) - Guide complet
- [KUBEADM_SETUP.md](./KUBEADM_SETUP.md) - Setup distribution (kubeadm)
- [LOCAL_SETUP.md](./LOCAL_SETUP.md) - Setup local
- [deploy.sh](./deploy.sh) - Script automation
- [health-check.sh](./health-check.sh) - Vérification santé

## Support Distribué

L'architecture est prête pour:
- ✅ **Réplication**: Plusieurs replicas de chaque service
- ✅ **Load Balancing**: Services LoadBalancer pour gateway et frontend
- ✅ **Service Discovery**: Eureka intégré
- ✅ **Health Checks**: Liveness et readiness probes
- ✅ **Network Policies**: Segmentation réseau
- ✅ **ConfigMaps/Secrets**: Gestion config externalisée

## Prochaines Étapes

### Phase 1: Déploiement Initial
1. ✅ Manifests créés
2. ⏭️ Builder les images Docker
3. ⏭️ Déployer sur cluster K8s

### Phase 2: Production-Ready
1. ⏭️ Ajouter PersistentVolumes
2. ⏭️ Configurer Ingress controller
3. ⏭️ Mettre en place monitoring (Prometheus/Grafana)
4. ⏭️ Mettre en place logging (ELK/Loki)
5. ⏭️ Configurer backups

### Phase 3: Advanced
1. ⏭️ Service Mesh (Istio)
2. ⏭️ GitOps (ArgoCD)
3. ⏭️ Security scanning
4. ⏭️ Performance optimization

---

**Version**: 1.0.0  
**Créé**: 2026-05-04  
**Kubernetes**: v1.20+  
**Support**: Multi-région, Multi-cloud (Azure, AWS, GCP)
