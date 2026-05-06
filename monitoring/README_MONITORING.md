# Documentation Monitoring — Projet Learnivo

> **Modules surveillés :** Stage / Internship · Certification  
> **Outils :** Prometheus · Grafana  
> **Auteur :** Akrimi  
> **Date :** Mai 2026

---

## 1. 🎯 Objectif du Monitoring

L'objectif du monitoring est d'assurer la **visibilité en temps réel** de l'état de santé et des performances des services du projet Learnivo, notamment les modules **Stage** et **Certification**.

Grâce à Prometheus et Grafana, nous pouvons :
- Surveiller la disponibilité et le temps de réponse des services backend
- Détecter les anomalies et les pannes avant qu'elles impactent les utilisateurs
- Analyser l'utilisation des ressources (CPU, mémoire, requêtes HTTP)
- Préparer des alertes pour les environnements de production

---

## 2. 🔧 Outils utilisés

| Outil | Version | Rôle | Port |
|---|---|---|---|
| **Prometheus** | latest | Collecte et stockage des métriques | `9090` |
| **Grafana** | latest | Visualisation et tableaux de bord | `3000` |
| **Spring Boot Actuator** | inclus dans le backend | Exposition des métriques `/actuator/prometheus` | `8080` |

### Architecture du monitoring

```
Spring Boot Backend ──► /actuator/prometheus
                                │
                                ▼
                        Prometheus (9090)
                         (collecte toutes
                          les 15 secondes)
                                │
                                ▼
                         Grafana (3000)
                      (visualisation et
                        tableaux de bord)
```

---

## 3. 🚀 Comment démarrer le monitoring

### Prérequis
- Docker Desktop installé et en cours d'exécution
- Se placer à la **racine du projet** (là où se trouve le dossier `monitoring/`)

### Commande de démarrage
```bash
docker compose -f monitoring/docker-compose.monitoring.yml up -d
```

### Vérification que les conteneurs sont actifs
```bash
docker ps
# Vous devez voir : prometheus et grafana avec le statut "Up"
```

### Commande d'arrêt
```bash
docker compose -f monitoring/docker-compose.monitoring.yml down
```

---

## 4. 📊 Accès à Prometheus

