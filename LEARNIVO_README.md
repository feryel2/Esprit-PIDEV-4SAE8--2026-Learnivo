# Learnivo - English Learning Platform

This project contains a **backend** (Spring Boot, MySQL) and a **frontend** (Angular) for the Learnivo platform. Event management is integrated and the UI is in English.

## Prerequisites

- **Java 17** (backend)
- **Node.js** and **npm** (frontend)
- **MySQL 8** (or compatible)

## 1. MySQL Database

Create the database and user (optional):

```sql
CREATE DATABASE IF NOT EXISTS learnivo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Optional: create a dedicated user
-- CREATE USER 'learnivo'@'localhost' IDENTIFIED BY 'your_password';
-- GRANT ALL PRIVILEGES ON learnivo.* TO 'learnivo'@'localhost';
-- FLUSH PRIVILEGES;
```

Then set in `demo/src/main/resources/application.properties`:

- `spring.datasource.url` – JDBC URL (default: `jdbc:mysql://localhost:3306/learnivo?...`)
- `spring.datasource.username` – your MySQL user (e.g. `root`)
- `spring.datasource.password` – your MySQL password

Tables (e.g. `events`) are created automatically by JPA on first run.

## 2. Backend (demo)

```bash
cd demo
./mvnw spring-boot:run
```

API base: `http://localhost:8080`  
Events API: `http://localhost:8080/api/events`

## 3. Frontend (lite-version)

```bash
cd lite-version
npm install
npm start
```

Open: `http://localhost:4200`

- **Dashboard**: `/dashboard/default`
- **Events**: `/events` (list, add, edit, delete)

## 4. Configuration

- **Backend**: `demo/src/main/resources/application.properties` (MySQL URL, user, password).
- **Frontend API URL**:  
  - Dev: `lite-version/src/environments/environment.ts` → `apiUrl: 'http://localhost:8080/api'`  
  - Prod: `environment.prod.ts` → set `apiUrl` to your backend base + `/api`.

## Summary

| Item        | Location / Value                          |
|------------|--------------------------------------------|
| Backend    | `demo/` – Spring Boot 3, MySQL, JPA        |
| Frontend   | `lite-version/` – Angular 9, Learnivo UI   |
| Events API | `GET/POST/PUT/DELETE /api/events`          |
| Platform   | Learnivo – English language                |
