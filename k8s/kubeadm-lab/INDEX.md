# 📚 Index - kubeadm + Calico Cluster Documentation

## 🚀 Démarrage Rapide

**Nouveau? Commencez ici:** [QUICK_START.md](QUICK_START.md)
- Configuration en 5 minutes
- Mode single-node vs multi-node
- Vérification du cluster
- Dépannage courant

---

## 📖 Documentation Détaillée

### Phase d'Initialisation

| Phase | Fichier | Description |
|-------|---------|-------------|
| 📋 Prérequis | [QUICK_START.md](QUICK_START.md#prérequis) | VirtualBox, Vagrant, ressources |
| 🔧 Préparation | [provision/common.sh](provision/common.sh) | Setup système, containerd, kubeadm |
| ⚙️ kubeadm init | [provision/control-plane.sh](provision/control-plane.sh) | Initialisation du control-plane |
| 🌐 CNI Calico | [provision/control-plane.sh](provision/control-plane.sh#phase-5-install-calico-cni) | Installation et attente CNI |
| ✅ Node Ready | [provision/control-plane.sh](provision/control-plane.sh#phase-7-wait-for-control-plane-node-ready) | Attente du nœud Ready |
| 👥 Workers | [provision/worker.sh](provision/worker.sh) | Join des worker nodes |

### Scripts de Provisioning

- **[provision/common.sh](provision/common.sh)**
  - Installation système complète
  - Setup containerd (CRI)
  - Installation kubeadm/kubelet/kubectl
  - Configuration réseau

- **[provision/control-plane.sh](provision/control-plane.sh)** ← **CLÉS**
  - Initialisation kubeadm complète
  - Installation Calico CNI
  - Génération join command
  - Attente du nœud Ready

- **[provision/worker.sh](provision/worker.sh)**
  - Attente du join script
  - Intégration au cluster
  - Vérification

### Configuration

- **[Vagrantfile](Vagrantfile)**
  - Topologie single-node (défaut) ou multi-node
  - Ressources VM appropriées
  - Port forwarding
  - Optimisations VirtualBox

### Vérification & Débogage

| Outil | Fichier | Utilisation |
|-------|---------|-------------|
| 🔍 Vérification Complète | [verify-cluster.sh](verify-cluster.sh) | `bash verify-cluster.sh` |
| 🐛 Commandes Utiles | [debug-commands.sh](debug-commands.sh) | `source debug-commands.sh` |
| ✅ Checklist | [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) | Vérifier chaque phase |

---

## 📚 Guides & Référence

### Documentation Principale

- **[README.md](README.md)** (Original)
  - Vue d'ensemble Vagrant Lab
  - Démarrage simple
  - Notes importantes

- **[README_IMPROVED.md](README_IMPROVED.md)** ← **RECOMMANDÉ**
  - Documentation améliorée
  - Architecture détaillée
  - Configuration multi-node
  - Dépannage avancé

### Guides Spécialisés

- **[QUICK_START.md](QUICK_START.md)** ← **COMMENCEZ ICI**
  - Guide rapide (5-10 min)
  - Deux modes: single-node, multi-node
  - Vérification par étapes
  - Points de contrôle clés
  - Dépannage courant

- **[IMPROVEMENTS_SUMMARY.md](IMPROVEMENTS_SUMMARY.md)** ← **CE QUI A CHANGÉ**
  - Résumé des améliorations
  - Avant/après comparaison
  - 8 phases d'initialisation
  - État attendu final

- **[VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md)** ← **VALIDATION**
  - Checklist complète
  - Pré-initialisation
  - Chaque phase vérifiée
  - Commandes de vérification
  - Checklist finale

### External References

- [Dossier parent: k8s/KUBEADM_SETUP.md](../KUBEADM_SETUP.md)
  - Setup kubeadm manuel (sans Vagrant)
  - Instructions détaillées par étape

---

## 🎯 Cas d'Usage

### ✅ Je veux démarrer rapidement

1. Lire: [QUICK_START.md](QUICK_START.md) (5 min)
2. Exécuter: `vagrant up`
3. Vérifier: `bash verify-cluster.sh`

### ✅ Je veux comprendre ce qui change

1. Lire: [IMPROVEMENTS_SUMMARY.md](IMPROVEMENTS_SUMMARY.md)
2. Consulter: [provision/control-plane.sh](provision/control-plane.sh)
3. Observer les 8 phases

### ✅ Je veux déboguer un problème

1. Consulter: [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md)
2. Utiliser: `source debug-commands.sh`
3. Exécuter commandes utiles
4. Vérifier les logs: `/tmp/control-plane.log`

### ✅ Je veux une architecture distribuée

1. Éditer: [Vagrantfile](Vagrantfile) - `ENABLE_WORKERS = true`
2. Exécuter: `vagrant up`
3. Attendre: 10-15 minutes
4. Vérifier: `kubectl get nodes -o wide`

### ✅ Je veux vérifier tous les détails

1. Lancer: `bash verify-cluster.sh`
2. Consulter les 9 vérifications automatiques
3. Actions recommandées affichées

---

## 🔍 Accès Rapide aux Fichiers

### Scripts Provisioning (À exécuter automatiquement)
```
provision/
  ├── common.sh              ← Setup système
  ├── control-plane.sh       ← kubeadm init + Calico
  └── worker.sh              ← Join workers
```

### Configuration (À modifier si nécessaire)
```
Vagrantfile                  ← Topologie, ressources
  └── ENABLE_WORKERS: false  ← Changer pour multi-node
```

### Outils de Vérification (À utiliser pour validation)
```
verify-cluster.sh            ← Script de vérification (bash)
debug-commands.sh            ← Commandes utiles (source)
```

### Documentation (À consulter pour comprendre)
```
QUICK_START.md               ← Commencer ici! (5 min)
IMPROVEMENTS_SUMMARY.md      ← Changements apportés
VERIFICATION_CHECKLIST.md    ← Validation complète
README_IMPROVED.md           ← Référence complète
```

---

## 📊 Flux d'Utilisation

```
START
  ↓
[Lire QUICK_START.md] (5 min)
  ↓
[vagrant up] (10-15 min)
  ↓
[vagrant ssh learnivo-cp]
  ↓
[bash verify-cluster.sh]
  ↓
✓ All checks pass?
  ├─ YES → Ready for Learnivo deployment
  └─ NO  → Consulter VERIFICATION_CHECKLIST.md
           Source debug-commands.sh
           Exécuter commandes appropriées
  ↓
[kubectl apply -f k8s/...]
  ↓
DEPLOYMENT SUCCESS
```

---

## 🎓 Apprentissage Détaillé

### Comprendre kubeadm init

1. Lire: [provision/control-plane.sh](provision/control-plane.sh) - Phase 2
2. Comparer avec: [QUICK_START.md](QUICK_START.md) - Phases d'initialisation
3. Référence: [Kubernetes kubeadm docs](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/)

### Comprendre Calico CNI

1. Lire: [provision/control-plane.sh](provision/control-plane.sh) - Phase 5
2. Vérifier: `kubectl get pods -n kube-system -l k8s-app=calico-node -o wide`
3. Referece: [Calico docs](https://docs.projectcalico.org/)

### Comprendre Node Ready

1. Lire: [provision/control-plane.sh](provision/control-plane.sh) - Phase 7
2. Vérifier: `kubectl get nodes -o wide`
3. Détails: [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) - Phase 5

---

## 🚨 Dépannage Rapide

| Problème | Action |
|----------|--------|
| Nœud reste "NotReady" | [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) - Phase 5 |
| Calico pods ne démarrent pas | [QUICK_START.md](QUICK_START.md) - Dépannage |
| API server ne répond pas | `source debug-commands.sh` puis `check_api_server` |
| Provisioning échoue | Vérifier `/tmp/control-plane.log` |
| Workers ne rejoignent pas | Vérifier `join.sh`, consulter [debug-commands.sh](debug-commands.sh) |

---

## 📋 Fichiers Créés/Améliorés

### Créés (NEW)
- ✨ [verify-cluster.sh](verify-cluster.sh) - Script de vérification
- ✨ [debug-commands.sh](debug-commands.sh) - Commandes utiles
- ✨ [QUICK_START.md](QUICK_START.md) - Guide rapide
- ✨ [IMPROVEMENTS_SUMMARY.md](IMPROVEMENTS_SUMMARY.md) - Résumé changements
- ✨ [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) - Checklist validation
- ✨ [README_IMPROVED.md](README_IMPROVED.md) - Docs améliorée
- ✨ **INDEX.md** - Ce fichier (navigation)

### Améliorés (UPDATED)
- ✅ [provision/control-plane.sh](provision/control-plane.sh) - 8 phases robustes
- ✅ [provision/worker.sh](provision/worker.sh) - Meilleur logging
- ✅ [Vagrantfile](Vagrantfile) - Support multi-node + optimisations

### Inchangés (Reference)
- 📖 [README.md](README.md) - Original (archivé)
- 📖 [provision/common.sh](provision/common.sh) - Référence

---

## 📈 Statistiques

| Métrique | Valeur |
|----------|--------|
| Fichiers de documentation | 7 nouveaux/améliorés |
| Phases d'initialisation | 8 (avec vérifications) |
| Contrôles de vérification | 9 (verify-cluster.sh) |
| Commandes de débogage | 30+ utiles |
| Checklist items | 100+ points |
| Temps de démarrage | 5-15 min (selon mode) |

---

## ⚡ Commandes Essentielles

### Démarrage
```bash
cd k8s/kubeadm-lab
vagrant up
vagrant ssh learnivo-cp
```

### Vérification
```bash
# Vérification complète
bash /vagrant/k8s/kubeadm-lab/verify-cluster.sh

# Commandes de débogage
source /vagrant/k8s/kubeadm-lab/debug-commands.sh
show_status
full_cluster_check
```

### Vérification Manuelle
```bash
# État du cluster
kubectl get nodes -o wide
kubectl get pods -n kube-system -o wide

# État de Calico
kubectl get pods -n kube-system -l k8s-app=calico-node -o wide

# État du nœud
kubectl get nodes -o jsonpath='{.items[0].status.conditions[?(@.type=="Ready")].status}'
```

---

## 🎁 Bonus: Templates Utiles

### Test de connectivité réseau
```bash
# Créer pod test
kubectl run test-pod --image=busybox --restart=Never -- sleep 300

# DNS
kubectl exec test-pod -- nslookup kubernetes.default

# Connectivité
kubectl exec test-pod -- wget -qO- https://kubernetes.default/api/v1
```

### Afficher les logs
```bash
source debug-commands.sh
show_calico_logs
show_apiserver_logs
show_provisioning_logs
```

---

## 📞 Support

- **Problèmes kubeadm**: Consulter [QUICK_START.md](QUICK_START.md) - Dépannage
- **Problèmes Calico**: Consulter [debug-commands.sh](debug-commands.sh) - `check_calico`
- **Problèmes de validation**: Consulter [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md)

---

## 🔗 Liens Utiles

- 📚 [Kubernetes kubeadm Documentation](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/)
- 🌐 [Calico Networking Documentation](https://docs.projectcalico.org/)
- 🐳 [containerd Documentation](https://containerd.io/docs/)
- 🧭 [Vagrant Documentation](https://www.vagrantup.com/docs)

---

**Dernière mise à jour:** 2026-05-06  
**Version Kubernetes:** 1.30  
**Version Calico:** 3.27.3  
**Statut:** ✅ COMPLET
