# Quick Start Guide - Kubeadm Cluster with Calico

Guide rapide pour initialiser et vérifier un cluster Kubernetes avec kubeadm et Calico CNI.

## Prérequis

- **VirtualBox** installé
- **Vagrant** installé
- **16 GB RAM** disponible (12 GB minimum)
- **CPU virtualization** activée (VT-x/AMD-V)

## Configuration Rapide (Mode Single Node)

```bash
# 1. Démarrer le cluster (contrôle-plan uniquement)
cd k8s/kubeadm-lab
vagrant up

# 2. SSH dans la VM du contrôle-plan
vagrant ssh learnivo-cp

# 3. Vérifier l'état du cluster
kubectl get nodes -o wide
kubectl get pods -n kube-system -o wide
```

### Résultat attendu après démarrage

```
NAME          STATUS   ROLES           AGE     VERSION
learnivo-cp   Ready    control-plane   2m30s   v1.30.x
```

## Configuration Distribuée (Mode Multi Nodes)

Pour un cluster avec 1 control-plane + 3 worker nodes:

### Étape 1: Activer les workers dans le Vagrantfile

Éditez `k8s/kubeadm-lab/Vagrantfile` et changez:

```ruby
ENABLE_WORKERS = false  # Changez à true
```

### Étape 2: Démarrer le cluster complet

```bash
cd k8s/kubeadm-lab
vagrant destroy -f  # Si nécessaire
vagrant up

# Attendez 5-10 minutes pour le provisioning complet
vagrant ssh learnivo-cp

# Vérifier tous les nœuds
kubectl get nodes -o wide
```

### Résultat attendu

```
NAME          STATUS   ROLES           AGE      VERSION
learnivo-cp   Ready    control-plane   10m      v1.30.x
learnivo-w1   Ready    <none>          7m       v1.30.x
learnivo-w2   Ready    <none>          7m       v1.30.x
learnivo-w3   Ready    <none>          7m       v1.30.x
```

## Vérification du Cluster

### Méthode 1: Script de vérification automatique

```bash
# Sur la VM du contrôle-plan
cd /vagrant
bash k8s/kubeadm-lab/verify-cluster.sh
```

### Méthode 2: Vérification manuelle

```bash
# État des nœuds
kubectl get nodes -o wide

# Composants du contrôle-plan
kubectl get pods -n kube-system -l tier=control-plane -o wide

# CNI (Calico)
kubectl get pods -n kube-system -l k8s-app=calico-node -o wide

# DNS (CoreDNS)
kubectl get pods -n kube-system -l k8s-app=kube-dns -o wide

# kube-proxy
kubectl get pods -n kube-system -l k8s-app=kube-proxy -o wide

# Tous les pods système
kubectl get pods -n kube-system -o wide
```

## Phases d'Initialisation

### Phase 1: Runtime Conteneur (containerd)
- Installation et configuration de containerd
- Actuel dans `provision/common.sh`

### Phase 2: Initialisation Kubernetes
```
kubeadm init \
  --apiserver-advertise-address=192.168.56.10 \
  --pod-network-cidr=192.168.0.0/16 \
  --cri-socket unix:///run/containerd/containerd.sock
```

### Phase 3: Configuration kubectl
- Copie du kubeconfig
- Permissions appropriées

### Phase 4: Installation du CNI (Calico)
```bash
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.27.3/manifests/calico.yaml
```

### Phase 5: Attente du Node Ready
- Le nœud passe à l'état "Ready" une fois que:
  - API server est actif
  - CNI (Calico) est installé et prêt
  - kubelet est en bonne santé

### Phase 6: Génération de Join Command
- Génération du token pour les workers
- Sauvegarde dans `/vagrant/k8s/kubeadm-lab/join.sh`

### Phase 7: Join des Workers
- Les workers utilisent le join command
- Attente du status "Ready"

## Points de Contrôle Clés

