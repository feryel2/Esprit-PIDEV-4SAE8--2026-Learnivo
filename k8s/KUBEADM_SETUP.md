# Kubernetes Setup Guide (kubeadm)

Ce guide vous aide à configurer un cluster Kubernetes entièrement distribué avec `kubeadm` pour déployer Learnivo.

## Option recommandée (groupe): Lab Vagrant + VirtualBox (reproductible)

Pour répondre aux exigences “**architecture distribuée**”, “**kubeadm**” et “**environnement de virtualisation commun**”, utilisez le lab prêt à l’emploi du dépôt:

- Dossier: `k8s/kubeadm-lab/`
- Doc: `k8s/kubeadm-lab/README.md`

### Démarrage rapide

Sur la machine hôte (Windows/Linux/macOS):

```bash
cd k8s/kubeadm-lab
vagrant up
```

Puis:

```bash
vagrant ssh learnivo-cp
kubectl get nodes -o wide
```

Déployer Learnivo depuis la VM control-plane (le repo est monté dans `/vagrant`):

```bash
cd /vagrant
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/01-configmap.yaml
kubectl apply -f k8s/02-secrets.yaml
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
```

## Architecture Distribuée Recommandée

```
┌─────────────────────────────────────┐
│     Master Node (Control Plane)     │
│  (1 CPU, 2GB RAM minimum)           │
│  - kube-apiserver                   │
│  - kube-scheduler                   │
│  - kube-controller-manager          │
│  - etcd                             │
└─────────────────────────────────────┘
            │
            ├──────────────────────┬──────────────────────┐
            │                      │                      │
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│  Worker Node 1    │  │  Worker Node 2    │  │  Worker Node 3    │
│  (2 CPU, 4GB RAM) │  │  (2 CPU, 4GB RAM) │  │  (2 CPU, 4GB RAM) │
│                   │  │                   │  │                   │
│ - kubelet         │  │ - kubelet         │  │ - kubelet         │
│ - kube-proxy      │  │ - kube-proxy      │  │ - kube-proxy      │
│ - Container Rntime│  │ - Container Rntime│  │ - Container Rntime│
└───────────────────┘  └───────────────────┘  └───────────────────┘
```

## Prérequis

### Matériel
- **Master**: 2 vCPU, 2GB RAM, 20GB storage
- **Worker** (x3): 2 vCPU, 4GB RAM, 30GB storage chacun
- **Total**: 8 vCPU, 14GB RAM minimum

### Système d'Exploitation
- Ubuntu 20.04 LTS ou supérieur
- CentOS 7 ou supérieur
- RHEL 8 ou supérieur
- Debian 10 ou supérieur

### Réseau
- Communication entière entre master et workers
- Accès internet pour télécharger images/binaires
- Ports ouverts:
  - Master: 6443 (API), 2379-2380 (etcd), 10250-10252 (kubelet), 30000-32767 (NodePort)
  - Worker: 10250 (kubelet), 10255 (read-only), 30000-32767 (NodePort)

### Logiciels
- Docker ou CRI-O (container runtime)
- kubeadm, kubelet, kubectl
- wget/curl
- bash

## Étape 1: Préparation des Nœuds (Tous les Nœuds)

### 1.1 Mettre à jour le système

```bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y curl wget apt-transport-https ca-certificates
```

### 1.2 Installer Docker

```bash
# Ajouter la clé GPG de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Ajouter le repository Docker
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) stable"

# Installer Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker
```

### 1.3 Configurer les paramètres système

```bash
# Désactiver swap
sudo swapoff -a
sudo sed -i '/ swap / s/^/#/' /etc/fstab

# Charger les modules kernel requis
sudo cat > /etc/modules-load.d/kubernetes.conf << EOF
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# Configurer les paramètres kernel
sudo cat > /etc/sysctl.d/kubernetes.conf << EOF
net.bridge.bridge-nf-call-iptables = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward = 1
EOF

sudo sysctl -p /etc/sysctl.d/kubernetes.conf
```

### 1.4 Installer kubeadm, kubelet, kubectl

