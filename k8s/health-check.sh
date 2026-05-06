#!/bin/bash

# Kubernetes Cluster Health Check Script
# Run this script to verify your Kubernetes cluster is healthy

set -e

NAMESPACE="learnivo"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_header() {
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}$1${NC}"
    echo -e "${GREEN}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_header "Kubernetes Cluster Health Check"

# 1. Check cluster status
print_header "1. Cluster Status"
kubectl cluster-info
echo ""

# 2. Check nodes
print_header "2. Node Status"
NODES=$(kubectl get nodes -o json | jq '.items | length')
READY_NODES=$(kubectl get nodes --no-headers | grep -c ' Ready ')

if [ "$NODES" -eq "$READY_NODES" ]; then
    print_success "All $NODES nodes are ready"
else
    print_warning "$READY_NODES/$NODES nodes are ready"
fi

kubectl get nodes -o wide
echo ""

# 3. Check resource usage
print_header "3. Resource Usage"
echo "Nodes:"
kubectl top nodes 2>/dev/null || print_warning "Metrics not available (install metrics-server)"
echo ""

# 4. Check Learnivo namespace
print_header "4. Learnivo Namespace"

if kubectl get namespace $NAMESPACE &>/dev/null; then
    print_success "Namespace '$NAMESPACE' exists"
else
    print_error "Namespace '$NAMESPACE' does not exist"
    exit 1
fi

echo ""

# 5. Check pods
print_header "5. Learnivo Pods"
POD_COUNT=$(kubectl get pods -n $NAMESPACE --no-headers | wc -l)
RUNNING_PODS=$(kubectl get pods -n $NAMESPACE --no-headers | grep -c 'Running' || true)

echo "Total pods: $POD_COUNT, Running: $RUNNING_PODS"
echo ""

kubectl get pods -n $NAMESPACE -o wide
echo ""

# Check for pod errors
FAILED_PODS=$(kubectl get pods -n $NAMESPACE --no-headers | grep -v 'Running' | grep -v 'Completed' || true)
if [ -n "$FAILED_PODS" ]; then
    print_warning "Some pods are not running:"
    echo "$FAILED_PODS"
    echo ""
fi

# 6. Check services
print_header "6. Learnivo Services"
kubectl get svc -n $NAMESPACE
echo ""

# 7. Check deployments
print_header "7. Learnivo Deployments"
DEPLOYMENTS=$(kubectl get deployments -n $NAMESPACE -o json | jq '.items | length')
READY_DEPLOYMENTS=$(kubectl get deployments -n $NAMESPACE --no-headers | grep -c ' [1-9]' | head -1 || echo 0)

kubectl get deployments -n $NAMESPACE
echo ""

# 8. Check configmaps and secrets
print_header "8. ConfigMaps and Secrets"
echo "ConfigMaps:"
kubectl get configmaps -n $NAMESPACE
echo ""
echo "Secrets:"
kubectl get secrets -n $NAMESPACE
echo ""

# 9. Check ingress
print_header "9. Ingress"
if kubectl get ingress -n $NAMESPACE &>/dev/null; then
    kubectl get ingress -n $NAMESPACE
else
    print_warning "No ingress configured"
fi
echo ""

# 10. Check persistent volumes
print_header "10. Persistent Volumes"
PV_COUNT=$(kubectl get pv --no-headers | wc -l)
if [ "$PV_COUNT" -gt 0 ]; then
    kubectl get pv
else
    print_warning "No persistent volumes found"
fi
echo ""

# 11. Check events
print_header "11. Recent Events"
kubectl get events -n $NAMESPACE --sort-by='.lastTimestamp' | tail -20
echo ""

# 12. Check storage
print_header "12. Disk Usage"
echo "Nodes:"
kubectl describe nodes | grep -A 5 "Allocated resources"
echo ""

# 13. Network connectivity
print_header "13. Network Connectivity Test"

# Test DNS
FIRST_POD=$(kubectl get pods -n $NAMESPACE -o jsonpath='{.items[0].metadata.name}' 2>/dev/null || echo "")
if [ -n "$FIRST_POD" ]; then
    echo "Testing DNS from pod: $FIRST_POD"
    kubectl exec -n $NAMESPACE $FIRST_POD -- nslookup discovery-server.learnivo.svc.cluster.local 2>/dev/null && \
        print_success "DNS resolution working" || \
        print_error "DNS resolution failed"
else
    print_warning "No pods available for network test"
fi
echo ""

# 14. Summary
print_header "Summary"

if [ "$NODES" -eq "$READY_NODES" ] && [ "$POD_COUNT" -eq "$RUNNING_PODS" ]; then
    print_success "All checks passed!"
    exit 0
else
    print_warning "Some issues detected - see details above"
    exit 1
fi
