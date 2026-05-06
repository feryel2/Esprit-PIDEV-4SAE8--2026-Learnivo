# Checklist - Initialisation Complète du Cluster kubeadm + Calico

## ✅ Pré-Initialisation (Avant vagrant up)

- [ ] VirtualBox installé et fonctionnel
  ```bash
  VBoxManage --version
  ```

- [ ] Vagrant installé et à jour
  ```bash
  vagrant --version
  ```

- [ ] CPU virtualization activée (BIOS/UEFI)
  - Vérifier dans les paramètres du BIOS VT-x (Intel) ou AMD-V

- [ ] RAM disponible (minimum 12 GB, recommandé 16 GB)
  ```bash
  # Windows PowerShell
  Get-WmiObject -Class Win32_OperatingSystem | Select-Object @{n="RAM (GB)";e={[math]::round($_.TotalVisibleMemorySize/1024/1024)}}
  ```

- [ ] Dossier k8s/kubeadm-lab accessible
  ```bash
  ls -la k8s/kubeadm-lab/
  ```

- [ ] Fichiers de provisioning présents
  - [ ] provision/common.sh
  - [ ] provision/control-plane.sh
  - [ ] provision/worker.sh
  - [ ] Vagrantfile

## 🚀 Démarrage du Cluster

- [ ] Naviguer au bon dossier
  ```bash
  cd k8s/kubeadm-lab
  pwd  # Vérifier le chemin
  ```

- [ ] Démarrer les VMs
  ```bash
  vagrant up
  ```

- [ ] Attendre la fin du provisioning (5-10 minutes)
  - [ ] Tous les provisioning scripts complétés sans erreur

- [ ] SSH dans le control-plane
  ```bash
  vagrant ssh learnivo-cp
  ```

## 📋 Phase 1: Préparation (common.sh)

**Vérifications du système:**

- [ ] Swap désactivée
  ```bash
  free -h | grep Swap
  # Résultat attendu: Swap total should be 0
  ```

- [ ] Modules kernel chargés
  ```bash
  lsmod | grep -E "overlay|br_netfilter"
  # Résultat attendu: overlay et br_netfilter listés
  ```

- [ ] Paramètres réseau configurés
  ```bash
  sudo sysctl net.ipv4.ip_forward
  # Résultat attendu: 1
  ```

**Logiciels installés:**

- [ ] containerd installé et actif
  ```bash
  sudo systemctl status containerd
  # Résultat attendu: active (running)
  ```

- [ ] containerd configuré avec systemd cgroup driver
  ```bash
  grep -i "systemdcgroup" /etc/containerd/config.toml
  # Résultat attendu: SystemdCgroup = true
  ```

- [ ] kubeadm, kubelet, kubectl installés
  ```bash
  kubeadm version
  kubelet --version
  kubectl version --client
  ```

- [ ] DNS résolu pour les nœuds
  ```bash
  grep learnivo /etc/hosts
  # Résultat attendu: 192.168.56.10 learnivo-cp (et workers si multi-node)
  ```

## 🔧 Phase 2: Initialisation kubeadm

- [ ] kubeadm init complété avec succès
  ```bash
  sudo test -f /etc/kubernetes/admin.conf && echo "✓ kubeadm init done"
  ```

- [ ] Fichier kubeconfig configuré
  ```bash
  test -f ~/.kube/config && echo "✓ kubeconfig found"
  chmod 600 ~/.kube/config
  ```

- [ ] API server répond
  ```bash
  kubectl get --raw=/healthz
  # Résultat attendu: ok
  ```

- [ ] Vérifier le pod CIDR configuré
  ```bash
  kubectl get nodes -o jsonpath='{.items[0].spec.podCIDR}'
  # Résultat attendu: 192.168.0.0/24
  ```

## 🌐 Phase 3: Installation Calico CNI

- [ ] Calico manifests appliquées
  ```bash
  kubectl get ns kube-system
  # Vérifier que kube-system existe
  ```

- [ ] Pods Calico en créance
  ```bash
  kubectl get pods -n kube-system -l k8s-app=calico-node
  # Résultat attendu: pod(s) en status "Running" ou "Pending"
  ```

- [ ] Attendre pods Calico Ready (max 5 min)
  ```bash
  kubectl wait --for=condition=ready pod -l k8s-app=calico-node \
    -n kube-system --timeout=300s
  # Résultat attendu: condition met
  ```

- [ ] Calico kube-controllers Ready
  ```bash
  kubectl get pods -n kube-system -l k8s-app=calico-kube-controllers
  # Résultat attendu: 1/1 Running
  ```

