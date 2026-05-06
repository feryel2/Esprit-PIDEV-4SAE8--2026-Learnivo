#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

CONTROL_PLANE_IP="192.168.56.10"
POD_CIDR="192.168.0.0/16"
CALICO_VERSION="v3.27.3"
MAX_RETRIES=60
RETRY_INTERVAL=5

# Helper functions
log_info() { echo "[control-plane] INFO: $*" | tee -a /tmp/control-plane.log; }
log_error() { echo "[control-plane] ERROR: $*" | tee -a /tmp/control-plane.log; }
log_success() { echo "[control-plane] ✓ $*" | tee -a /tmp/control-plane.log; }

# Check if already initialized
if sudo test -f /etc/kubernetes/admin.conf; then
  log_info "already initialized, skipping kubeadm init"
  exit 0
fi

# ============================================
# PHASE 1: Ensure Runtime Ready
# ============================================
log_info "PHASE 1: Ensure container runtime ready"
sudo systemctl start containerd
sudo systemctl enable containerd
sleep 2
if ! sudo systemctl is-active --quiet containerd; then
  log_error "containerd failed to start"
  exit 1
fi
log_success "containerd is running"

# ============================================
# PHASE 2: Initialize Kubernetes with kubeadm
# ============================================
log_info "PHASE 2: Initialize Kubernetes cluster"

sudo kubeadm init \
  --apiserver-advertise-address="${CONTROL_PLANE_IP}" \
  --pod-network-cidr="${POD_CIDR}" \
  --upload-certs \
  --cri-socket unix:///run/containerd/containerd.sock \
  --ignore-preflight-errors=NumCPU,Mem \
  2>&1 | tee -a /tmp/control-plane.log

log_success "kubeadm init completed"

# ============================================
# PHASE 3: Configure kubectl Access
# ============================================
log_info "PHASE 3: Configure kubectl access"

mkdir -p "$HOME/.kube"
sudo cp -f /etc/kubernetes/admin.conf "$HOME/.kube/config"
sudo chown "$(id -u)":"$(id -g)" "$HOME/.kube/config"
chmod 600 "$HOME/.kube/config"

log_success "kubeconfig configured"

# ============================================
# PHASE 4: Wait for API Server Readiness
# ============================================
log_info "PHASE 4: Wait for API server to be ready (max ${MAX_RETRIES} retries, ${RETRY_INTERVAL}s interval)"

api_ready=false
for attempt in $(seq 1 ${MAX_RETRIES}); do
  if kubectl --kubeconfig /etc/kubernetes/admin.conf get --raw=/readyz >/dev/null 2>&1; then
    log_success "API server is ready (attempt ${attempt})"
    api_ready=true
    break
  fi
  echo -n "."
  sleep ${RETRY_INTERVAL}
done

if [ "${api_ready}" != "true" ]; then
  log_error "API server failed to become ready after ${MAX_RETRIES} retries"
  exit 1
fi

# ============================================
# PHASE 5: Install Calico CNI
# ============================================
log_info "PHASE 5: Install Calico CNI (${CALICO_VERSION})"

cni_installed=false
for attempt in $(seq 1 10); do
  if kubectl apply --validate=false -f https://raw.githubusercontent.com/projectcalico/calico/${CALICO_VERSION}/manifests/calico.yaml 2>&1 | tee -a /tmp/control-plane.log; then
    log_success "Calico applied successfully (attempt ${attempt})"
    cni_installed=true
    break
  fi
  log_info "Calico apply retry ${attempt}/10"
  sleep 10
done

if [ "${cni_installed}" != "true" ]; then
  log_error "Failed to install Calico after 10 retries"
  exit 1
fi

# Wait for Calico pods to be ready
log_info "Waiting for Calico pods to be ready"
kubectl wait --for=condition=ready pod -l k8s-app=calico-node -n kube-system --timeout=300s 2>/dev/null || true
kubectl wait --for=condition=ready pod -l k8s-app=calico-kube-controllers -n kube-system --timeout=300s 2>/dev/null || true

log_success "Calico CNI installed"

# ============================================
# PHASE 6: Generate Join Command for Workers
# ============================================
log_info "PHASE 6: Generate join command for worker nodes"

JOIN_CMD="$(kubeadm token create --print-join-command)"
JOIN_CMD_FULL="${JOIN_CMD} --cri-socket unix:///run/containerd/containerd.sock --ignore-preflight-errors=NumCPU,Mem"

echo "${JOIN_CMD_FULL}" | sudo tee /vagrant/k8s/kubeadm-lab/join.sh >/dev/null
sudo chmod +x /vagrant/k8s/kubeadm-lab/join.sh

log_success "Join command saved to /vagrant/k8s/kubeadm-lab/join.sh"

# ============================================
# PHASE 7: Wait for Control Plane Node Ready
# ============================================
log_info "PHASE 7: Wait for control-plane node to be Ready (max ${MAX_RETRIES} retries, ${RETRY_INTERVAL}s interval)"

node_ready=false
for attempt in $(seq 1 ${MAX_RETRIES}); do
  status=$(kubectl get nodes -o jsonpath='{.items[0].status.conditions[?(@.type=="Ready")].status}' 2>/dev/null || echo "Unknown")
  
  if [ "${status}" = "True" ]; then
    log_success "Node is Ready (attempt ${attempt})"
    node_ready=true
    break
  fi
  
  echo -n "."
  sleep ${RETRY_INTERVAL}
done

if [ "${node_ready}" != "true" ]; then
  log_error "Node failed to become Ready after ${MAX_RETRIES} retries"
  log_info "Current node status:"
  kubectl get nodes -o wide
  exit 1
fi

# ============================================
# PHASE 8: Final Verification
# ============================================
log_info "PHASE 8: Final cluster verification"

echo ""
log_info "Node Status:"
kubectl get nodes -o wide

log_info "Control Plane Components:"
kubectl get pods -n kube-system -o wide

log_info "Calico Status:"
kubectl get pods -n kube-system -l k8s-app=calico-node -o wide || true

log_success "Control-plane initialization completed successfully!"
echo ""
echo "Next steps:"
echo "  1. Wait for worker nodes to join the cluster"
echo "  2. Verify all nodes are Ready: kubectl get nodes"
echo "  3. Deploy Learnivo: cd /vagrant && kubectl apply -f k8s/"
echo ""
