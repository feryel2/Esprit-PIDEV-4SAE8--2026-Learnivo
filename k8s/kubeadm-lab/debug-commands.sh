#!/bin/bash
# Useful Commands for kubeadm + Calico Cluster Debugging
# Usage: Run these commands from the control-plane VM

# ============================================================================
# QUICK STATUS CHECKS
# ============================================================================

# Show cluster overview
show_status() {
    echo "=== CLUSTER STATUS ==="
    kubectl get nodes -o wide
    echo ""
    echo "=== CONTROL PLANE COMPONENTS ==="
    kubectl get pods -n kube-system -l tier=control-plane -o wide
    echo ""
    echo "=== CNI (Calico) ==="
    kubectl get pods -n kube-system -l k8s-app=calico-node -o wide
    echo ""
    echo "=== DNS & kube-proxy ==="
    kubectl get pods -n kube-system -l k8s-app=kube-dns,k8s-app=kube-proxy -o wide
}

# ============================================================================
# kubeadm CHECKS
# ============================================================================

# Check kubeadm init status
check_kubeadm_status() {
    echo "=== kubeadm init configuration ==="
    sudo cat /etc/kubernetes/manifests/kube-apiserver.yaml | grep -E "advertise-address|pod-network-cidr" || true
    echo ""
    echo "=== Available tokens ==="
    sudo kubeadm token list
    echo ""
    echo "=== Certificates ==="
    sudo kubeadm certs check-expiration
}

# Check kubelet status
check_kubelet() {
    echo "=== kubelet service ==="
    sudo systemctl status kubelet --no-pager
    echo ""
    echo "=== kubelet logs (last 50 lines) ==="
    sudo journalctl -u kubelet -n 50 --no-pager
}

# ============================================================================
# CALICO CHECKS
# ============================================================================

