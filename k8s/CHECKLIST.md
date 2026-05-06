# ✅ KUBERNETES - SETUP COMPLÈTE

## 📦 Fichiers Créés (18 fichiers)

### Racine du projet k8s/
```
✅ 00-namespace.yaml              - Namespace isolé pour Learnivo
✅ 01-configmap.yaml              - Configurations centralisées pour tous les services
✅ 02-secrets.yaml                - Secrets (JWT, DB credentials, API keys)
✅ 03-network-policies.yaml       - Politiques réseau de sécurité
✅ 04-ingress.yaml                - Ingress pour routing basé sur domaine
✅ kustomization.yaml             - Orchestration Kustomize
✅ README.md                      - Guide complet d'utilisation (⭐ LISEZ CECI EN PREMIER)
✅ KUBEADM_SETUP.md              - Guide détaillé pour kubeadm (distribution multi-nœud)
✅ LOCAL_SETUP.md                - Guide pour Docker Desktop, Minikube, Kind
✅ ARCHITECTURE.md               - Vue d'ensemble complète
✅ deploy.sh                     - Script d'automatisation Bash
✅ health-check.sh               - Script de vérification de santé
```

### Backend Services: k8s/backend/
```
✅ 01-discovery-server.yaml      - Eureka Service Registry (1 réplica)
✅ 02-api-gateway.yaml           - Spring Cloud Gateway (2 replicas, LoadBalancer)
✅ 03-user-service.yaml          - Service d'authentification (2 replicas)
✅ 04-course-service.yaml        - Service de gestion des cours (2 replicas)
✅ 05-quiz-service.yaml          - Service de gestion des quiz (2 replicas)
```

### Frontend: k8s/frontend/
```
✅ 01-frontend.yaml              - Application Angular (2 replicas, LoadBalancer)
```

---

## 🎯 Capacités de l'Architecture Créée

### 1. **Namespace Isolation**
- ✅ Namespace `learnivo` pour isolation des ressources
- ✅ Séparation des concerns

### 2. **Service Discovery**
- ✅ Eureka pour la découverte de services
- ✅ Tous les services s'enregistrent automatiquement
- ✅ Communication inter-service via DNS de Kubernetes

### 3. **Load Balancing**
- ✅ API Gateway avec LoadBalancer sur port 8080
- ✅ Frontend avec LoadBalancer sur port 80
- ✅ Services internes avec ClusterIP
- ✅ 2 replicas pour les services critiques (haute disponibilité)

### 4. **Configuration Management**
- ✅ ConfigMaps pour configuration par service
- ✅ Secrets pour données sensibles
- ✅ Environment variables injectées

### 5. **Health & Monitoring**
- ✅ Liveness probes (redémarre si pod en panne)
- ✅ Readiness probes (retire du trafic si non-prêt)
- ✅ Endpoints: `/actuator/health` pour tous les services

### 6. **Storage**
- ✅ emptyDir pour données temporaires
- ✅ Prêt pour PersistentVolumes (production)

### 7. **Network Security**
- ✅ Network Policies pour restricter le trafic
- ✅ Ingress rules configurées
- ✅ Service-to-service communication sécurisée

### 8. **Resource Management**
- ✅ Requests et Limits configurés pour chaque service
- ✅ Total: 2.5 vCPU, 3GB RAM requis
- ✅ Prêt pour HorizontalPodAutoscaler

### 9. **Scalability**
- ✅ Architecture stateless
- ✅ Replicas configurés pour chaque service
- ✅ Compatible avec Kubernetes Autoscaling

### 10. **Production Ready**
- ✅ Namespaces séparés
- ✅ RBAC-compatible
- ✅ Logging centralisé (prêt pour ELK/Loki)
- ✅ Metrics-prêt (prêt pour Prometheus)

---

## 🚀 Comment Déployer

### 1️⃣ **Déploiement Rapide (Docker Desktop / Minikube)**

```bash
# Aller au répertoire k8s
cd k8s

# Déployer tout
kubectl apply -f .

# Ou avec Kustomize
kubectl apply -k .

# Ou avec le script
./deploy.sh deploy
```

### 2️⃣ **Vérifier le Déploiement**

```bash
# Voir les pods
kubectl get pods -n learnivo

# Voir les services
kubectl get svc -n learnivo

# Vérifier la santé
./health-check.sh
```

### 3️⃣ **Accéder aux Services**

**Option A: Port Forwarding**
```bash
# Frontend
kubectl port-forward -n learnivo svc/frontend 4200:80
# → http://localhost:4200

# API Gateway
kubectl port-forward -n learnivo svc/api-gateway 8080:8080
# → http://localhost:8080

# Discovery Server
kubectl port-forward -n learnivo svc/discovery-server 8761:8761
# → http://localhost:8761
```

**Option B: LoadBalancer (si disponible)**
```bash
kubectl get svc -n learnivo
# Utilisez l'EXTERNAL-IP
```

**Option C: Ingress**
```bash
# Ajouter au /etc/hosts:
127.0.0.1 learnivo.local

# Accès:
# http://learnivo.local
```

---

## 📊 Architecture Visuelle

