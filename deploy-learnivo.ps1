# ============================================
# SCRIPT DE DÉPLOIEMENT AUTOMATIQUE LEARNIVO
# Kubernetes avec kubeadm + Vagrant
# ============================================

param(
    [switch]$SkipBuild,
    [switch]$Clean
)

Write-Host "🚀 DÉPLOIEMENT AUTOMATIQUE LEARNIVO SUR KUBERNETES" -ForegroundColor Magenta
Write-Host "=================================================`n" -ForegroundColor Yellow

# Fonction de vérification
function Test-Prerequisites {
    Write-Host "🔍 VÉRIFICATION DES PRÉREQUIS..." -ForegroundColor Cyan

    # Vagrant
    $vagrant = Get-Command vagrant -ErrorAction SilentlyContinue
    if ($vagrant) {
        Write-Host "✓ Vagrant trouvé: $($vagrant.Version)" -ForegroundColor Green
    } else {
        Write-Host "✗ Vagrant non trouvé. Installez-le depuis: https://www.vagrantup.com/" -ForegroundColor Red
        exit 1
    }

    # VirtualBox
    $vbox = Get-Command VBoxManage -ErrorAction SilentlyContinue
    if ($vbox) {
        Write-Host "✓ VirtualBox trouvé" -ForegroundColor Green
    } else {
        Write-Host "✗ VirtualBox non trouvé. Installez-le depuis: https://www.virtualbox.org/" -ForegroundColor Red
        exit 1
    }

    Write-Host ""
}

# Fonction de nettoyage
function Clear-Environment {
    Write-Host "🧹 NETTOYAGE DE L'ENVIRONNEMENT..." -ForegroundColor Yellow

    Set-Location "$PSScriptRoot\k8s\kubeadm-lab"

    # Arrêter et détruire la VM existante
    Write-Host "Arrêt de la VM existante..." -ForegroundColor Gray
    vagrant halt 2>$null
    vagrant destroy -f 2>$null

    # Nettoyer les images Docker locales si demandé
    if (-not $SkipBuild) {
        Write-Host "Suppression des images Docker locales..." -ForegroundColor Gray
        docker rmi learnivo/frontend learnivo/api-gateway learnivo/user-service learnivo/course-service learnivo/quiz-service learnivo/discovery-server 2>$null
    }

    Set-Location $PSScriptRoot
    Write-Host ""
}

# Fonction de build des images
function Build-Images {
    Write-Host "🏗️  CONSTRUCTION DES IMAGES DOCKER..." -ForegroundColor Cyan

    # Build backend avec Maven
    Write-Host "Construction du backend avec Maven..." -ForegroundColor Gray
    Set-Location "$PSScriptRoot\backend"
    mvn clean package spring-boot:build-image -DskipTests

    # Build frontend
    Write-Host "Construction du frontend..." -ForegroundColor Gray
    Set-Location "$PSScriptRoot\frontend"
    npm install
    npm run build
    docker build -t learnivo/frontend:latest .

    Set-Location $PSScriptRoot
    Write-Host "✓ Images construites avec succès`n" -ForegroundColor Green
}

# Fonction de démarrage du cluster
function Start-Cluster {
    Write-Host "🐳 DÉMARRAGE DU CLUSTER KUBERNETES..." -ForegroundColor Cyan

    Set-Location "$PSScriptRoot\k8s\kubeadm-lab"

    Write-Host "Démarrage de la VM avec Vagrant (5-10 minutes)..." -ForegroundColor Yellow
    Write-Host "Téléchargement d'Ubuntu 22.04 + installation de Kubernetes..." -ForegroundColor Gray
    vagrant up

    Write-Host "✓ Cluster Kubernetes démarré`n" -ForegroundColor Green
}

# Fonction de déploiement
function Deploy-Learnivo {
    Write-Host "📦 DÉPLOIEMENT DE LEARNIVO..." -ForegroundColor Cyan

    Write-Host "Connexion à la VM..." -ForegroundColor Gray
    $deployScript = @"
cd /vagrant

echo "Création du namespace..."
kubectl apply -f k8s/00-namespace.yaml
kubectl get namespaces

echo "Déploiement des configurations..."
kubectl apply -f k8s/01-configmap.yaml
kubectl apply -f k8s/02-secrets.yaml

echo "Déploiement des services backend..."
kubectl apply -f k8s/backend/

echo "Déploiement du frontend..."
kubectl apply -f k8s/frontend/

echo "Vérification du déploiement..."
kubectl get pods -n learnivo
kubectl get svc -n learnivo

echo "Démarrage du port-forwarding..."
kubectl port-forward -n learnivo svc/frontend 4200:80 &
kubectl port-forward -n learnivo svc/api-gateway 8080:8080 &
kubectl port-forward -n learnivo svc/discovery-server 8761:8761 &

echo "Déploiement terminé!"
"@

    # Exécuter le script dans la VM
    Write-Host "Exécution du déploiement dans la VM..." -ForegroundColor Gray
    $deployScript | vagrant ssh learnivo-cp -- bash -s

    Set-Location $PSScriptRoot
    Write-Host "✓ Learnivo déployé avec succès`n" -ForegroundColor Green
}

# Fonction d'accès
function Show-Access {
    Write-Host "🌐 ACCÈS AUX SERVICES" -ForegroundColor Green
    Write-Host "====================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Frontend Angular:" -ForegroundColor Cyan
    Write-Host "   URL: http://localhost:4200" -ForegroundColor White
    Write-Host "   Status: kubectl port-forward actif" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔗 API Gateway:" -ForegroundColor Cyan
    Write-Host "   URL: http://localhost:8080" -ForegroundColor White
    Write-Host "   Status: kubectl port-forward actif" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🕸️  Eureka Discovery Server:" -ForegroundColor Cyan
    Write-Host "   URL: http://localhost:8761" -ForegroundColor White
    Write-Host "   Status: kubectl port-forward actif" -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Les ports sont automatiquement forwardés par Vagrant!" -ForegroundColor Magenta
    Write-Host ""
}

# Script principal
try {
    # Vérifications
    Test-Prerequisites

    # Nettoyage si demandé
    if ($Clean) {
        Clear-Environment
    }

    # Construction des images
    if (-not $SkipBuild) {
        Build-Images
    }

    # Démarrage du cluster
    Start-Cluster

    # Déploiement
    Deploy-Learnivo

    # Accès
    Show-Access

    Write-Host "🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!" -ForegroundColor Magenta
    Write-Host "=====================================`n" -ForegroundColor Yellow

    Write-Host "📋 COMMANDES UTILES:" -ForegroundColor Cyan
    Write-Host "   • Se connecter à la VM: vagrant ssh learnivo-cp" -ForegroundColor White
    Write-Host "   • Voir les logs: kubectl logs -n learnivo deployment/<service>" -ForegroundColor White
    Write-Host "   • Redémarrer: .\deploy-learnivo.ps1 -Clean" -ForegroundColor White
    Write-Host "   • Arrêter: vagrant halt" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host "❌ ERREUR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}