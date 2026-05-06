#!/usr/bin/env bash
set -euo pipefail

ROLE="${1:-worker}"

export DEBIAN_FRONTEND=noninteractive

echo "[common] role=${ROLE}"

sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gpg apt-transport-https lsb-release jq

# Disable swap (required by kubelet)
sudo swapoff -a || true
sudo sed -i '/\sswap\s/ s/^/#/' /etc/fstab || true

# Kernel modules and sysctls
sudo tee /etc/modules-load.d/k8s.conf >/dev/null <<'EOF'
overlay
br_netfilter
EOF
sudo modprobe overlay
sudo modprobe br_netfilter

sudo tee /etc/sysctl.d/k8s.conf >/dev/null <<'EOF'
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF
sudo sysctl --system >/dev/null

# Install containerd
sudo apt-get install -y containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml >/dev/null

# Use systemd cgroup driver (recommended)
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
sudo systemctl enable --now containerd

# Kubernetes apt repo (pkgs.k8s.io)
K8S_VERSION="1.30"
sudo mkdir -p /etc/apt/keyrings
curl -fsSL "https://pkgs.k8s.io/core:/stable:/v${K8S_VERSION}/deb/Release.key" | sudo gpg --batch --yes --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v${K8S_VERSION}/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list >/dev/null

sudo apt-get update -y
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

# Kubelet performance optimization for constrained environments
sudo tee /etc/default/kubelet >/dev/null <<'EOF'
KUBELET_EXTRA_ARGS="--max-pods=110 --system-reserved=cpu=100m,memory=100Mi --kube-reserved=cpu=100m,memory=100Mi"
EOF
sudo systemctl restart kubelet || true

sudo systemctl enable --now kubelet

# Make sure each node can resolve the others
sudo tee /etc/hosts >/dev/null <<'EOF'
127.0.0.1 localhost
192.168.56.10 learnivo-cp
192.168.56.11 learnivo-w1
192.168.56.12 learnivo-w2
EOF

echo "[common] done"

