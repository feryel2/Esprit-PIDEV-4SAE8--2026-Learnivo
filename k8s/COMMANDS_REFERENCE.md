# Kubernetes Commands Reference - Learnivo

## Déploiement

### Déployer tous les manifests
```bash
cd k8s
kubectl apply -f .
```

### Déployer spécifiquement
```bash
# Namespace + Config
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/01-configmap.yaml
kubectl apply -f k8s/02-secrets.yaml

# Backend
kubectl apply -f k8s/backend/

# Frontend
kubectl apply -f k8s/frontend/

# Network policies
kubectl apply -f k8s/03-network-policies.yaml

# Ingress
kubectl apply -f k8s/04-ingress.yaml
```

### Avec Kustomize
```bash
kubectl apply -k k8s/
```

### Avec Helm (si configuré)
```bash
helm install learnivo ./helm-chart -n learnivo
```

---

## Inspection des Ressources

### Voir les pods
```bash
# Tous les pods dans learnivo
kubectl get pods -n learnivo

# Avec détails
kubectl get pods -n learnivo -o wide

# En JSON
kubectl get pods -n learnivo -o json

# Avec colonnes personnalisées
kubectl get pods -n learnivo -o custom-columns=NAME:.metadata.name,STATUS:.status.phase,NODE:.spec.nodeName
```

### Voir les services
```bash
kubectl get svc -n learnivo

# Avec IPs externes
kubectl get svc -n learnivo -o wide

# Format YAML
kubectl get svc api-gateway -n learnivo -o yaml
```

### Voir les déploiements
```bash
kubectl get deployments -n learnivo

# Status
kubectl get deployments -n learnivo -w

# Détails
kubectl describe deployment api-gateway -n learnivo
```

### Voir les ConfigMaps et Secrets
```bash
# ConfigMaps
kubectl get configmap -n learnivo
kubectl get configmap api-gateway-config -n learnivo -o yaml

# Secrets
kubectl get secrets -n learnivo
kubectl get secret learnivo-secrets -n learnivo -o yaml
```

### Voir l'Ingress
```bash
kubectl get ingress -n learnivo
kubectl describe ingress learnivo-ingress -n learnivo
```

---

## Logs et Debugging

### Voir les logs
```bash
# Logs d'un pod
kubectl logs -n learnivo <pod-name>

# Logs en temps réel
kubectl logs -f -n learnivo <pod-name>

# Logs de tous les pods d'un service
kubectl logs -f -n learnivo -l app=api-gateway

# Dernières 100 lignes
kubectl logs -n learnivo <pod-name> --tail=100

# Logs d'un conteneur spécifique
kubectl logs -n learnivo <pod-name> -c api-gateway

# Logs précédents (pod redémarré)
kubectl logs -n learnivo <pod-name> --previous
```

### Décrire les ressources
```bash
# Pod
kubectl describe pod -n learnivo <pod-name>

# Déploiement
kubectl describe deployment api-gateway -n learnivo

# Service
kubectl describe service api-gateway -n learnivo
```

### Exécuter des commandes dans les pods
```bash
# Bash interactif
kubectl exec -it -n learnivo <pod-name> -- /bin/bash

# Commande unique
kubectl exec -n learnivo <pod-name> -- ls -la

# Vérifier la santé
kubectl exec -n learnivo <pod-name> -- curl http://localhost:8080/actuator/health

# Java pods
kubectl exec -n learnivo <pod-name> -- jps
kubectl exec -n learnivo <pod-name> -- jstat -gc 1
```

### Vérifier les événements
```bash
# Tous les événements
kubectl get events -n learnivo

# Trier par timestamp
kubectl get events -n learnivo --sort-by='.lastTimestamp'

# Format détaillé
kubectl describe event -n learnivo <event-name>
```

---

## Port Forwarding

### Accès local
```bash
# Frontend (port 4200)
kubectl port-forward -n learnivo svc/frontend 4200:80

# API Gateway (port 8080)
kubectl port-forward -n learnivo svc/api-gateway 8080:8080

# Discovery Server (port 8761)
kubectl port-forward -n learnivo svc/discovery-server 8761:8761

# Spécific pod
kubectl port-forward -n learnivo pod/<pod-name> 8080:8080

# Port différent sur localhost
kubectl port-forward -n learnivo svc/api-gateway 9090:8080
# Accès: http://localhost:9090
```

