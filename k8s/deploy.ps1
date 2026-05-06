# Kubernetes Deployment Script for Windows (PowerShell)
# Run with: powershell -ExecutionPolicy Bypass -File deploy.ps1

param(
    [Parameter(Mandatory=$false)]
    [string]$Action = "deploy",
    
    [Parameter(Mandatory=$false)]
    [string]$Namespace = "learnivo"
)

# Colors
$Green = 'Green'
$Red = 'Red'
$Yellow = 'Yellow'

function Write-Header {
    param([string]$Message)
    Write-Host "`n========================================" -ForegroundColor $Green
    Write-Host $Message -ForegroundColor $Green
    Write-Host "========================================`n" -ForegroundColor $Green
}

function Write-Success {
    param([string]$Message)
    Write-Host "[✓] $Message" -ForegroundColor $Green
}

function Write-Error-Message {
    param([string]$Message)
    Write-Host "[✗] $Message" -ForegroundColor $Red
}

function Write-Warning-Message {
    param([string]$Message)
    Write-Host "[⚠] $Message" -ForegroundColor $Yellow
}

function Check-Requirements {
    Write-Header "Checking Requirements"
    
    # Check Docker
    try {
        docker version | Out-Null
        Write-Success "Docker is installed"
    }
    catch {
        Write-Error-Message "Docker is not installed or not in PATH"
        exit 1
    }
    
    # Check kubectl
    try {
        kubectl version --client | Out-Null
        Write-Success "kubectl is installed"
    }
    catch {
        Write-Error-Message "kubectl is not installed or not in PATH"
        exit 1
    }
    
    # Check Kubernetes cluster
    try {
        kubectl cluster-info | Out-Null
        Write-Success "Connected to Kubernetes cluster"
        
        $version = kubectl version -o json | ConvertFrom-Json
        Write-Success "Kubernetes version: $($version.serverVersion.gitVersion)"
    }
    catch {
        Write-Error-Message "Cannot connect to Kubernetes cluster"
        Write-Warning-Message "Make sure Docker Desktop Kubernetes is enabled or Minikube is running"
        exit 1
    }
}

function Build-Images {
    Write-Header "Building Docker Images"
    
    $ParentDir = Split-Path -Parent (Get-Item $PSScriptRoot).FullName
    
    # Build backend
    Write-Host "Building backend images..."
    Push-Location "$ParentDir\backend"
    
    $services = @("discovery-server", "api-gateway", "user-service", "course-service", "quiz-service")
    
    foreach ($service in $services) {
        Write-Host "Building $service..."
        mvn clean package spring-boot:build-image -DskipTests -pl $service -am
        
        if ($LASTEXITCODE -ne 0) {
            Write-Error-Message "Failed to build $service"
            Pop-Location
            exit 1
        }
    }
    
    Write-Success "Backend images built"
    Pop-Location
    
    # Build frontend
    Write-Host "Building frontend image..."
    Push-Location "$ParentDir\frontend"
    
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Message "Frontend build failed"
        Pop-Location
        exit 1
    }
    
    docker build -t learnivo/frontend:latest .
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Message "Docker build for frontend failed"
        Pop-Location
        exit 1
    }
    
    Write-Success "Frontend image built"
    Pop-Location
}

function Deploy-Manifests {
    Write-Header "Deploying Kubernetes Manifests"
    
    $manifestDir = Get-Item $PSScriptRoot
    
    # Create namespace
    Write-Host "Creating namespace: $Namespace"
    kubectl apply -f "$($manifestDir.FullName)\00-namespace.yaml"
    Write-Success "Namespace created"
    
    # Deploy ConfigMaps
    Write-Host "Deploying ConfigMaps..."
    kubectl apply -f "$($manifestDir.FullName)\01-configmap.yaml"
    Write-Success "ConfigMaps deployed"
    
    # Deploy Secrets
    Write-Host "Deploying Secrets..."
    kubectl apply -f "$($manifestDir.FullName)\02-secrets.yaml"
    Write-Success "Secrets deployed"
    
    # Deploy backend
    Write-Host "Deploying backend services..."
    kubectl apply -f "$($manifestDir.FullName)\backend\"
    Write-Success "Backend services deployed"
    
    # Deploy frontend
    Write-Host "Deploying frontend..."
    kubectl apply -f "$($manifestDir.FullName)\frontend\"
    Write-Success "Frontend deployed"
    
    # Optional: Deploy network policies
    Write-Host "Deploying network policies..."
    kubectl apply -f "$($manifestDir.FullName)\03-network-policies.yaml"
    Write-Success "Network policies deployed"
}

