#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

JOIN_SCRIPT="/vagrant/k8s/kubeadm-lab/join.sh"
MAX_WAIT=300  # 5 minutes
WAIT_INTERVAL=5

# Helper functions
log_info() { echo "[worker] INFO: $*" | tee -a /tmp/worker.log; }
log_error() { echo "[worker] ERROR: $*" | tee -a /tmp/worker.log; }
log_success() { echo "[worker] ✓ $*" | tee -a /tmp/worker.log; }

# ============================================
# PHASE 1: Wait for Join Script from Control Plane
# ============================================
log_info "PHASE 1: Waiting for join script (max ${MAX_WAIT}s)"

join_ready=false
elapsed=0
while [ ${elapsed} -lt ${MAX_WAIT} ]; do
  if test -f "${JOIN_SCRIPT}"; then
    log_success "Join script found"
    join_ready=true
    break
  fi
  echo -n "."
  sleep ${WAIT_INTERVAL}
  elapsed=$((elapsed + WAIT_INTERVAL))
done

if [ "${join_ready}" != "true" ]; then
  log_error "Join script not found after ${MAX_WAIT}s"
  exit 1
fi

# ============================================
# PHASE 2: Check if Already Joined
# ============================================
if sudo test -f /etc/kubernetes/kubelet.conf; then
  log_info "Already joined to cluster, skipping"
  exit 0
fi

# ============================================
# PHASE 3: Join Cluster
# ============================================
log_info "PHASE 3: Joining cluster"

if sudo bash "${JOIN_SCRIPT}" 2>&1 | tee -a /tmp/worker.log; then
  log_success "Successfully joined cluster"
else
  log_error "Failed to join cluster"
  exit 1
fi

# ============================================
# PHASE 4: Verification
# ============================================
log_info "PHASE 4: Verifying worker node"

sleep 10

if sudo test -f /etc/kubernetes/kubelet.conf; then
  log_success "Worker node configuration verified"
else
  log_error "Worker node configuration not found"
  exit 1
fi

log_success "Worker node initialization completed"


