## Kubeadm Lab (Vagrant + VirtualBox)

Ce dossier fournit **un environnement de virtualisation commun** (Windows/Linux/macOS) pour déployer un cluster Kubernetes **multi-nœuds** avec `kubeadm`, puis déployer Learnivo via les manifests du dossier `k8s/`.

### 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** ← Commencez par ici!
  - Guide rapide d'initialisation
  - Configuration single-node vs multi-node
  - Vérification du cluster
  - Dépannage

- **[verify-cluster.sh](verify-cluster.sh)**
  - Script de vérification automatique
  - Diagnostique complet du cluster
  - Tests de connectivité

### Prérequis (machine hôte)

- **VirtualBox** installé
- **Vagrant** installé
- CPU virtualization activée (VT-x/AMD-V)
- RAM recommandée: **16 GB** (minimum 12 GB)

### Topologie

#### Mode Single Node (par défaut)
- `learnivo-cp` (control-plane) : 4 vCPU / 8 GB RAM

Réseau privé Vagrant: `192.168.56.0/24`
- Control-plane: `192.168.56.10`

#### Mode Multi Node (optionnel)
- `learnivo-cp` (control-plane) : 4 vCPU / 8 GB RAM
- `learnivo-w1` (worker) : 2 vCPU / 4 GB RAM
- `learnivo-w2` (worker) : 2 vCPU / 4 GB RAM
- `learnivo-w3` (worker) : 2 vCPU / 4 GB RAM

### Démarrage Rapide

Depuis la racine du dépôt:

```bash
cd k8s/kubeadm-lab
vagrant up
```

Après provisioning (5-10 minutes), le cluster est prêt:

```bash
vagrant ssh learnivo-cp
kubectl get nodes -o wide
```

### Vérification Complète

```bash
# Depuis la VM du contrôle-plan
bash /vagrant/k8s/kubeadm-lab/verify-cluster.sh
```

Ce script vérifie:
- ✓ Connectivité kubectl
- ✓ État des nœuds (Ready)
- ✓ Composants du contrôle-plan
- ✓ CNI (Calico) installé et prêt
- ✓ CoreDNS actif
- ✓ kube-proxy en place
- ✓ Connectivité réseau des pods

### Initialisation Complète du Contrôle-Plan

Le provisioning automatique exécute ces phases:

1. **Préparation commune** (`provision/common.sh`)
   - Mise à jour système
   - Désactiver swap
   - Modules kernel (overlay, br_netfilter)
   - Installation containerd (CRI)
   - Installation kubeadm/kubelet/kubectl

2. **Initialisation Kubernetes** (`provision/control-plane.sh`)
   - `kubeadm init` avec configuration kubeadm
   - Configuration kubectl
   - Attente API server prêt (60 tentatives × 5s)
   - Installation Calico CNI (v3.27.3)
   - Attente nœud Ready (60 tentatives × 5s)
   - Génération join command pour workers

3. **Join des Workers** (`provision/worker.sh`)
   - Attente du join script (5 minutes)
   - Exécution du join command
   - Vérification de l'intégration

### Déployer Learnivo sur le cluster

Une fois le cluster Ready:

```bash
cd /vagrant
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/01-configmap.yaml
kubectl apply -f k8s/02-secrets.yaml
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
```

Vérification:

```bash
kubectl get pods -n learnivo -o wide
kubectl get svc -n learnivo
```

### Accès rapide (démo)

Le plus simple pour une démo est le port-forward (depuis `learnivo-cp`). Le `Vagrantfile` forwarde déjà les ports **4200/8080/8761** de la VM vers la machine hôte.

```bash
kubectl port-forward -n learnivo svc/frontend 4200:80
```

Puis ouvrir dans le navigateur de l'hôte:
- `http://127.0.0.1:4200`

### Architecture Initialisée

```
┌─────────────────────────────────────┐
│     Control Plane (kubeadm init)    │
│     OS: Ubuntu 22.04                │
│     Runtime: containerd             │
│     CNI: Calico v3.27.3             │
│                                     │
│  - kube-apiserver       ✓ Ready     │
│  - kube-scheduler       ✓ Ready     │
│  - kube-controller-mgr  ✓ Ready     │
│  - etcd                 ✓ Ready     │
│  - calico-node          ✓ Ready     │
│  - coredns              ✓ Ready     │
│  - kube-proxy           ✓ Ready     │
└─────────────────────────────────────┘
        │  (pod-network: 192.168.0.0/16)
        │
    ┌───┴────────┬────────────┬────────────┐
    │            │            │            │
   [w1]        [w2]         [w3]         ...
(optionnel)
```

### Reset / rebuild

Recommencer à zéro:

```bash
vagrant destroy -f
vagrant up
```

Ou réinitialiser manuellement:

```bash
vagrant ssh learnivo-cp

sudo kubeadm reset -f
sudo rm -rf ~/.kube
sudo systemctl restart kubelet
```

### Configuration Multi-Node

Pour activer les worker nodes, éditez `Vagrantfile`:

```ruby
ENABLE_WORKERS = true  # ← Changez de false à true
```

Puis:

```bash
vagrant destroy -f
vagrant up
```

Attendez 5-10 minutes. Le cluster comprendra alors:
- 1 control-plane
- 3 worker nodes

Vérifiez:

```bash
vagrant ssh learnivo-cp
kubectl get nodes -o wide
```

### Notes importantes

- Les VMs montent le repo via `/vagrant` (dossier partagé Vagrant)
- Le provisioning applique **tous les prérequis** automatiquement
- Calico est installé automatiquement (POD_CIDR: `192.168.0.0/16`)
- Les tokens kubeadm expirent après 24h (créer nouveau si nécessaire)
- Si votre PC a peu de RAM, fermez les applications avant `vagrant up`

### Dépannage

```bash
# Logs de provisioning sur la VM
tail -f /tmp/control-plane.log
tail -f /tmp/worker.log

# Vérifier l'état Calico
kubectl get pods -n kube-system -l k8s-app=calico-node -o wide
kubectl logs -n kube-system -l k8s-app=calico-node --tail=50

# API server logs
sudo journalctl -u kubelet -n 50 -f

# Logs containerd
sudo journalctl -u containerd -n 50 -f
```

### Informations de Réseau

| Ressource | Valeur |
|-----------|--------|
| Pod CIDR | 192.168.0.0/16 |
| Service CIDR | 10.96.0.0/12 (default) |
| Node Network | 192.168.56.0/24 |
| API Server Port | 6443 |

### Ports Forwardés

- `4200` → Frontend
- `8080` → API Gateway
- `8761` → Eureka Discovery
- `6443` → API Server (kubectl)

### Versions

- **Kubernetes**: 1.30
- **containerd**: Latest (depuis k8s.io repo)
- **Calico**: 3.27.3
- **Ubuntu**: 22.04 LTS

### Ressources Système

**Mode Single Node:**
- CPU: 4 vCPU
- RAM: 8 GB
- Stockage: 20 GB

**Mode Multi Node (1 CP + 3 W):**
- Total CPU: 10 vCPU
- Total RAM: 20 GB
- Total Stockage: 110 GB

### Voir Aussi

- [Documentation kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/)
- [Calico Networking](https://docs.projectcalico.org/)
- [Vagrant Documentation](https://www.vagrantup.com/docs)
- [k8s/KUBEADM_SETUP.md](../KUBEADM_SETUP.md) - Setup manuel (sans Vagrant)

---

**Dernière mise à jour**: 2026-05-06
