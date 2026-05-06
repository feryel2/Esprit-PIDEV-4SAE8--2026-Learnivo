# GUIDE DE DEMONSTRATION MANUELLE AU PROFESSEUR

## Introduction

Dire:

```text
Bonjour Professeur.
Je vais presenter l'etat reel de mon depot Learnivo.
Il contient une base Kubernetes avec kubeadm, un environnement Vagrant reproductible,
et un suivi Git individuel.
```

## Partie 1 - Base kubeadm

Commandes:

```powershell
cd "c:\Users\pc\Pictures\Esprit-PIDEV-4SAE8--2026-Learnivo-feryel"
Get-ChildItem -Path "k8s\*.yaml" -File
Get-ChildItem -Path "k8s\backend\*.yaml" -File
Get-ChildItem -Path "k8s\frontend\*.yaml" -File
Get-Content "k8s\kubeadm-lab\Vagrantfile" | Select-Object -First 20
Get-ChildItem -Path "k8s\kubeadm-lab\provision\*.sh"
```

Dire:

```text
Le depot contient bien les manifests Kubernetes et les scripts kubeadm.
En revanche, le lab actuel est surtout centre sur un control-plane unique.
Je le presente donc comme une base technique, pas comme une preuve finale de cluster distribue.
```

## Partie 2 - Environnement commun

Commandes:

```powershell
Get-ChildItem -Path "backend\*\Dockerfile", "frontend\Dockerfile" -File
kubectl apply --dry-run=client -f k8s/00-namespace.yaml
kubectl apply --dry-run=client -f k8s/01-configmap.yaml
kubectl apply --dry-run=client -f k8s/backend/01-discovery-server.yaml
Get-Content "k8s\kubeadm-lab\Vagrantfile" | Select-String "config.vm.box|synced_folder"
```

Dire:

```text
Le critere le plus solide est l'environnement reproductible.
Vagrant, VirtualBox et le dossier partage /vagrant permettent de refaire la meme base technique.
```

## Partie 3 - Travail individuel

Commandes:

```powershell
git log --oneline -10
git shortlog -sn --all
git branch -a
Get-ChildItem -Path "jenkins\*.Jenkinsfile"
Get-ChildItem -Path "*.md", "k8s\*.md", "jenkins\*.md" -File -ErrorAction SilentlyContinue
```

Dire:

```text
Dans cet etat, le depot est individuel.
Je ne vais pas presenter ce critere comme collaboratif,
car Git montre un seul contributeur visible.
```

## Conclusion

Dire:

```text
Pour conclure:
- la base Kubernetes est bien presente
- l'environnement commun est bien prepare
- le depot que je presente ici est individuel

Je prefere une demonstration precise et verifiable plutot qu'une validation forcee des trois criteres.
```