```bash
# Ajouter la clé GPG Kubernetes
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -

# Ajouter le repository Kubernetes
sudo apt-add-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main"

# Installer les binaires
sudo apt-get update
sudo apt-get install -y kubeadm kubelet kubectl

# Empêcher les mises à jour automatiques
sudo apt-mark hold kubeadm kubelet kubectl

# Vérifier les versions
kubeadm version
kubectl version --client
kubelet --version
```

## Étape 2: Initialiser le Master Node

```bash
# Générer les fichiers de configuration
sudo kubeadm config print init-defaults > kubeadm-config.yaml

# Éditer le fichier pour configurer:
# - advertiseAddress: IP du master
# - kubernetesVersion: version K8s
# - podSubnet: 10.244.0.0/16 (pour Flannel)

sudo nano kubeadm-config.yaml
```

### Exemple de kubeadm-config.yaml

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
kubernetesVersion: v1.28.0
controlPlaneEndpoint: "192.168.1.100:6443"  # IP du master
networking:
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.96.0.0/12
---
apiVersion: kubeadm.k8s.io/v1beta3
kind: InitConfiguration
nodeRegistration:
  kubeletExtraArgs:
    node-ip: 192.168.1.100  # IP du master
```

### Initialiser le cluster

```bash
# Initialiser le master
sudo kubeadm init --config kubeadm-config.yaml

# Si vous voulez utiliser un subnet personnalisé:
# sudo kubeadm init --pod-network-cidr=10.244.0.0/16 --apiserver-advertise-address=192.168.1.100
```

### Copier kubeconfig

```bash
# Pour l'utilisateur courant
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# Vérifier que kubeadm fonctionne
kubectl get nodes
kubectl get pods -n kube-system
```

## Étape 3: Installer un Plugin de Réseau (Master)

Installer Flannel pour la communication inter-pod:

```bash
kubectl apply -f https://github.com/coreos/flannel/raw/master/Documentation/kube-flannel.yml

# Vérifier que les pods système fonctionnent
kubectl get pods -n kube-flannel
kubectl get nodes  # STATUS devrait passer à "Ready"
```

**Alternatives à Flannel:**
- **Weave**: `kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"`
- **Calico**: `kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/tigera-operator.yaml`
- **Cilium**: Voir documentation Cilium

## Étape 4: Joindre les Worker Nodes

### 4.1 Générer le token de jointure (sur le master)

```bash
# Lister les tokens existants
kubeadm token list

# Créer un nouveau token (valide 24h)
kubeadm token create --print-join-command

# Exemple de sortie:
# kubeadm join 192.168.1.100:6443 --token abc123.xyz789 --discovery-token-ca-cert-hash sha256:abcd...
```

### 4.2 Joindre chaque worker (sur chaque worker node)

```bash
# Remplacer par la commande du master
sudo kubeadm join 192.168.1.100:6443 \
  --token abc123.xyz789 \
  --discovery-token-ca-cert-hash sha256:abcd...

# Vérifier sur le master
kubectl get nodes  # Tous les nœuds devraient apparaître
kubectl get nodes -o wide  # Voir les IPs
```

## Étape 5: Configurer les Rôles des Nœuds

```bash
# Label les workers (optionnel)
kubectl label nodes <worker1-name> node-role.kubernetes.io/worker=worker
kubectl label nodes <worker2-name> node-role.kubernetes.io/worker=worker
kubectl label nodes <worker3-name> node-role.kubernetes.io/worker=worker

# Empêcher le master de scheduler des pods applicatifs
kubectl taint nodes <master-name> node-role.kubernetes.io/master=true:NoSchedule
```

## Étape 6: Installer un Ingress Controller (Master)

NGINX Ingress Controller:

```bash
# Ajouter le repo Helm
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Installer NGINX Ingress
helm install ingress-nginx ingress-nginx/ingress-nginx \
  -n ingress-nginx --create-namespace \
  --set controller.service.type=NodePort \
  --set controller.service.nodePorts.http=30080 \
  --set controller.service.nodePorts.https=30443

# Vérifier l'installation
kubectl get svc -n ingress-nginx
```

## Étape 7: Déployer Learnivo

