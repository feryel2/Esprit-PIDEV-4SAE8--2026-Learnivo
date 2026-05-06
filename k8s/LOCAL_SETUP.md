# Docker Compose pour Kubernetes Local (Minikube/Docker Desktop)

Utilisez ce guide pour déployer Learnivo localement avec Kubernetes intégré.

## Options Locales

### Option 1: Docker Desktop (Windows/Mac)

#### Installation

1. Télécharger et installer [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Activer Kubernetes dans Docker Desktop Settings

#### Vérification

```bash
kubectl version
kubectl get nodes
```

#### Déployer Learnivo

```bash
cd k8s
kubectl apply -f .
```

#### Accéder aux services

```bash
# Port forwarding
kubectl port-forward -n learnivo svc/frontend 4200:80
kubectl port-forward -n learnivo svc/api-gateway 8080:8080

# Puis accéder à:
# Frontend: http://localhost:4200
# API: http://localhost:8080
```

---

### Option 2: Minikube (Linux/Mac/Windows)

#### Installation

```bash
# Linux
curl -LO https://github.com/kubernetes/minikube/releases/download/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Mac
brew install minikube

# Windows (Chocolatey)
choco install minikube
```

#### Démarrer Minikube

```bash
# Créer un cluster avec 4 CPUs et 4GB RAM
minikube start --cpus=4 --memory=4096 --driver=docker

# Ou avec VirtualBox
minikube start --cpus=4 --memory=4096 --driver=virtualbox

# Installer Ingress addon
minikube addons enable ingress
```

#### Vérification

```bash
minikube status
kubectl get nodes
```

#### Déployer Learnivo

```bash
# Pointer Docker vers Minikube
eval $(minikube docker-env)

# Builder les images
# (voir instructions dans k8s/README.md)

# Déployer
cd k8s
kubectl apply -f .
```

#### Accéder aux services

```bash
# Obtenez l'IP Minikube
minikube ip

# Accès via IP + NodePort
# Frontend: http://<minikube-ip>:30080
# API: http://<minikube-ip>:30080/api

# Ou via DNS avec ingress
echo "127.0.0.1 learnivo.local" >> /etc/hosts
minikube tunnel &
# Accès: http://learnivo.local
```

#### Commandes utiles

```bash
# Ouvrir le dashboard
minikube dashboard

# Logs en direct
minikube logs

# SSH dans Minikube
minikube ssh

# Arrêter Minikube
minikube stop

# Supprimer Minikube
minikube delete
```

---

### Option 3: Kind (Kubernetes In Docker)

#### Installation

```bash
# macOS
brew install kind

# Linux
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/

# Windows (Chocolatey)
choco install kind
```

#### Créer un cluster

```bash
# Cluster simple
kind create cluster

# Cluster multi-nœud
cat > kind-config.yaml << EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
- role: worker
- role: worker
- role: worker
EOF

kind create cluster --config kind-config.yaml
```

#### Déployer Learnivo

```bash
# Charger les images dans Kind
kind load docker-image learnivo/frontend:latest
kind load docker-image learnivo/api-gateway:latest
# ... charger toutes les images

# Déployer
kubectl apply -f k8s/
```

#### Accéder aux services

```bash
# Port forwarding
kubectl port-forward -n learnivo svc/frontend 4200:80
kubectl port-forward -n learnivo svc/api-gateway 8080:8080

# Puis: http://localhost:4200
```

---

## Comparaison des Options

| Option | Système | Facilité | Ressources | Production-like |
|--------|---------|----------|-----------|-----------------|
| Docker Desktop | Win/Mac | ⭐⭐⭐⭐⭐ | 💻💻💻 | ⭐⭐⭐ |
| Minikube | Lin/Mac/Win | ⭐⭐⭐⭐ | 💻💻💻💻 | ⭐⭐⭐ |
| Kind | Lin/Mac/Win | ⭐⭐⭐⭐ | 💻💻 | ⭐⭐ |
| kubeadm | Lin | ⭐⭐ | 💻💻💻💻 | ⭐⭐⭐⭐⭐ |

---

## Dépannage

### Les pods ne démarrent pas

```bash
# Vérifier les events
kubectl describe pods -n learnivo

# Vérifier les logs
kubectl logs -f -n learnivo <pod-name>

# Vérifier les ressources
kubectl top nodes
kubectl top pods -n learnivo
```

### Images non trouvées

```bash
# Pour Docker Desktop/Minikube:
docker build -t learnivo/frontend:latest frontend/

# Pour Kind: charger l'image
kind load docker-image learnivo/frontend:latest
```

### Stockage

```bash
# Docker Desktop/Minikube: stockage automatique
# Kind: utilise les volumes du host

# Vérifier les PVs
kubectl get pv
kubectl get pvc -n learnivo
```

### Suppression complète

```bash
# Docker Desktop
# - Réinitialiser Kubernetes depuis Settings
# - Ou: rm -rf ~/.kube ~/.docker

# Minikube
minikube delete

# Kind
kind delete cluster
```