function Wait-For-Deployment {
    Write-Header "Waiting for Deployment"
    
    $deployments = @("discovery-server", "api-gateway", "user-service", "course-service", "quiz-service", "frontend")
    
    foreach ($deployment in $deployments) {
        Write-Host "Waiting for $deployment..."
        kubectl rollout status deployment/$deployment -n $Namespace --timeout=5m
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "$deployment is ready"
        }
        else {
            Write-Warning-Message "$deployment deployment timed out"
        }
    }
}

function Show-Status {
    Write-Header "Deployment Status"
    
    Write-Host "Pods:"
    kubectl get pods -n $Namespace
    Write-Host ""
    
    Write-Host "Services:"
    kubectl get svc -n $Namespace
    Write-Host ""
    
    Write-Host "Deployments:"
    kubectl get deployments -n $Namespace
}

function Show-Port-Forward {
    Write-Header "Port Forwarding Available"
    
    Write-Host "To access services locally, use the following commands in separate PowerShell windows:`n"
    
    Write-Host "Frontend:"
    Write-Host "  kubectl port-forward -n $Namespace svc/frontend 4200:80`n" -ForegroundColor $Yellow
    
    Write-Host "API Gateway:"
    Write-Host "  kubectl port-forward -n $Namespace svc/api-gateway 8080:8080`n" -ForegroundColor $Yellow
    
    Write-Host "Discovery Server:"
    Write-Host "  kubectl port-forward -n $Namespace svc/discovery-server 8761:8761`n" -ForegroundColor $Yellow
    
    Write-Host "Then access:"
    Write-Host "  - Frontend: http://localhost:4200" -ForegroundColor $Yellow
    Write-Host "  - API Gateway: http://localhost:8080" -ForegroundColor $Yellow
    Write-Host "  - Discovery Server: http://localhost:8761" -ForegroundColor $Yellow
}

function Cleanup {
    Write-Header "Cleanup"
    
    Write-Host "Deleting all resources in namespace: $Namespace"
    kubectl delete namespace $Namespace --ignore-not-found=true
    Write-Success "Cleanup completed"
}

# Main script logic
switch ($Action.ToLower()) {
    "check" {
        Check-Requirements
    }
    "build" {
        Check-Requirements
        Build-Images
    }
    "deploy" {
        Check-Requirements
        Deploy-Manifests
        Wait-For-Deployment
        Show-Status
        Show-Port-Forward
    }
    "full" {
        Check-Requirements
        Build-Images
        Deploy-Manifests
        Wait-For-Deployment
        Show-Status
        Show-Port-Forward
    }
    "status" {
        Show-Status
    }
    "cleanup" {
        Cleanup
    }
    default {
        Write-Host "Usage: .\deploy.ps1 [-Action <action>] [-Namespace <namespace>]`n"
        Write-Host "Actions:"
        Write-Host "  check    - Check if all requirements are met"
        Write-Host "  build    - Build Docker images"
        Write-Host "  deploy   - Deploy to Kubernetes"
        Write-Host "  full     - Build and deploy everything"
        Write-Host "  status   - Show current deployment status"
        Write-Host "  cleanup  - Delete all resources`n"
        Write-Host "Examples:"
        Write-Host "  .\deploy.ps1 -Action check"
        Write-Host "  .\deploy.ps1 -Action full -Namespace learnivo"
    }
}
