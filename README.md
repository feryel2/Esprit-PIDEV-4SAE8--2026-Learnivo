# IMED Platform Monorepo

This repository contains a full-stack IMED platform composed of:
- an Angular frontend (`TEMPLATE-PI-main`)
- a Spring Boot backend (`imed-backend`)
- a Spring Cloud Gateway (`api-gateway`)
- a Eureka service registry (`eurika-server`)

The platform covers public content (trainings, clubs, events, competitions), internship workflows, certificate workflows, and an admin area.

## Architecture Overview

- Frontend runs on `http://localhost:4200`
- Main backend runs on `http://localhost:8080`
- API Gateway runs on `http://localhost:8087`
- Eureka server runs on `http://localhost:8761`
- MySQL is used by `imed-backend` (database name defaults to `imed_db`)

Current frontend services call the backend directly on `http://localhost:8080/api`.  
The gateway is configured to route `/api/**` to `imed-backend` via Eureka (`lb://imed-backend`).

## Repository Structure

```text
imed1/
├─ TEMPLATE-PI-main/   # Angular 21 frontend (UI + admin)
├─ imed-backend/       # Spring Boot REST API + file uploads + SSE chat
├─ api-gateway/        # Spring Cloud Gateway
└─ eurika-server/      # Eureka discovery server
```

## Tech Stack

- Frontend: Angular 21, TypeScript, Tailwind CSS, RxJS, jsPDF
- Backend: Java 17, Spring Boot 3.5, Spring Data JPA, Validation
- Infra: Spring Cloud 2025, Eureka, Spring Cloud Gateway
- Database: MySQL
- Build tools: npm, Maven Wrapper (`mvnw` / `mvnw.cmd`)

## Main Features

- Public pages for trainings, chapters, clubs, events, competitions, classes, internships, and certificates
- Admin pages for managing trainings, clubs, events, competitions, classes, internships, and certificates
- Internship domain:
  - internships
  - internship offers
  - internship applications
  - internship documents
  - internship evaluations
- File upload endpoints for internship CVs and internship PDFs (20MB max, PDF only)
- Certificate domain:
  - certificates
  - certificate verifications
  - certification rules
- Real-time chat stream using Server-Sent Events (SSE)

## Backend API Summary

Base URL: `http://localhost:8080/api`

- `/internships` (CRUD)
- `/internship-offers` (CRUD)
- `/internship-applications` (CRUD + `POST /upload-cv`)
- `/internship-documents` (CRUD + `POST /upload-pdf`)
- `/internship-evaluations` (CRUD)
- `/certificates` (CRUD)
- `/certificate-verifications` (CRUD)
- `/certification-rules` (CRUD)
- `/chat/rooms/{roomId}/messages` (GET/POST)
- `/chat/rooms/{roomId}/stream` (SSE stream)

Uploaded files are served from:
- `http://localhost:8080/uploads/internship-cv/...`
- `http://localhost:8080/uploads/internship-documents/...`

## Prerequisites

- Node.js + npm (project uses npm 11 in frontend metadata)
- Java 17
- MySQL 8+

## Environment Variables

`imed-backend` supports the following variables:

- `DB_URL` (default: `jdbc:mysql://localhost:3306/imed_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`)
- `DB_USERNAME` (default: `root`)
- `DB_PASSWORD` (default: empty)
- `EUREKA_SERVER_URL` (default: `http://localhost:8761/eureka/`)

`api-gateway` supports:

- `EUREKA_SERVER_URL` (default: `http://localhost:8761/eureka/`)

## Run the Project Locally

Use four terminals and start services in this order.

### 1) Start Eureka Server

```bash
cd eurika-server
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
cd eurika-server
.\mvnw.cmd spring-boot:run
```

### 2) Start IMED Backend

```bash
cd imed-backend
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
cd imed-backend
.\mvnw.cmd spring-boot:run
```

### 3) Start API Gateway

```bash
cd api-gateway
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
cd api-gateway
.\mvnw.cmd spring-boot:run
```

### 4) Start Angular Frontend

```bash
cd TEMPLATE-PI-main
npm install
npm start
```

`npm start` runs a Tailwind pre-step and then starts Angular dev server.

## Build and Test Commands

### Frontend

```bash
cd TEMPLATE-PI-main
npm run build
npm test
```

### Backend Services

```bash
cd imed-backend
./mvnw test

cd ../api-gateway
./mvnw test

cd ../eurika-server
./mvnw test
```

Windows PowerShell equivalents:

```powershell
.\mvnw.cmd test
```

## Notes

- The folder is named `eurika-server` in this repository, while the Spring application name is `eureka-server`.
- CORS is currently configured for `http://localhost:4200`.
- Backend JPA setting is `spring.jpa.hibernate.ddl-auto=update`, so schema changes are auto-applied on startup.