| Phase | Vérification | Commande |
|-------|-------------|----------|
| API Ready | API server répond | `kubectl get --raw=/readyz` |
| Calico Ready | Pods Calico en Running | `kubectl get pods -n kube-system -l k8s-app=calico-node` |
| Node Ready | Nœud passe à Ready | `kubectl get nodes` |
| DNS Ready | CoreDNS en Running | `kubectl get pods -n kube-system -l k8s-app=kube-dns` |

## Déploiement de Learnivo

Une fois le cluster prêt:

```bash
cd /vagrant

# Déployer les ressources
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/01-configmap.yaml
kubectl apply -f k8s/02-secrets.yaml
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/

# Vérifier le déploiement
kubectl get pods -n learnivo -o wide
kubectl get svc -n learnivo

# Port-forward pour accéder à l'application
kubectl port-forward -n learnivo svc/frontend 4200:80
```

Ouvrir: `http://127.0.0.1:4200`

## Dépannage

### Le cluster n'initialise pas

```bash
# Vérifier les logs du provisioning
vagrant ssh learnivo-cp
tail -f /tmp/control-plane.log
tail -f /tmp/worker.log
```

### Les nœuds restent en attente de CNI

```bash
# Vérifier le status de Calico
kubectl describe pod -n kube-system -l k8s-app=calico-node

# Vérifier les logs
kubectl logs -n kube-system -l k8s-app=calico-node --tail=50
```

### Workers ne rejoignent pas

```bash
# Sur le worker, vérifier les logs
vagrant ssh learnivo-w1
tail -f /tmp/worker.log

# Sur le control-plane, vérifier join.sh
cat /vagrant/k8s/kubeadm-lab/join.sh

# Vérifier les certificats
sudo kubeadm token list
```

### Test de connectivité réseau

```bash
# Créer un pod test
kubectl run test-pod --image=busybox:latest --restart=Never -- sleep 300

# Test DNS
kubectl exec test-pod -- nslookup kubernetes.default

# Test connectivité inter-pod
kubectl run test-pod2 --image=busybox:latest --restart=Never -- sleep 300
kubectl exec test-pod -- ping <IP-test-pod2>

# Nettoyage
kubectl delete pod test-pod test-pod2
```

## Ressources Utilisées

### Single Node (recommandé pour développement)
- CPU: 4 vCPU
- RAM: 8 GB
- Stockage: 20 GB

### Multi Node (architecture distribuée)
- Control-plane: 4 vCPU, 8 GB RAM, 20 GB stockage
- Worker (x3): 2 vCPU, 4 GB RAM, 30 GB stockage chacun
- **Total: 10 vCPU, 20 GB RAM, 110 GB stockage**

## Informations de Réseau

Réseau privé Vagrant: `192.168.56.0/24`

| Nœud | IP | Rôle |
|------|---|----|
| learnivo-cp | 192.168.56.10 | Control-plane |
| learnivo-w1 | 192.168.56.11 | Worker 1 |
| learnivo-w2 | 192.168.56.12 | Worker 2 |
| learnivo-w3 | 192.168.56.13 | Worker 3 |

## Ports Forwardés (vers l'hôte)

- **4200** → Frontend (Angular)
- **8080** → API Gateway
- **8761** → Eureka (Discovery Server)
- **6443** → API Server (kubectl)

## Réinitialisation Complète

Pour recommencer à zéro:

```bash
cd k8s/kubeadm-lab
vagrant destroy -f
vagrant up

# Ou manuellement depuis la VM
sudo kubeadm reset -f
sudo rm -rf ~/.kube
vagrant provision
```

## Logs Importants

Sur la VM du contrôle-plan:

```bash
# Logs de provisioning
/tmp/control-plane.log
/tmp/worker.log

# Logs Kubernetes
sudo journalctl -u kubelet -n 50
sudo journalctl -u containerd -n 50

# Logs Calico
kubectl logs -n kube-system -l k8s-app=calico-node --tail=100
```

## Références

- [kubeadm Documentation](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/)
- [Calico Networking](https://docs.projectcalico.org/)
- [Vagrant Documentation](https://www.vagrantup.com/docs)

---

**Dernière mise à jour**: 2026-05-06
**Version Kubernetes**: 1.30
**Version Calico**: 3.27.3
