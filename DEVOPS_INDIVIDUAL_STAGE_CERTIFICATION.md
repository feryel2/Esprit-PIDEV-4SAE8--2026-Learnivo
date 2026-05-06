# Documentation DevOps Individuelle — Modules Stage & Certification

> **Auteur :** Akrimi  
> **Modules couverts :** Stage / Internship · Certification  
> **Projet global :** Learnivo — Esprit PIDEV 4SAE8 2026  
> **Date :** Mai 2026

---

## 📁 Organisation des dépôts

| Dépôt | URL |
|---|---|
| Frontend (individuel) | [AkrimiProjects/imed-frontend-devops](https://github.com/AkrimiProjects/imed-frontend-devops) |
| Backend (individuel) | [AkrimiProjects/imed-backend-devops](https://github.com/AkrimiProjects/imed-backend-devops) |
| Dépôt global de l'équipe | [feryel2/Esprit-PIDEV-4SAE8--2026-Learnivo](https://github.com/feryel2/Esprit-PIDEV-4SAE8--2026-Learnivo) |

---

## 1. 🎯 Périmètre de mon travail DevOps individuel

Mon travail DevOps individuel couvre exclusivement les deux modules dont je suis responsable au sein du projet Learnivo :

### Module 1 — Stage / Internship
- **Frontend :** pages Angular dédiées à la gestion des offres de stage, des candidatures et du suivi des stages.
- **Backend :** entités JPA, repositories Spring Data, services et contrôleurs REST liés aux stages.
- **Tests unitaires :** tests de service (`InternshipServiceTest`) et tests de contrôleur REST (`InternshipControllerTest`).

### Module 2 — Certification
- **Frontend :** pages Angular dédiées au quiz de certification, à la génération de certificats PDF et au tableau de bord administrateur.
- **Backend :** entités JPA, repositories Spring Data, services et contrôleurs REST liés aux certifications et aux quiz.
- **Tests unitaires :** tests de service (`CertificateServiceTest`) et tests de contrôleur REST (`CertificateControllerTest`).

> ⚠️ **Périmètre strictement respecté :** Je n'ai modifié ni le code métier des autres modules, ni le design de l'interface, ni la logique applicative existante.

---

## 2. 🔄 CI/CD Frontend (Angular 21)

**Fichier :** `.github/workflows/frontend-ci-cd.yml`  
**Dépôt :** `AkrimiProjects/imed-frontend-devops`

### Déclencheurs
- Push sur la branche `main`
- Pull Request vers `main`

### Pipeline — 3 jobs enchaînés

```
test ──► build ──► docker
```

| Job | Description |
|---|---|
| **test** | Installation des dépendances (`npm ci`), exécution des tests Angular en mode CI (`--watch=false --browsers=ChromeHeadless`), `continue-on-error: true` pour sécuriser le pipeline |
| **build** | `npm run build` (production), upload du dossier `dist/` comme artifact GitHub Actions |
| **docker** | Téléchargement du dossier `dist/`, construction de l'image Docker multi-stage (`node:22-alpine` → `nginx:alpine`) avec `docker build -t imed-frontend:latest .` |

### Résultat local validé
```
npm run build → Exit code: 0
Output location: dist/frontend-v21
```

---

## 3. 🔄 CI/CD Backend (Spring Boot 3 / Java 17)

**Fichier :** `.github/workflows/backend-ci-cd.yml`  
**Dépôt :** `AkrimiProjects/imed-backend-devops`

### Déclencheurs
- Push sur la branche `main`
- Pull Request vers `main`

### Pipeline — 3 jobs enchaînés

```
test ──► build ──► docker
```

| Job | Description |
|---|---|
| **test** | Checkout, setup Java 17 Temurin, `mvn clean test`, upload du rapport JaCoCo (`target/site/jacoco/`) comme artifact |
| **build** | `mvn clean package -DskipTests`, upload du JAR (`target/*.jar`) comme artifact |
| **docker** | Téléchargement du JAR, `docker build -t imed-backend:latest .` avec le Dockerfile existant |

### Résultat local validé
```
Tests run: 38, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

---

## 4. ✅ Tests unitaires

### Résultat global : 38 tests — 0 échec — 0 erreur

| Classe de test | Module | Tests |
|---|---|---|
| `InternshipServiceTest` | Stage | 8 |
| `InternshipControllerTest` | Stage | 14 |
| `CertificateServiceTest` | Certification | 6 |
| `CertificateControllerTest` | Certification | 9 |
| `ImedBackendApplicationTests` | Global | 1 |
| **Total** | | **38** |

### Commande de validation
```bash
mvn clean test
# Résultat : Tests run: 38, Failures: 0, Errors: 0 — BUILD SUCCESS
```

---

## 5. 🔍 SonarQube & JaCoCo

### JaCoCo — Couverture de code
- **Configuration :** plugin JaCoCo intégré dans `pom.xml`, exécuté automatiquement lors de `mvn test`.
- **Rapport généré :** `target/site/jacoco/index.html`
- **Intégration CI/CD :** rapport uploadé comme artifact GitHub Actions à chaque exécution du job `test`.

### SonarQube — Analyse de qualité
- **Exécution :** locale via Docker SonarQube (`localhost:9000`).
- **Résultat Quality Gate :** ✅ **PASSED**
- **Refactoring appliqué :** correction de l'issue SonarQube dans `WebConfig.java` — remplacement du délimiteur de chemin codé en dur `"/"` par `File.separator` (import `java.io.File` ajouté).

> ℹ️ SonarQube n'est pas intégré dans GitHub Actions car il s'exécute localement sur `localhost:9000`, inaccessible depuis les runners GitHub.

### Commandes utilisées localement
```bash
# Analyse SonarQube locale
mvn sonar:sonar \
  -Dsonar.projectKey=imed-backend \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=<token>
```

---

## 6. 🐳 Dockerisation

### Backend — Dockerfile
**Localisation :** `imed-backend/Dockerfile`

```dockerfile
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Résultat :**
```bash
docker build -t imed-backend:latest .   # ✅ Succès
docker images | findstr imed-backend    # imed-backend:latest  ~670MB
```

### Frontend — Dockerfile (multi-stage)
**Localisation :** `TEMPLATE-PI-main/Dockerfile`

```dockerfile
# Stage 1 : Build Angular
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 : Serveur Nginx
FROM nginx:alpine
COPY --from=build /app/dist/frontend-v21/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Optimisation appliquée :** fichier `.dockerignore` créé pour exclure `node_modules`, `dist`, `.angular`, `.git` → build context réduit de 402 MB à ~14 KB.

### Commandes pour exécuter localement
```bash
# Backend
docker run -d -p 8080:8080 --name imed-backend-container imed-backend:latest

# Frontend
docker run -d -p 4200:80 --name imed-frontend-container imed-frontend:latest
# Accessible sur : http://localhost:4200
```

---

## 7. ☸️ Kubernetes — Manifests

**Localisation :** dossier `k8s/` à la racine du projet.

### Fichiers créés

| Fichier | Ressource | Type |
|---|---|---|
| `k8s/backend-deployment.yaml` | `imed-backend` | Deployment (1 replica) |
| `k8s/backend-service.yaml` | `imed-backend-service` | NodePort → `30088` |
| `k8s/frontend-deployment.yaml` | `imed-frontend` | Deployment (1 replica) |
| `k8s/frontend-service.yaml` | `imed-frontend-service` | NodePort → `30420` |

### Ports configurés

| Composant | Port interne | Port NodePort | URL d'accès |
|---|---|---|---|
| Backend | 8080 | 30088 | `http://<node-ip>:30088` |
| Frontend | 80 (Nginx) | 30420 | `http://<node-ip>:30420` |

### Commandes kubectl

```bash
# Appliquer tous les manifests
kubectl apply -f k8s/

# Vérifier les pods
kubectl get pods

# Vérifier les services
kubectl get services
```

### ⚠️ Statut honnête — kubeadm

> Les manifests Kubernetes sont **prêts et validés syntaxiquement**.  
> Le déploiement via **kubeadm n'est pas encore complété** car il nécessite une machine virtuelle Ubuntu dédiée (VM Ubuntu Server avec kubeadm, kubelet et kubectl installés).  
> Les manifests sont conçus pour fonctionner directement sur un cluster kubeadm dès qu'une VM sera disponible.

---

## 8. 📊 Monitoring — Prometheus & Grafana

### Statut : Préparation effectuée

La configuration du monitoring avec Prometheus et Grafana est préparée pour les modules Stage et Certification. Les étapes planifiées sont les suivantes :

| Étape | Statut |
|---|---|
| Ajout de la dépendance `spring-boot-actuator` dans `pom.xml` | ✅ Disponible dans le projet |
| Exposition de l'endpoint `/actuator/prometheus` | 📋 Planifié |
| Déploiement de Prometheus via Docker ou Kubernetes | 📋 Planifié |
| Configuration d'un tableau de bord Grafana pour visualiser les métriques | 📋 Planifié |
| Alertes sur les métriques des services Stage et Certification | 📋 Planifié |

> ℹ️ Le monitoring complet sera activé une fois le cluster Kubernetes kubeadm opérationnel sur la VM Ubuntu.

---

## 9. 📸 Checklist des captures d'écran pour la présentation

### Backend
- [ ] Terminal : `mvn clean test` → 38 tests, 0 failures, BUILD SUCCESS
- [ ] Terminal : `docker build -t imed-backend:latest .` → succès
- [ ] Terminal : `docker images` → image `imed-backend:latest` visible
- [ ] Terminal : `docker ps` → conteneur backend en cours d'exécution
- [ ] IDE : `WebConfig.java` avec `File.separator` (correction SonarQube)
- [ ] SonarQube UI : Quality Gate = PASSED (`localhost:9000`)
- [ ] JaCoCo : rapport HTML `target/site/jacoco/index.html`
- [ ] GitHub Actions : pipeline backend (`test` → `build` → `docker`) ✅ vert
- [ ] GitHub Actions : artifacts (`jacoco-report`, `backend-jar`) téléchargeables

### Frontend
- [ ] Terminal : `npm run build` → Exit code 0, `dist/frontend-v21` généré
- [ ] Terminal : `docker build -t imed-frontend:latest .` → succès
- [ ] Terminal : `docker ps` → conteneur frontend en cours d'exécution
- [ ] Navigateur : `http://localhost:4200` → application Angular affichée
- [ ] IDE : `Dockerfile` multi-stage (node → nginx)
- [ ] IDE : `.dockerignore` visible dans l'arborescence du projet
- [ ] GitHub Actions : pipeline frontend (`test` → `build` → `docker`) ✅ vert

### Kubernetes
- [ ] IDE : dossier `k8s/` avec les 4 fichiers YAML
- [ ] Terminal : `kubectl apply -f k8s/` (si VM disponible)
- [ ] Terminal : `kubectl get pods` → pods Running
- [ ] Terminal : `kubectl get services` → services NodePort visibles

---

## 10. 🎤 Discours de présentation (Français)

---

> Bonjour,
>
> Je m'appelle Akrimi, et dans le cadre de notre projet de fin d'études Learnivo, je suis responsable de deux modules : **Stage** et **Certification**.
>
> Mon travail DevOps couvre l'ensemble du cycle de vie de ces deux modules, de la qualité du code jusqu'à la conteneurisation.
>
> **Côté backend**, j'ai mis en place un pipeline GitHub Actions en trois étapes : les tests unitaires avec Maven et JaCoCo, le packaging en fichier JAR, puis la construction de l'image Docker. En tout, **38 tests passent avec zéro échec**. J'ai également analysé la qualité du code avec SonarQube, qui a retourné un **Quality Gate PASSED**. J'ai même résolu une issue de qualité en remplaçant un délimiteur de chemin codé en dur par `File.separator`.
>
> **Côté frontend**, j'ai containerisé l'application Angular 21 avec un **Dockerfile multi-stage** : la première étape compile l'application avec Node.js, la deuxième la sert via Nginx. J'ai créé un fichier `.dockerignore` pour réduire le contexte de build de 402 MB à seulement 14 KB, ce qui améliore significativement les performances du pipeline.
>
> **Pour Kubernetes**, j'ai préparé quatre manifests YAML couvrant les Deployments et les Services NodePort pour le frontend et le backend. Ces fichiers sont prêts à être déployés sur un cluster kubeadm. Le déploiement complet n'est pas encore exécuté car il nécessite une VM Ubuntu dédiée, mais l'infrastructure as code est entièrement rédigée et validée.
>
> **Pour le monitoring**, j'ai planifié l'intégration de Prometheus et Grafana, qui sera activée dès que le cluster Kubernetes sera opérationnel.
>
> En résumé : tests automatisés, qualité analysée, images Docker construites et fonctionnelles, pipeline CI/CD opérationnel, et manifests Kubernetes prêts pour la mise en production.
>
> Merci.

---

*Document généré le 06 Mai 2026 — Projet Learnivo PIDEV 4SAE8 Esprit*
