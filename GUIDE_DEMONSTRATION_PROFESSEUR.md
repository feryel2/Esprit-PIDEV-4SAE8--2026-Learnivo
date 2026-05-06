# GUIDE DE DEMONSTRATION POUR LE PROFESSEUR

## Objectif

Presenter l'etat reel du depot Learnivo sans annoncer un critere qui n'est pas prouve.

Etat conseille a annoncer:
1. Base Kubernetes avec manifests et environnement kubeadm presents
2. Environnement de virtualisation commun avec Vagrant et VirtualBox
3. Travail individuel dans ce depot, donc pas de validation du critere collaboratif

## Message d'ouverture

Utilise ce message:

```text
Bonjour Professeur.
Je vais vous presenter l'etat reel de mon projet Learnivo.
Le depot contient une base Kubernetes avec kubeadm, un environnement Vagrant reproductible,
et un travail suivi individuellement dans Git.
Je prefere presenter ce qui est effectivement prouve par les fichiers et l'historique du depot.
```

## Demo conseillee

### Partie 1 - Base kubeadm

Montrer:
- `k8s/00-namespace.yaml`
- `k8s/backend/`
- `k8s/frontend/`
- `k8s/kubeadm-lab/Vagrantfile`
- `k8s/kubeadm-lab/provision/`

Dire:

```text
Le projet contient bien les manifests Kubernetes et un lab kubeadm avec scripts de provisioning.
La base technique est presente.
En revanche, le Vagrantfile actuel declare surtout un control-plane unique.
Je ne le presente donc pas comme un cluster distribue integralement demontre.
```

### Partie 2 - Environnement commun

Montrer:
- `k8s/kubeadm-lab/Vagrantfile`
- `frontend/Dockerfile`
- `backend/discovery-server/Dockerfile`
- `demo-script.ps1`

Commandes utiles:

```powershell
kubectl apply --dry-run=client -f k8s/00-namespace.yaml
kubectl apply --dry-run=client -f k8s/01-configmap.yaml
kubectl apply --dry-run=client -f k8s/backend/01-discovery-server.yaml
```

Dire:

```text
Le point le plus solide du depot est l'environnement reproductible.
Vagrant et VirtualBox fournissent la meme base sur plusieurs machines,
et le dossier partage /vagrant simplifie le deploiement des manifests.
```

### Partie 3 - Travail individuel

Montrer:
- `git log --oneline -10`
- `git shortlog -sn --all`
- `git branch -a`

Dire:

```text
Dans cet etat du depot, le travail est individuel.
L'historique Git montre un seul contributeur visible.
Je ne vais donc pas presenter ce critere comme collaboratif.
Je prefere etre precise sur ce qui est demontre.
```

## Conclusion conseillee

```text
Pour conclure:
- la base Kubernetes et kubeadm est presente
- l'environnement de virtualisation commun est bien prepare
- le depot que je presente ici correspond a un travail individuel

Le projet est donc techniquement interessant pour Kubernetes,
mais je ne le presente pas comme une validation complete des trois criteres au sens strict.
```

## Questions probables

### Pourquoi ne pas dire que le projet est collaboratif ?

```text
Parce que le depot montre un seul contributeur Git visible.
Je prefere une demonstration honnete et verifiable.
```

### Pourquoi ne pas dire que le cluster est deja distribue ?

```text
Parce que le lab actuel dans le Vagrantfile est surtout mono-noeud.
La base kubeadm existe, mais la preuve d'un cluster multi-noeuds n'est pas encore complete dans ce depot.
```

### Quel est le point le plus fort du projet aujourd'hui ?

```text
Les manifests Kubernetes, la separation en microservices
et l'environnement Vagrant reproductible.
```

## Fichiers a garder ouverts

- `demo-script.ps1`
- `VERIFICATION_KUBERNETES.md`
- `VERIFICATION_MANUELLE_RESULTATS.md`
- `k8s/kubeadm-lab/Vagrantfile`
- `k8s/KUBEADM_SETUP.md`

## Position a tenir

Ne pas dire:
- "les 3 criteres sont valides"
- "le travail est collaboratif"
- "le cluster multi-noeuds est deja prouve"

Dire a la place:
- "voici l'etat reel du depot"
- "voici ce qui est techniquement pret"
- "voici ce qui reste a renforcer"