---

## Scaling

### Scaler les déploiements
```bash
# Scaler à N replicas
kubectl scale deployment api-gateway -n learnivo --replicas=5

# Vérifier le scaling
kubectl get deployment api-gateway -n learnivo -w
```

### Auto-scaling (HPA - requiert metrics-server)
```bash
# Créer HPA
kubectl autoscale deployment api-gateway -n learnivo --min=2 --max=10 --cpu-percent=70

# Voir HPA
kubectl get hpa -n learnivo

# Détails
kubectl describe hpa api-gateway -n learnivo

# Supprimer HPA
kubectl delete hpa api-gateway -n learnivo
```

---

## Mise à Jour et Rollout

### Mettre à jour une image
```bash
# Nouvelle image
kubectl set image deployment/api-gateway \
  api-gateway=learnivo/api-gateway:v2 \
  -n learnivo

# Avec notification
kubectl set image deployment/api-gateway \
  api-gateway=learnivo/api-gateway:v2 \
  -n learnivo \
  --record
```

### Voir l'historique des rollouts
```bash
kubectl rollout history deployment/api-gateway -n learnivo

# Avec détails de révisions
kubectl rollout history deployment/api-gateway -n learnivo --revision=2
```

### Rollback
```bash
# Revenir à la version précédente
kubectl rollout undo deployment/api-gateway -n learnivo

# Revenir à une révision spécifique
kubectl rollout undo deployment/api-gateway -n learnivo --to-revision=2
```

### Status du rollout
```bash
# Attendre le rollout
kubectl rollout status deployment/api-gateway -n learnivo

# Ou observer en temps réel
kubectl get deployment api-gateway -n learnivo -w
```

---

## Ressources et Quotas

### Voir l'utilisation des ressources
```bash
# Noeuds
kubectl top nodes

# Pods
kubectl top pods -n learnivo

# Pod spécifique
kubectl top pod <pod-name> -n learnivo

# Avec labels
kubectl top pods -n learnivo -l app=api-gateway
```

### Limites de ressources
```bash
# Modifier les limites
kubectl set resources deployment api-gateway \
  -n learnivo \
  --requests=memory=256Mi,cpu=200m \
  --limits=memory=512Mi,cpu=500m
```

### Quotas (créer des limites par namespace)
```bash
# Voir les quotas
kubectl get resourcequota -n learnivo

# Détails
kubectl describe resourcequota -n learnivo
```

---

## Network et Connectivité

### Tester la connectivité DNS
```bash
# Depuis un pod, tester DNS
kubectl exec -n learnivo <pod-name> -- nslookup discovery-server

# Tester résolution FQDN
kubectl exec -n learnivo <pod-name> -- nslookup discovery-server.learnivo.svc.cluster.local
```

### Tester les services
```bash
# Depuis un pod
kubectl exec -n learnivo <pod-name> -- curl http://api-gateway:8080/actuator/health

# Avec wget
kubectl exec -n learnivo <pod-name> -- wget -qO- http://course-service:8081/actuator/health
```

### Network policies
```bash
# Voir les politiques
kubectl get networkpolicies -n learnivo

# Détails
kubectl describe networkpolicy frontend-to-gateway -n learnivo
```

---

## Suppression

### Supprimer des ressources
```bash
# Supprimer tout dans le namespace
kubectl delete all --all -n learnivo

# Supprimer un pod
kubectl delete pod <pod-name> -n learnivo

# Supprimer un déploiement
kubectl delete deployment api-gateway -n learnivo

# Supprimer un service
kubectl delete service api-gateway -n learnivo

# Supprimer tout dans un fichier
kubectl delete -f k8s/01-configmap.yaml
```

### Supprimer le namespace entier
```bash
kubectl delete namespace learnivo
```

### Force delete (dangereux)
```bash
kubectl delete pod <pod-name> -n learnivo --force --grace-period=0
```

---

## Patching et Édition