- [ ] Network policies appliquées
  ```bash
  kubectl get crd | grep calico
  # Résultat attendu: plusieurs custom resources Calico listées
  ```

## 📌 Phase 4: Join Command Généré

- [ ] Join script créé
  ```bash
  test -f /vagrant/k8s/kubeadm-lab/join.sh && echo "✓ join.sh found"
  ```

- [ ] Join script exécutable
  ```bash
  ls -la /vagrant/k8s/kubeadm-lab/join.sh
  # Résultat attendu: -rwxr-xr-x
  ```

- [ ] Join command contient des paramètres valides
  ```bash
  cat /vagrant/k8s/kubeadm-lab/join.sh | grep -E "kubeadm join|cri-socket"
  ```

## ✅ Phase 5: Node Ready

**État du nœud:**

- [ ] Nœud existe dans etcd
  ```bash
  kubectl get nodes
  # Résultat attendu: 1 node (ou plus si workers)
  ```

- [ ] Nœud en état "Ready"
  ```bash
  kubectl get nodes -o jsonpath='{.items[0].status.conditions[?(@.type=="Ready")].status}'
  # Résultat attendu: True
  ```

- [ ] Nœud n'est pas "NotReady" ou "Unknown"
  ```bash
  kubectl get nodes -o wide
  # Résultat attendu: STATUS = Ready
  ```

- [ ] Nœud a les bonnes capacités
  ```bash
  kubectl get nodes -o json | jq '.items[0].status.capacity'
  # Résultat attendu: cpu, memory, pods, storage
  ```

**Composants critiques:**

- [ ] kube-apiserver Ready
  ```bash
  kubectl get pod -n kube-system -l component=kube-apiserver
  # Résultat attendu: 1/1 Running
  ```

- [ ] kube-scheduler Ready
  ```bash
  kubectl get pod -n kube-system -l component=kube-scheduler
  # Résultat attendu: 1/1 Running
  ```

- [ ] kube-controller-manager Ready
  ```bash
  kubectl get pod -n kube-system -l component=kube-controller-manager
  # Résultat attendu: 1/1 Running
  ```

- [ ] etcd Ready
  ```bash
  kubectl get pod -n kube-system -l component=etcd
  # Résultat attendu: 1/1 Running
  ```

- [ ] CoreDNS Ready
  ```bash
  kubectl get pod -n kube-system -l k8s-app=kube-dns
  # Résultat attendu: 2/2 Running (2 replicas par défaut)
  ```

- [ ] kube-proxy Ready
  ```bash
  kubectl get pod -n kube-system -l k8s-app=kube-proxy
  # Résultat attendu: 1/1 Running
  ```

## 🔍 Vérifications Complètes

**Utiliser le script de vérification automatique:**

```bash
bash /vagrant/k8s/kubeadm-lab/verify-cluster.sh
```

**Résumé attendu:**
- [ ] ✓ kubectl is available
- [ ] ✓ Connected to API server
- [ ] ✓ Nodes in Ready state
- [ ] ✓ Control plane components running
- [ ] ✓ Calico nodes running
- [ ] ✓ CoreDNS running
- [ ] ✓ kube-proxy running
- [ ] ✓ Test pod created and running
- [ ] ✓ DNS resolution working
- [ ] ✓ Cluster is initialized and ready

## 🚀 Multi-Node (Optionnel)

Si `ENABLE_WORKERS = true` dans Vagrantfile:

**Workers joignent le cluster:**

- [ ] Worker VMs démarrées et provisionnées
  ```bash
  vagrant status
  # Résultat attendu: learnivo-w1, w2, w3 running
  ```

- [ ] Workers attendent le join script
  ```bash
  tail -f /tmp/worker.log  # Sur une VM worker
  ```

- [ ] Workers rejoignent avec succès
  ```bash
  kubectl get nodes
  # Résultat attendu: learnivo-cp (Ready), learnivo-w1/2/3 (Ready)
  ```

- [ ] Tous les workers sont "Ready"
  ```bash
  kubectl get nodes --no-headers | grep -c "Ready"
  # Résultat attendu: 4 (ou 1 en mode single-node)
  ```

- [ ] Pods distribués sur les workers
  ```bash
  kubectl get pods -n kube-system -o wide
  # Résultat attendu: pods sur différents nœuds
  ```

## 🧪 Connectivité Réseau

**Tests de réseau:**