1. Ouvrir le navigateur
2. Aller sur : **[http://localhost:9090](http://localhost:9090)**
3. Dans le champ de requête, taper par exemple :
   - `up` → affiche l'état de tous les targets (1 = actif, 0 = inactif)
   - `http_server_requests_seconds_count` → nombre de requêtes HTTP reçues
   - `process_cpu_usage` → utilisation CPU du backend

### Vérifier les targets Prometheus
- Aller dans **Status → Targets**
- Vous verrez la liste des services scrapés (prometheus, imed-backend, api-gateway)
- Un target avec l'état **UP** signifie que les métriques sont bien collectées

---

## 5. 📈 Accès à Grafana

1. Ouvrir le navigateur
2. Aller sur : **[http://localhost:3000](http://localhost:3000)**
3. Se connecter avec les identifiants par défaut :
   - **Utilisateur :** `admin`
   - **Mot de passe :** `admin`
4. Configurer la source de données Prometheus :
   - Aller dans **Configuration → Data Sources → Add data source**
   - Choisir **Prometheus**
   - URL : `http://prometheus:9090`
   - Cliquer sur **Save & Test**
5. Importer un tableau de bord Spring Boot :
   - Aller dans **Dashboards → Import**
   - Entrer l'ID : `12900` (Spring Boot Statistics) ou `6756`
   - Sélectionner la source Prometheus configurée
   - Cliquer sur **Import**

---

## 6. 🎯 Services planifiés à surveiller

| Service | Endpoint des métriques | Statut |
|---|---|---|
| **Prometheus** | `http://localhost:9090/metrics` | ✅ Actif |
| **Backend Spring Boot** (Stage & Certification) | `http://localhost:8080/actuator/prometheus` | 📋 Requiert Actuator activé |
| **API Gateway** | `http://localhost:8090/actuator/prometheus` | 📋 Requiert Actuator activé |
| **Eureka Server** | `http://localhost:8761/actuator/prometheus` | 📋 Optionnel |
| **SonarQube** | Via exporter dédié | 📋 Optionnel |

### ⚠️ Prérequis pour le backend Spring Boot

Pour que Prometheus puisse collecter les métriques du backend, il faut ajouter dans `application.properties` :

```properties
# Activer les endpoints Actuator
management.endpoints.web.exposure.include=health,info,prometheus
management.endpoint.prometheus.enabled=true
management.endpoint.health.show-details=always
```

Et ajouter la dépendance dans `pom.xml` :

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

---

## 7. 📸 Captures d'écran à prendre pour la présentation

### Prometheus
- [ ] **Interface Prometheus** : `http://localhost:9090` avec le logo visible
- [ ] **Status → Targets** : liste des targets avec état `UP`
- [ ] **Requête** : résultat de `up` dans le champ de recherche
- [ ] **Graph** : graphique d'une métrique (ex: `process_cpu_usage`)

### Grafana
- [ ] **Page de connexion** : `http://localhost:3000`
- [ ] **Data Source configurée** : Prometheus connecté avec "Data source is working"
- [ ] **Dashboard importé** : tableau de bord Spring Boot avec métriques visibles
- [ ] **Panneau de métriques** : graphique temps réel du backend

### Docker
- [ ] **`docker ps`** : conteneurs `prometheus` et `grafana` avec statut `Up`
- [ ] **`docker compose -f monitoring/docker-compose.monitoring.yml up -d`** : sortie de démarrage réussie

---

## 8. ✅ Satisfaction des exigences du professeur

| Critère DevOps | Statut | Preuve |
|---|---|---|
| CI/CD Frontend (test → build → docker) | ✅ Complété | GitHub Actions `frontend-ci-cd.yml` |
| CI/CD Backend (test → build → docker) | ✅ Complété | GitHub Actions `backend-ci-cd.yml` |
| Dockerisation Frontend | ✅ Complété | `Dockerfile` multi-stage (node → nginx) |
| Dockerisation Backend | ✅ Complété | `Dockerfile` Java 17 |
| Tests unitaires (38 tests) | ✅ Complété | `mvn clean test` → 0 échec |
| Analyse qualité SonarQube | ✅ Complété | Quality Gate PASSED |
| Couverture JaCoCo | ✅ Complété | Rapport HTML généré |
| Kubernetes manifests | ✅ Prêts | Dossier `k8s/` avec 4 fichiers YAML |
| **Monitoring Prometheus** | ✅ **Configuré** | `monitoring/prometheus.yml` |
| **Monitoring Grafana** | ✅ **Configuré** | `monitoring/docker-compose.monitoring.yml` |

---

## 9. 🔧 Ce qui reste à adapter pour l'environnement final

### Pour un déploiement Docker Compose complet
Dans `prometheus.yml`, remplacer `host.docker.internal:8080` par le **nom du service Docker** :
```yaml
targets: ['imed-backend:8080']
```
Et ajouter Prometheus et Grafana dans le même réseau Docker que le backend.

### Pour un déploiement Kubernetes (kubeadm)
Utiliser le **nom du Service Kubernetes** comme hostname :
```yaml
targets: ['imed-backend-service:8088']
```
Ou déployer Prometheus et Grafana via le chart Helm `kube-prometheus-stack` pour une intégration complète avec Kubernetes.

### Alertes
Configurer un Alertmanager pour envoyer des notifications (email, Slack) en cas de panne d'un service.

---

## 📌 Commandes de référence rapide

```bash
# Démarrer le monitoring
docker compose -f monitoring/docker-compose.monitoring.yml up -d

# Vérifier les conteneurs
docker ps

# Accéder à Prometheus
http://localhost:9090

# Accéder à Grafana
http://localhost:3000
# Login : admin / admin

# Arrêter le monitoring
docker compose -f monitoring/docker-compose.monitoring.yml down
```

---

*Documentation générée le 06 Mai 2026 — Projet Learnivo PIDEV 4SAE8 Esprit*