```bash
# Cloner le repository
git clone <repo-url>
cd Esprit-PIDEV-4SAE8--2026-Learnivo

# Déployer avec les scripts fournis
cd k8s

# Option 1: Déploiement manuel
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-configmap.yaml
kubectl apply -f 02-secrets.yaml
kubectl apply -f backend/
kubectl apply -f frontend/
kubectl apply -f 03-network-policies.yaml
kubectl apply -f 04-ingress.yaml

# Option 2: Utiliser kustomize
kubectl apply -k .

# Option 3: Utiliser le script
chmod +x deploy.sh
./deploy.sh deploy
```

## Étape 8: Vérifier le Déploiement

```bash
# Vérifier tous les pods
kubectl get pods -n learnivo

# Vérifier les services
kubectl get svc -n learnivo

# Vérifier les ingress
kubectl get ingress -n learnivo

# Obtenir les IPs externes
kubectl get svc -n learnivo -o wide

# Voir les logs
kubectl logs -f -n learnivo <pod-name>
```

## Accéder à Learnivo

### Via IP du Worker + NodePort

```bash
# Obtenir les IPs des workers
kubectl get nodes -o wide

# Accéder au frontend
# http://<worker-ip>:30080

# Accéder à l'API Gateway
# http://<worker-ip>:30080/api
```

### Via DNS (Ingress)

Ajouter à `/etc/hosts`:
```
192.168.1.101 learnivo.local api.learnivo.local
```

Accès:
- http://learnivo.local (frontend)
- http://api.learnivo.local/api (API gateway)

### Via LoadBalancer externe

Si vous utilisez un cloud provider (AWS, Azure, GCP):
```bash
kubectl get svc -n learnivo frontend
# Voir l'IP EXTERNAL-IP
```

## Maintenance

### Ajouter un nouveau worker

```bash
# Sur le master, créer un nouveau token
kubeadm token create --print-join-command

# Sur le nouveau worker, exécuter la commande
sudo kubeadm join ...
```

### Mettre à jour Kubernetes

```bash
# Sur tous les nœuds
sudo apt-get update
sudo apt-get upgrade -y kubeadm

# Sur le master
sudo kubeadm upgrade plan
sudo kubeadm upgrade apply v1.29.0

# Sur chaque worker (un à la fois)
kubectl drain <worker> --ignore-daemonsets --delete-emptydir-data
sudo kubeadm upgrade node
kubectl uncordon <worker>
```

### Sauvegarder etcd

```bash
sudo ETCDCTL_API=3 etcdctl \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key \
  snapshot save /backup/etcd-backup.db
```

### Restaurer un cluster

```bash
# En cas d'urgence
sudo kubeadm reset
# Puis réinitialiser depuis zéro
```

## Troubleshooting

### Master ne démarre pas

```bash
# Vérifier les logs du master
sudo journalctl -u kubelet -f

# Vérifier les images Docker
docker images | grep k8s

# Vérifier les services
sudo systemctl status kubelet
```

### Worker ne se joint pas

```bash
# Vérifier le token
kubeadm token list

# Créer un nouveau token
kubeadm token create --print-join-command

# Sur le worker, vérifier la connectivité
ping <master-ip>
nc -zv <master-ip> 6443
```

### Pods ne démarrent pas

```bash
# Vérifier les nodes
kubectl describe nodes

# Vérifier les events
kubectl get events -n learnivo

# Vérifier les logs des pods
kubectl logs -f -n learnivo <pod>
kubectl describe pod -n learnivo <pod>
```

### CNI (Flannel) ne démarre pas

```bash
# Réinstaller Flannel
kubectl delete -f https://github.com/coreos/flannel/raw/master/Documentation/kube-flannel.yml
kubectl apply -f https://github.com/coreos/flannel/raw/master/Documentation/kube-flannel.yml

# Vérifier les pods Flannel
kubectl get pods -n kube-flannel
```

## Nettoyage Complet

```bash
# Sur un worker
sudo kubeadm reset

# Sur le master (ATTENTION: irréversible)
sudo kubeadm reset --force
```

## Ressources Supplémentaires

- [Documentation kubeadm officielle](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/)
- [Certification CKA - Kubernetes Administration](https://www.cncf.io/certification/cka/)
- [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way)
