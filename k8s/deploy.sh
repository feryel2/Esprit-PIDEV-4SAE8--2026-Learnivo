#!/bin/bash

# Learnivo Kubernetes Deployment Script
# This script helps deploy Learnivo to Kubernetes

set -e

NAMESPACE="learnivo"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}$1${NC}"
    echo -e "${GREEN}========================================${NC}\n"
}

print_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    print_header "Checking Requirements"
    
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed"
        exit 1
    fi
    print_success "kubectl found"
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    print_success "Docker found"
    
    # Check if cluster is accessible
    if ! kubectl cluster-info &> /dev/null; then
        print_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    print_success "Connected to Kubernetes cluster"
    print_success "Kubernetes version: $(kubectl version -o json | jq '.serverVersion.gitVersion')"
}

build_images() {
    print_header "Building Docker Images"
    
    # Get parent directory
    PARENT_DIR="$(dirname "$SCRIPT_DIR")"
    
    # Build backend images
    print_info "Building backend images..."
    cd "$PARENT_DIR/backend"
    mvn clean package spring-boot:build-image -DskipTests
    print_success "Backend images built"
    
    # Build frontend image
    print_info "Building frontend image..."
    cd "$PARENT_DIR/frontend"
    npm run build
    docker build -t learnivo/frontend:latest .
    print_success "Frontend image built"
    
    cd "$SCRIPT_DIR"
}

deploy_manifests() {
    print_header "Deploying Kubernetes Manifests"
    
    # Create namespace
    print_info "Creating namespace: $NAMESPACE"
    kubectl apply -f "$SCRIPT_DIR/00-namespace.yaml"
    print_success "Namespace created"
    
    # Deploy ConfigMaps
    print_info "Deploying ConfigMaps..."
    kubectl apply -f "$SCRIPT_DIR/01-configmap.yaml"
    print_success "ConfigMaps deployed"
    
    # Deploy Secrets
    print_info "Deploying Secrets..."
    kubectl apply -f "$SCRIPT_DIR/02-secrets.yaml"
    print_success "Secrets deployed"
    
    # Deploy backend services
    print_info "Deploying backend services..."
    kubectl apply -f "$SCRIPT_DIR/backend/"
    print_success "Backend services deployed"
    
    # Deploy frontend
    print_info "Deploying frontend..."
    kubectl apply -f "$SCRIPT_DIR/frontend/"
    print_success "Frontend deployed"
}

wait_for_deployment() {
    print_header "Waiting for Deployment"
    
    # List of deployments to wait for
    DEPLOYMENTS=("discovery-server" "api-gateway" "user-service" "course-service" "quiz-service" "frontend")
    
    for deployment in "${DEPLOYMENTS[@]}"; do
        print_info "Waiting for $deployment..."
        kubectl rollout status deployment/$deployment -n $NAMESPACE --timeout=5m
        print_success "$deployment is ready"
    done
}

port_forward() {
    print_header "Port Forwarding Available"
    
    echo "To access services locally, use:"
    echo ""
    echo "  Frontend:"
    echo "    kubectl port-forward -n $NAMESPACE svc/frontend 4200:80"
    echo ""
    echo "  API Gateway:"
    echo "    kubectl port-forward -n $NAMESPACE svc/api-gateway 8080:8080"
    echo ""
    echo "  Discovery Server:"
    echo "    kubectl port-forward -n $NAMESPACE svc/discovery-server 8761:8761"
}

show_status() {
    print_header "Deployment Status"
    
    echo "Pods:"
    kubectl get pods -n $NAMESPACE
    echo ""
    echo "Services:"
    kubectl get svc -n $NAMESPACE
    echo ""
    echo "Deployments:"
    kubectl get deployments -n $NAMESPACE
}

cleanup() {
    print_header "Cleanup"
    
    print_info "Deleting all resources in namespace: $NAMESPACE"
    kubectl delete namespace $NAMESPACE --ignore-not-found=true
    print_success "Cleanup completed"
}

# Main script
case "${1:-deploy}" in
    check)
        check_requirements
        ;;
    build)
        check_requirements
        build_images
        ;;
    deploy)
        check_requirements
        deploy_manifests
        wait_for_deployment
        show_status
        port_forward
        ;;
    full)
        check_requirements
        build_images
        deploy_manifests
        wait_for_deployment
        show_status
        port_forward
        ;;
    status)
        show_status
        ;;
    cleanup)
        cleanup
        ;;
    *)
        echo "Usage: $0 {check|build|deploy|full|status|cleanup}"
        echo ""
        echo "Commands:"
        echo "  check    - Check if all requirements are met"
        echo "  build    - Build Docker images"
        echo "  deploy   - Deploy to Kubernetes"
        echo "  full     - Build and deploy everything"
        echo "  status   - Show current deployment status"
        echo "  cleanup  - Delete all resources"
        exit 1
        ;;
esac
