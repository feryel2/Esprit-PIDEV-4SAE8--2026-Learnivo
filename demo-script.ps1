# ============================================
# SCRIPT DE DEMONSTRATION POUR LE PROFESSEUR
# Learnivo - Etat reel du projet Kubernetes
# ============================================

Write-Host "ETAT DU PROJET KUBERNETES - LEARNIVO" -ForegroundColor Magenta
Write-Host "=====================================`n" -ForegroundColor Yellow

# PARTIE 1: BASE KUBEADM
Write-Host "PARTIE 1: Base kubeadm et manifests" -ForegroundColor Green
Write-Host "===================================`n" -ForegroundColor Green

Write-Host "=== 1.1 Manifests Kubernetes ===" -ForegroundColor Cyan
Get-ChildItem -Path "k8s\*.yaml" -File | Format-Table Name, Length
Write-Host ""

Write-Host "=== 1.2 Services Backend ===" -ForegroundColor Cyan
Get-ChildItem -Path "k8s\backend\*.yaml" -File | Format-Table Name, Length
Write-Host ""

Write-Host "=== 1.3 Service Frontend ===" -ForegroundColor Cyan
Get-ChildItem -Path "k8s\frontend\*.yaml" -File | Format-Table Name, Length
Write-Host ""

Write-Host "=== 1.4 Configuration kubeadm/Vagrant ===" -ForegroundColor Cyan
Get-Content "k8s\kubeadm-lab\Vagrantfile" | Select-Object -First 20
Write-Host ""

Write-Host "Scripts de provisioning:" -ForegroundColor Yellow
Get-ChildItem -Path "k8s\kubeadm-lab\provision\*.sh" | Format-Table Name
Write-Host ""

Write-Host "Observation:" -ForegroundColor Yellow
Write-Host "Le depot contient une base kubeadm complete, mais le lab actuel declare une seule VM control-plane." -ForegroundColor Yellow
Write-Host ""

# PARTIE 2: ENVIRONNEMENT COMMUN
Write-Host "PARTIE 2: Environnement de virtualisation commun" -ForegroundColor Green
Write-Host "===============================================`n" -ForegroundColor Green

Write-Host "=== 2.1 Dockerfiles ===" -ForegroundColor Cyan
Get-ChildItem -Path "backend\*\Dockerfile", "frontend\Dockerfile" -File | Format-Table FullName
Write-Host ""

Write-Host "=== 2.2 Dockerfile Frontend ===" -ForegroundColor Cyan
Get-Content "frontend\Dockerfile"
Write-Host ""

Write-Host "=== 2.3 Validation YAML ===" -ForegroundColor Cyan
kubectl apply --dry-run=client -f k8s/00-namespace.yaml 2>$null
if ($LASTEXITCODE -eq 0) { Write-Host "OK 00-namespace.yaml" -ForegroundColor Green }
kubectl apply --dry-run=client -f k8s/01-configmap.yaml 2>$null
if ($LASTEXITCODE -eq 0) { Write-Host "OK 01-configmap.yaml" -ForegroundColor Green }
kubectl apply --dry-run=client -f k8s/backend/01-discovery-server.yaml 2>$null
if ($LASTEXITCODE -eq 0) { Write-Host "OK 01-discovery-server.yaml" -ForegroundColor Green }
Write-Host ""

Write-Host "=== 2.4 Compatibilite multi-OS ===" -ForegroundColor Cyan
Get-Content "k8s\kubeadm-lab\Vagrantfile" | Select-String "config.vm.box|synced_folder"
Write-Host ""

# PARTIE 3: PROJET INDIVIDUEL
Write-Host "PARTIE 3: Projet individuel et tracabilite Git" -ForegroundColor Green
Write-Host "==============================================`n" -ForegroundColor Green

Write-Host "=== 3.1 Historique Git ===" -ForegroundColor Cyan
git log --oneline -10
Write-Host ""

Write-Host "=== 3.2 Contributeurs visibles ===" -ForegroundColor Cyan
git shortlog -sn --all
Write-Host ""

Write-Host "=== 3.3 Branches visibles ===" -ForegroundColor Cyan
git branch -a
Write-Host ""

Write-Host "=== 3.4 Architecture microservices ===" -ForegroundColor Cyan
Get-ChildItem -Path "backend\*/pom.xml" -File | Select-Object @{Name="Service";Expression={$_.Directory.Name}}, @{Name="Pom.xml";Expression={"PRESENT"}}
Write-Host ""

Write-Host "=== 3.5 Jenkinsfiles et documentation ===" -ForegroundColor Cyan
Get-ChildItem -Path "jenkins\*.Jenkinsfile" | Format-Table Name
Get-ChildItem -Path "*.md", "k8s\*.md", "jenkins\*.md" -File -ErrorAction SilentlyContinue | Select-Object Name | Sort-Object
Write-Host ""

Write-Host "Observation:" -ForegroundColor Yellow
Write-Host "Le depot montre un travail individuel avec un seul contributeur Git visible." -ForegroundColor Yellow
Write-Host ""

# CONCLUSION
Write-Host "CONCLUSION" -ForegroundColor Magenta
Write-Host "==========`n" -ForegroundColor Magenta

Write-Host "CRITERE 1: kubeadm distribue" -ForegroundColor Yellow
Write-Host "   - Base technique presente dans k8s/ et kubeadm-lab/" -ForegroundColor Green
Write-Host "   - Lab actuel mono-noeud dans le Vagrantfile" -ForegroundColor Yellow
Write-Host "   - A renforcer pour une validation stricte multi-noeuds" -ForegroundColor Yellow
Write-Host ""

Write-Host "CRITERE 2: environnement de virtualisation commun" -ForegroundColor Green
Write-Host "   - Vagrant/VirtualBox reproductible" -ForegroundColor Green
Write-Host "   - Dossier partage /vagrant" -ForegroundColor Green
Write-Host "   - Manifests Kubernetes et Dockerfiles presents" -ForegroundColor Green
Write-Host ""

Write-Host "CRITERE 3: travail collaboratif" -ForegroundColor Yellow
Write-Host "   - Depot individuel dans cet etat" -ForegroundColor Yellow
Write-Host "   - Un seul contributeur Git visible" -ForegroundColor Yellow
Write-Host "   - Ne pas le presenter comme critere valide" -ForegroundColor Yellow
Write-Host ""

Write-Host "STATUT: PRESENTATION SOLO COHERENTE" -ForegroundColor Magenta
Write-Host "Le depot montre bien la base technique Kubernetes, mais pas une validation complete des 3 criteres." -ForegroundColor Magenta
Write-Host ""

Write-Host "RAPPORTS DISPONIBLES:" -ForegroundColor Cyan
Write-Host "   - VERIFICATION_KUBERNETES.md" -ForegroundColor Cyan
Write-Host "   - VERIFICATION_MANUELLE_RESULTATS.md" -ForegroundColor Cyan
Write-Host "   - GUIDE_DEMONSTRATION_PROFESSEUR.md" -ForegroundColor Cyan