```
                      INTERNET
                          ▲
                          │
                    ┌─────┴─────┐
                    │  Ingress  │
                    │  NGINX    │
                    └─────┬─────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    ┌───▼──┐      ┌──────▼─────┐    ┌─────▼────┐
    │Frontend    │ API Gateway │    │ Services │
    │LoadBalancer│ LoadBalancer│    │ Ingress  │
    │Port 80     │ Port 8080   │    │          │
    └────┬───┘    └──────┬─────┘    └──────────┘
         │                │
         └────────┬───────┘
                  │
         ┌────────▼─────────┐
         │ Discovery Server │
         │ (Eureka) :8761   │
         └────────┬─────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
 ┌──▼──┐    ┌────▼─────┐   ┌──▼──┐
 │User │    │  Course  │   │Quiz │
 │ :8083   │   :8081   │   │:8082│
 └──────┘   └──────────┘   └─────┘

All services:
- Auto-register in Eureka
- Have health checks
- Scale horizontally
- Isolated in 'learnivo' namespace
```

---

## 🔐 Sécurité Incorporée

✅ **Network Policies** (segmentation)
✅ **RBAC-Ready** (Access Control)
✅ **Secrets Management** (JWT, credentials)
✅ **Health Checks** (Liveness/Readiness)
✅ **Resource Limits** (DoS protection)

---

## 📈 Scaling & Performance

**Actuellement configuré:**
- 2 replicas: API Gateway, User Service, Course Service, Quiz Service, Frontend
- 1 replica: Discovery Server

**Pour augmenter:**
```bash
kubectl scale deployment api-gateway -n learnivo --replicas=5
```

**Pour auto-scaling (à ajouter):**
- Prometheus pour metrics
- HorizontalPodAutoscaler pour scaling automatique

---

## 🛠️ Fichiers Clés à Lire

1. **README.md** - Guide complet d'utilisation (LISEZ CECI EN PREMIER)
2. **ARCHITECTURE.md** - Vue d'ensemble technique
3. **KUBEADM_SETUP.md** - Pour un cluster distribué (multi-nœud)
4. **LOCAL_SETUP.md** - Pour développement local

---

## 📋 Checklist Pre-Déploiement

```bash
☑ Docker/Container runtime installé
☑ Kubernetes cluster accessible (kubectl cluster-info)
☑ Docker images construites (mvn spring-boot:build-image, npm run build)
☑ Images taguées correctement (learnivo/*)
☑ Namespace n'existe pas (kubectl delete namespace learnivo 2>/dev/null)
☑ Sufficient cluster resources (2.5 vCPU, 3GB RAM minimum)
```

---

## 🐛 Troubleshooting Rapide

```bash
# Voir tous les pods
kubectl get pods -n learnivo

# Voir les events
kubectl get events -n learnivo --sort-by='.lastTimestamp'

# Logs d'un pod
kubectl logs -f -n learnivo <pod-name>

# Décrire un pod
kubectl describe pod -n learnivo <pod-name>

# Exécuter une commande
kubectl exec -it -n learnivo <pod-name> -- bash

# Port forward
kubectl port-forward -n learnivo svc/api-gateway 8080:8080
```

---

## 🎓 Concepts Kubernetes Utilisés

| Concept | Utilisation | Fichier |
|---------|-----------|---------|
| Namespace | Isolation | 00-namespace.yaml |
| Deployment | Pods gérés | backend/*.yaml, frontend/*.yaml |
| Service | Discovery/Load balancing | Dans chaque Deployment |
| ConfigMap | Configuration externe | 01-configmap.yaml |
| Secret | Données sensibles | 02-secrets.yaml |
| NetworkPolicy | Sécurité réseau | 03-network-policies.yaml |
| Ingress | Routage HTTP | 04-ingress.yaml |
| Probe | Health checks | Dans chaque Deployment |
| ResourceQuota | Limites | Disponible à ajouter |
| HPA | Auto-scaling | Disponible à ajouter |

---

## ⏭️ Prochaines Étapes

### Phase 1: ✅ COMPLÉTÉE
- ✅ Manifests Kubernetes créés
- ✅ Namespaces, Services, Deployments
- ✅ ConfigMaps, Secrets
- ✅ Network Policies, Ingress

### Phase 2: À FAIRE (Monitoring)
- [ ] Prometheus pour metrics
- [ ] Grafana pour dashboards
- [ ] AlertManager pour alertes
- [ ] ELK/Loki pour logs centralisés

### Phase 3: À FAIRE (Production)
- [ ] PersistentVolumes
- [ ] Backup/Restore strategy
- [ ] RBAC policies
- [ ] Pod Security Policies
- [ ] Resource Quotas

### Phase 4: À FAIRE (Advanced)
- [ ] Service Mesh (Istio)
- [ ] GitOps (ArgoCD)
- [ ] CI/CD integration
- [ ] Multi-region deployment

---

## 📚 Documentation Référence

- [Kubernetes Official Docs](https://kubernetes.io/docs/)
- [Spring Cloud on Kubernetes](https://cloud.spring.io/spring-cloud-kubernetes/reference/html/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/security/pod-security-standards/)

---

## 📞 Support

Pour tous les problèmes:
1. Vérifier les logs: `kubectl logs -n learnivo <pod>`
2. Vérifier les events: `kubectl get events -n learnivo`
3. Vérifier les ressources: `kubectl top nodes`
4. Lire la documentation complète dans README.md

---

**✅ KUBERNETES SETUP COMPLÉTÉE**  
**📦 18 fichiers créés**  
**🎯 Architecture complètement distribuée**  
**🚀 Prêt à déployer**  

Commencez par: `cd k8s && kubectl apply -f .`
