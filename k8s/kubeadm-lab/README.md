## Kubeadm Lab (Vagrant + VirtualBox)

Ce dossier fournit **un environnement de virtualisation commun** (Windows/Linux/macOS) pour déployer un cluster Kubernetes **multi-nœuds** avec `kubeadm`, puis déployer Learnivo via les manifests du dossier `k8s/`.

### Prérequis (machine hôte)

- **VirtualBox** installé
- **Vagrant** installé
- CPU virtualization activée (VT-x/AMD-V)
- RAM recommandée: **16 GB** (minimum 12 GB)

### Topologie

- `learnivo-cp` (control-plane) : 2 vCPU / 2 GB RAM (**single node**)

Réseau privé Vagrant: `192.168.56.0/24`
- Control-plane: `192.168.56.10`

### Démarrer le cluster

Depuis la racine du dépôt:

```bash
cd k8s/kubeadm-lab
vagrant up
```

Après provisioning, le cluster est prêt et le fichier kubeconfig est copié sur la VM control-plane:

```bash
vagrant ssh learnivo-cp
kubectl get nodes -o wide
```

### Déployer Learnivo sur le cluster

Toujours sur `learnivo-cp`:

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

Puis ouvrir dans le navigateur de l’hôte:
- `http://127.0.0.1:4200`

### Reset / rebuild

```bash
vagrant destroy -f
vagrant up
```

### Notes importantes

- Le provisioning installe **containerd** (runtime), `kubeadm/kubelet/kubectl`, applique un CNI (Calico) et joint automatiquement les workers.
- Les VMs montent le repo via `/vagrant` (dossier partagé Vagrant), ce qui permet d’appliquer directement les manifests `k8s/`.
- Si votre PC a peu de RAM (ex: 6–8 GB), fermez un maximum d’applications avant `vagrant up` sinon le control-plane peut “flapper” (API server instable).