- [ ] Pods peuvent communiquer entre eux
  ```bash
  kubectl run test-pod1 --image=busybox --restart=Never -- sleep 300
  kubectl run test-pod2 --image=busybox --restart=Never -- sleep 300
  POD1_IP=$(kubectl get pod test-pod1 -o jsonpath='{.status.podIP}')
  kubectl exec test-pod2 -- ping -c 3 $POD1_IP
  # Résultat attendu: 0% packet loss
  ```

- [ ] DNS fonctionne
  ```bash
  kubectl exec test-pod1 -- nslookup kubernetes.default
  # Résultat attendu: Address section with 10.96.0.1
  ```

- [ ] Service DNS fonctionne
  ```bash
  kubectl run nginx --image=nginx --port=80
  kubectl expose pod nginx --type=ClusterIP --port=80 --target-port=80
  kubectl exec test-pod1 -- wget -qO- http://nginx.default.svc.cluster.local
  # Résultat attendu: HTML nginx
  ```

## 📦 Déploiement Learnivo

**Pré-déploiement:**

- [ ] Cluster prêt
  ```bash
  kubectl get nodes -o wide | grep -i ready
  # Résultat attendu: tous les nœuds Ready
  ```

- [ ] Espace disque disponible
  ```bash
  df -h /
  # Résultat attendu: au moins 10 GB disponible
  ```

**Déployer Learnivo:**

```bash
cd /vagrant
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/01-configmap.yaml
kubectl apply -f k8s/02-secrets.yaml
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
```

- [ ] Namespace créé
  ```bash
  kubectl get ns learnivo
  # Résultat attendu: Active
  ```

- [ ] ConfigMaps déployés
  ```bash
  kubectl get configmap -n learnivo
  # Résultat attendu: liste des configmaps
  ```

- [ ] Secrets déployés
  ```bash
  kubectl get secrets -n learnivo
  # Résultat attendu: liste des secrets
  ```

- [ ] Pods Learnivo créés
  ```bash
  kubectl get pods -n learnivo -o wide
  # Résultat attendu: pods en status "Running"
  ```

- [ ] Services Learnivo créés
  ```bash
  kubectl get svc -n learnivo
  # Résultat attendu: services avec ClusterIP/NodePort
  ```

- [ ] Accès à l'application
  ```bash
  kubectl port-forward -n learnivo svc/frontend 4200:80 &
  # Puis accéder à: http://127.0.0.1:4200
  ```

## 🔧 Dépannage

**Si problèmes rencontrés:**

- [ ] Vérifier les logs de provisioning
  ```bash
  tail -100 /tmp/control-plane.log
  tail -100 /tmp/worker.log
  ```

- [ ] Vérifier les logs kubelet
  ```bash
  sudo journalctl -u kubelet -n 100 | tail -50
  ```

- [ ] Vérifier les logs containerd
  ```bash
  sudo journalctl -u containerd -n 100 | tail -50
  ```

- [ ] Vérifier les logs Calico
  ```bash
  kubectl logs -n kube-system -l k8s-app=calico-node --tail=100
  ```

- [ ] Vérifier API server
  ```bash
  kubectl logs -n kube-system -l component=kube-apiserver --tail=50
  ```

- [ ] Réinitialiser si nécessaire
  ```bash
  vagrant destroy -f
  vagrant up
  ```

## 📊 Ressources Utilisées

**Vérifier l'utilisation:**

```bash
# Nœud
kubectl top nodes

# Pods système
kubectl top pods -n kube-system

# Pods Learnivo
kubectl top pods -n learnivo
```

**Résultat attendu:**
- Control-plane: ~200-400 MB RAM, 10-20% CPU
- Workers (si présents): ~150-300 MB RAM
- Application Learnivo: varie selon charge

## 📝 Documentation

**Consulter:**

- [ ] QUICK_START.md - Guide de démarrage
- [ ] IMPROVEMENTS_SUMMARY.md - Résumé des améliorations
- [ ] debug-commands.sh - Commandes utiles

## ✨ Checklist Finale

- [ ] ✅ cluster initialized (kubeadm init réussi)
- [ ] ✅ Calico CNI installé
- [ ] ✅ Node Ready
- [ ] ✅ API server répond
- [ ] ✅ etcd actif
- [ ] ✅ kubelet sain
- [ ] ✅ Network policies actives
- [ ] ✅ DNS fonctionne
- [ ] ✅ Pods peuvent communiquer
- [ ] ✅ Learnivo déployé (optionnel)

---

**Statut:** ✅ PRÊT POUR PRODUCTION

**Date:** 2026-05-06
**Version Kubernetes:** 1.30
**Version Calico:** 3.27.3