# Check Calico installation
check_calico() {
    echo "=== Calico pods status ==="
    kubectl get pods -n kube-system -l k8s-app=calico-node -o wide
    kubectl get pods -n kube-system -l k8s-app=calico-kube-controllers -o wide
    echo ""
    echo "=== Calico node status ==="
    kubectl get nodes -o custom-columns=NAME:.metadata.name,CALICO_STATUS:.status.conditions[?(@.type==\"Ready\")].status
}

# Show Calico logs
show_calico_logs() {
    echo "=== Calico node logs (last 50 lines) ==="
    kubectl logs -n kube-system -l k8s-app=calico-node --tail=50 --all-containers=true
}

# Check pod network connectivity
test_pod_network() {
    echo "=== Testing pod network connectivity ==="
    
    # Create test pod
    test_pod=$(kubectl run test-network-$(date +%s) --image=busybox:latest --restart=Never -- sleep 300 -q 2>/dev/null && kubectl get pods -l run=test-network --sort-by=.metadata.creationTimestamp -o jsonpath='{.items[-1].metadata.name}')
    
    echo "Test pod: $test_pod"
    
    # Wait for pod to be ready
    sleep 5
    
    # Test DNS
    echo ""
    echo "DNS Resolution Test:"
    kubectl exec $test_pod -- nslookup kubernetes.default || echo "DNS test failed"
    
    # Test API connectivity
    echo ""
    echo "API Server Connectivity Test:"
    kubectl exec $test_pod -- wget -qO- https://kubernetes.default/api/v1 || echo "API test failed"
    
    # Cleanup
    echo ""
    echo "Cleaning up test pod..."
    kubectl delete pod $test_pod 2>/dev/null || true
}

# ============================================================================
# API SERVER CHECKS
# ============================================================================

# Check API server health
check_api_server() {
    echo "=== API Server Health Check ==="
    kubectl get --raw=/healthz
    echo "" # newline
    
    echo "=== API Server Ready Check ==="
    kubectl get --raw=/readyz
    echo "" # newline
    
    echo "=== Metrics ==="
    kubectl get --raw=/metrics 2>/dev/null | head -10 || echo "Metrics not available"
}

# Show API server logs
show_apiserver_logs() {
    echo "=== kube-apiserver logs ==="
    kubectl logs -n kube-system -l component=kube-apiserver --tail=50
}

# ============================================================================
# NODE CHECKS
# ============================================================================

# Show detailed node information
show_node_details() {
    NODE="${1:-$(kubectl get nodes -o jsonpath='{.items[0].metadata.name}')}"
    echo "=== Node: $NODE ==="
    kubectl describe node $NODE
}

# Show node resource usage
show_node_resources() {
    echo "=== Node Resources ==="
    kubectl top nodes 2>/dev/null || echo "Metrics server not available"
}

# Show node events
show_node_events() {
    NODE="${1:-$(kubectl get nodes -o jsonpath='{.items[0].metadata.name}')}"
    echo "=== Events for node $NODE ==="
    kubectl get events --field-selector involvedObject.name=$NODE --sort-by='.lastTimestamp'
}

# ============================================================================
# CONTAINER RUNTIME CHECKS
# ============================================================================

# Check containerd status
check_containerd() {
    echo "=== containerd service ==="
    sudo systemctl status containerd --no-pager
    echo ""
    echo "=== containerd logs (last 50 lines) ==="
    sudo journalctl -u containerd -n 50 --no-pager
}

# Check containerd images
show_containerd_images() {
    echo "=== Downloaded container images ==="
    sudo ctr images ls
}

# ============================================================================
# ETCD CHECKS
# ============================================================================

# Check etcd health
check_etcd() {
    echo "=== etcd pod status ==="
    kubectl get pod -n kube-system -l component=etcd -o wide
    echo ""
    echo "=== etcd logs ==="
    kubectl logs -n kube-system -l component=etcd --tail=50
}

# ============================================================================
# PROVISIONING LOGS
# ============================================================================

# Show provisioning logs
show_provisioning_logs() {
    echo "=== Control-plane provisioning log ==="
    if [ -f /tmp/control-plane.log ]; then
        tail -f /tmp/control-plane.log
    else
        echo "No control-plane log found"
    fi
    
    echo ""
    echo "=== Worker provisioning logs ==="
    if [ -f /tmp/worker.log ]; then
        tail -f /tmp/worker.log
    else
        echo "No worker logs found"
    fi
}

# ============================================================================
# CLUSTER VERIFICATION
# ============================================================================

# Full cluster check
full_cluster_check() {
    echo "=========================================="
    echo "FULL CLUSTER VERIFICATION"
    echo "=========================================="
    echo ""
    show_status
    echo ""
    check_api_server
    echo ""
    check_calico
    echo ""
    echo "=========================================="
    echo "For detailed verify-cluster.sh output:"
    echo "bash /vagrant/k8s/kubeadm-lab/verify-cluster.sh"
    echo "=========================================="
}

# ============================================================================
# DEPLOYMENT CHECKS
# ============================================================================

# Show Learnivo deployment status
show_learnivo_status() {
    echo "=== Learnivo Namespace ==="
    kubectl get namespace learnivo 2>/dev/null || echo "Namespace not found"
    echo ""
    echo "=== Learnivo Pods ==="
    kubectl get pods -n learnivo -o wide 2>/dev/null || echo "No pods in learnivo namespace"
    echo ""
    echo "=== Learnivo Services ==="
    kubectl get svc -n learnivo -o wide 2>/dev/null || echo "No services in learnivo namespace"
}

# Show pod logs
show_pod_logs() {
    POD="${1:-}"
    if [ -z "$POD" ]; then
        echo "Usage: show_pod_logs <pod-name> [namespace]"
        return 1
    fi
    NAMESPACE="${2:-default}"
    echo "=== Logs for pod: $POD (namespace: $NAMESPACE) ==="
    kubectl logs $POD -n $NAMESPACE --all-containers=true --tail=100
}

# ============================================================================
# NETWORK DEBUGGING
# ============================================================================

# Test service DNS resolution
test_service_dns() {
    SERVICE="${1:-kubernetes.default}"
    echo "=== Testing DNS resolution for: $SERVICE ==="
    
    test_pod=$(kubectl run test-dns-$(date +%s) --image=busybox:latest --restart=Never -- sleep 300 -q 2>/dev/null && kubectl get pods -l run=test-dns --sort-by=.metadata.creationTimestamp -o jsonpath='{.items[-1].metadata.name}')
    
    sleep 3
    
    echo "Resolving $SERVICE:"
    kubectl exec $test_pod -- nslookup $SERVICE
    
    echo ""
    echo "Cleaning up..."
    kubectl delete pod $test_pod 2>/dev/null || true
}

# ============================================================================
# CLEANUP
# ============================================================================

# Clean all test pods
cleanup_test_pods() {
    echo "Removing all test pods..."
    kubectl delete pods -l run=test-network,run=test-dns --all-namespaces --ignore-not-found
}

# ============================================================================
# USAGE MENU
# ============================================================================

show_usage() {
    cat <<EOF
Usage: source this script then run any of these functions:

QUICK CHECKS:
  show_status                  - Show cluster status
  full_cluster_check           - Run complete cluster verification

kubeadm:
  check_kubeadm_status         - Show kubeadm init status
  check_kubelet                - Check kubelet service and logs
  check_api_server             - Check API server health
  show_apiserver_logs          - Show API server logs

CALICO:
  check_calico                 - Check Calico status
  show_calico_logs             - Show Calico logs
  test_pod_network             - Test pod network connectivity

NODE:
  show_node_details [NODE]     - Show detailed node info
  show_node_resources          - Show node resource usage
  show_node_events [NODE]      - Show node events

CONTAINER RUNTIME:
  check_containerd             - Check containerd status
  show_containerd_images       - Show container images

ETCD:
  check_etcd                   - Check etcd status

PROVISIONING:
  show_provisioning_logs       - Show provisioning logs

DEPLOYMENT:
  show_learnivo_status         - Show Learnivo deployment status
  show_pod_logs POD [NS]       - Show pod logs

NETWORK:
  test_service_dns SERVICE     - Test service DNS resolution

CLEANUP:
  cleanup_test_pods            - Remove all test pods

HELP:
  show_usage                   - Show this message

Examples:
  show_status
  full_cluster_check
  check_calico
  show_node_details learnivo-cp
  test_pod_network
  show_pod_logs my-pod default
EOF
}

# Show usage if called with no arguments
if [ $# -eq 0 ]; then
    show_usage
fi
