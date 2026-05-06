#!/usr/bin/env bash
#
# Kubernetes Cluster Verification Script
# Validates complete kubeadm + Calico initialization
#

set -euo pipefail

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_check() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# ============================================================================
# CHECK 1: kubectl availability
# ============================================================================
print_header "CHECK 1: kubectl Availability"

if ! command -v kubectl &> /dev/null; then
    print_error "kubectl not found in PATH"
    exit 1
fi

kubectl_version=$(kubectl version --client -o json 2>/dev/null | jq -r '.clientVersion.gitVersion')
print_check "kubectl is available: $kubectl_version"

# ============================================================================
# CHECK 2: Cluster connectivity
# ============================================================================
print_header "CHECK 2: Cluster Connectivity"

if ! kubectl cluster-info &>/dev/null; then
    print_error "Cannot connect to cluster"
    exit 1
fi

api_server=$(kubectl cluster-info 2>/dev/null | grep "Kubernetes master" | awk '{print $NF}')
print_check "Connected to API server: $api_server"

# ============================================================================
# CHECK 3: Node status
# ============================================================================
print_header "CHECK 3: Node Status"

node_count=$(kubectl get nodes --no-headers 2>/dev/null | wc -l)
print_info "Total nodes: $node_count"

ready_nodes=$(kubectl get nodes --no-headers 2>/dev/null | grep -c "Ready" || echo 0)

if [ "$ready_nodes" -eq 0 ]; then
    print_error "No nodes in Ready state"
    kubectl get nodes -o wide
    exit 1
fi

print_check "$ready_nodes/$node_count nodes are Ready"
kubectl get nodes -o wide

# ============================================================================
# CHECK 4: Control plane components
# ============================================================================
print_header "CHECK 4: Control Plane Components"

critical_components=("kube-apiserver" "kube-controller-manager" "kube-scheduler" "etcd")

for component in "${critical_components[@]}"; do
    status=$(kubectl get pods -n kube-system -l component=$component 2>/dev/null | grep -c "Running" || echo 0)
    if [ "$status" -gt 0 ]; then
        print_check "$component: Running"
    else
        print_error "$component: Not running"
    fi
done

echo ""
print_info "All control plane pods:"
kubectl get pods -n kube-system -l tier=control-plane -o wide 2>/dev/null || true

# ============================================================================
# CHECK 5: CNI (Calico) Status
# ============================================================================
print_header "CHECK 5: CNI (Calico) Status"

calico_pods=$(kubectl get pods -n kube-system -l k8s-app=calico-node --no-headers 2>/dev/null | grep -c "Running" || echo 0)

if [ "$calico_pods" -eq 0 ]; then
    print_warning "No Calico nodes found - CNI may not be installed"
    echo ""
    print_info "Attempting to install Calico..."
    if kubectl apply --validate=false -f https://raw.githubusercontent.com/projectcalico/calico/v3.27.3/manifests/calico.yaml 2>&1; then
        print_check "Calico installation started"
        print_info "Waiting for Calico pods to be ready (this may take 60-90 seconds)..."
        kubectl wait --for=condition=ready pod -l k8s-app=calico-node -n kube-system --timeout=300s 2>/dev/null || true
    else
        print_error "Failed to install Calico"
    fi
else
    print_check "Calico nodes: $calico_pods running"
fi

echo ""
print_info "Calico pod status:"
kubectl get pods -n kube-system -l k8s-app=calico-node -o wide 2>/dev/null || true

# ============================================================================
# CHECK 6: CoreDNS Status
# ============================================================================
print_header "CHECK 6: CoreDNS Status"

coredns_status=$(kubectl get pods -n kube-system -l k8s-app=kube-dns 2>/dev/null | grep -c "Running" || echo 0)

if [ "$coredns_status" -gt 0 ]; then
    print_check "CoreDNS: Running"
else
    print_warning "CoreDNS: Not running"
fi

kubectl get pods -n kube-system -l k8s-app=kube-dns -o wide 2>/dev/null || true

# ============================================================================
# CHECK 7: kube-proxy Status
# ============================================================================
print_header "CHECK 7: kube-proxy Status"

kubeproxy_status=$(kubectl get pods -n kube-system -l k8s-app=kube-proxy 2>/dev/null | grep -c "Running" || echo 0)

if [ "$kubeproxy_status" -gt 0 ]; then
    print_check "kube-proxy: Running ($kubeproxy_status/$node_count)"
else
    print_error "kube-proxy: Not running"
fi

kubectl get pods -n kube-system -l k8s-app=kube-proxy -o wide 2>/dev/null || true

# ============================================================================
# CHECK 8: Pod networking test
# ============================================================================
print_header "CHECK 8: Pod Networking Test"

print_info "Creating test pod..."
test_pod_name="test-connectivity-$(date +%s)"

kubectl run "$test_pod_name" --image=busybox:latest --restart=Never --command -- sleep 300 >/dev/null 2>&1 || true
sleep 5

test_pod_status=$(kubectl get pod "$test_pod_name" -o jsonpath='{.status.phase}' 2>/dev/null || echo "Unknown")

if [ "$test_pod_status" = "Running" ]; then
    print_check "Test pod is running"
    
    # Try to resolve DNS
    print_info "Testing DNS resolution..."
    if kubectl exec "$test_pod_name" -- nslookup kubernetes.default >/dev/null 2>&1; then
        print_check "DNS resolution working"
    else
        print_warning "DNS resolution test inconclusive"
    fi
    
    # Cleanup
    kubectl delete pod "$test_pod_name" >/dev/null 2>&1 || true
else
    print_warning "Test pod failed to reach Running state (status: $test_pod_status)"
fi

# ============================================================================
# CHECK 9: Storage Classes
# ============================================================================
print_header "CHECK 9: Storage Classes"

storage_count=$(kubectl get storageclass --no-headers 2>/dev/null | wc -l)

if [ "$storage_count" -eq 0 ]; then
    print_warning "No storage classes defined"
else
    print_check "$storage_count storage class(es) available"
    kubectl get storageclass -o wide 2>/dev/null || true
fi

# ============================================================================
# SUMMARY
# ============================================================================
print_header "CLUSTER VERIFICATION SUMMARY"

if [ "$ready_nodes" -gt 0 ] && [ "$calico_pods" -gt 0 ] && [ "$coredns_status" -gt 0 ]; then
    print_check "Cluster is initialized and ready!"
    echo ""
    print_info "Next steps:"
    echo "  1. Verify all nodes are Ready: kubectl get nodes"
    echo "  2. Deploy Learnivo:"
    echo "     cd /vagrant"
    echo "     kubectl apply -f k8s/00-namespace.yaml"
    echo "     kubectl apply -f k8s/01-configmap.yaml"
    echo "     kubectl apply -f k8s/02-secrets.yaml"
    echo "     kubectl apply -f k8s/backend/"
    echo "     kubectl apply -f k8s/frontend/"
    echo "  3. Monitor deployment: kubectl get pods -n learnivo -o wide -w"
else
    print_warning "Some components may still be initializing..."
    echo ""
    print_info "Wait a few moments and run this script again:"
    echo "  bash verify-cluster.sh"
fi

echo ""