### Éditer une ressource
```bash
# Éditer en direct
kubectl edit deployment api-gateway -n learnivo

# Éditer un ConfigMap
kubectl edit configmap api-gateway-config -n learnivo
```

### Patcher une ressource
```bash
# JSON patch
kubectl patch deployment api-gateway -n learnivo -p '{"spec":{"replicas":3}}'

# Merge patch
kubectl patch -f api-gateway.yaml -p '{"spec":{"replicas":3}}' -n learnivo
```

### Ajouter des labels
```bash
kubectl label pods <pod-name> -n learnivo version=v2

# Supprimer un label
kubectl label pods <pod-name> -n learnivo version-
```

### Ajouter des annotations
```bash
kubectl annotate pods <pod-name> -n learnivo reason="test-annotation"
```

---

## Santé des Pods

### Vérifier les probes
```bash
# Voir les conditions
kubectl get pods -n learnivo -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.conditions[*].type}{"\n"}{end}'

# Détails de chaque condition
kubectl describe pod <pod-name> -n learnivo | grep -A 20 "Conditions:"
```

### Restart des pods
```bash
# Redémarrer un pod en supprimant/recréant
kubectl delete pod <pod-name> -n learnivo

# Redémarrer un déploiement entier
kubectl rollout restart deployment/api-gateway -n learnivo

# Ou via patch
kubectl patch deployment api-gateway -n learnivo -p "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"restartedAt\":\"$(date)\"}}}}}"
```

---

## Cluster Management

### Informations du cluster
```bash
kubectl cluster-info

kubectl cluster-info dump

kubectl version

kubectl api-resources

kubectl api-versions
```

### Nœuds
```bash
# Voir les nœuds
kubectl get nodes

# Détails
kubectl describe node <node-name>

# Marquer comme non-schedulable
kubectl cordon <node-name>

# Permettre de nouveau la planification
kubectl uncordon <node-name>

# Drainer pour maintenance
kubectl drain <node-name> --ignore-daemonsets
```

### Contextes et configurations
```bash
# Voir les contextes
kubectl config get-contexts

# Changer de contexte
kubectl config use-context <context-name>

# Voir la configuration actuelle
kubectl config view
```

---

## Commandes Utiles Rapides

```bash
# Tous les pods qui crashent
kubectl get pods -n learnivo --field-selector=status.phase!=Running

# Pods par nœud
kubectl get pods -n learnivo -o wide | grep <node-name>

# Pods avec erreurs OOMKilled
kubectl get pods -n learnivo -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.containerStatuses[*].state.waiting.reason}{"\n"}{end}'

# Redémarrer tous les pods
kubectl rollout restart deployments -n learnivo

# Exporter et sauvegarder une config
kubectl get all -n learnivo -o yaml > learnivo-backup.yaml

# Restaurer depuis une sauvegarde
kubectl apply -f learnivo-backup.yaml

# Voir les metrics (si prometheus est installé)
kubectl top nodes
kubectl top pods -n learnivo

# Events triés par temps
kubectl get events -n learnivo --sort-by='.lastTimestamp'

# Pods en erreur d'image
kubectl get pods -n learnivo -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.containerStatuses[*].imageID}{"\n"}{end}'
```

---

## Debugging Avancé

### Logs des nœuds
```bash
# SSH dans le nœud (Minikube)
minikube ssh

# Voir les services systemd
systemctl status kubelet
journalctl -u kubelet -f
```

### Inspecteur de ressources
```bash
# JSON d'un pod entier
kubectl get pod <pod-name> -n learnivo -o json | jq .

# Template personnalisé
kubectl get pods -n learnivo -o custom-columns=NAME:.metadata.name,CPU_REQ:.spec.containers[].resources.requests.cpu,MEM_REQ:.spec.containers[].resources.requests.memory
```

### Déboguer avec un pod de debug
```bash
# Créer un pod de debug temporaire
kubectl debug node/<node-name> -it --image=ubuntu

# Ou pour un pod existant
kubectl debug <pod-name> -n learnivo -it --image=ubuntu
```

---

**Note**: Remplacer `<pod-name>`, `<deployment-name>`, `<service-name>`, `<node-name>` par vos valeurs réelles.
