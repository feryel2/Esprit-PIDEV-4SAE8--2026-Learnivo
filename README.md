# Learnivo

Learnivo is a microservices-based English school management and e-learning platform built for the Esprit PIDEV 4SAE 2025-2026 program.

The project combines:
- course management with chapter-by-chapter progression
- quiz management with weighted scoring and AI hints
- AI-powered course recommendations
- JWT authentication with role-based access
- API Gateway routing and Eureka service discovery

## Project Overview

Learnivo is organized around a modern microservices architecture:
- `backend/discovery-server`: Eureka registry
- `backend/api-gateway`: single entry point for frontend requests
- `backend/user-service`: authentication, JWT, roles, and seeded users
- `backend/course-service`: course CRUD, chapter progression, analytics, difficulty calculation, AI recommendations
- `backend/quiz-service`: quiz CRUD, weighted evaluation, publication workflow, hints, email payload
- `frontend`: Angular application for students and teachers

## Main Features

### Course Module
- course CRUD with chapters and sections
- chapter-by-chapter learner progression
- automatic course difficulty calculation
- analytics overview for course statistics
- AI-assisted course recommendations with a local fallback strategy

### Quiz Module
- quiz CRUD with multiple questions
- weighted scoring based on difficulty
- publication scheduling for learner availability
- AI-assisted hints with safe local fallback
- email summary payload after quiz submission

### Security
- JWT authentication across services
- role-based access for `STUDENT` and `TEACHER`
- protected teacher-only administration endpoints
- authenticated learner endpoints for hints, quiz attempts, and recommendations

### Architecture
- API Gateway as the unique frontend entry point
- Eureka-based service discovery
- OpenFeign communication between microservices
- Angular frontend connected through the gateway

## Technical Stack

### Frontend
- Angular 21
- TypeScript
- Tailwind CSS

### Backend
- Java 17
- Spring Boot 3
- Spring Security
- Spring Data JPA
- Spring Cloud Gateway
- Spring Cloud OpenFeign
- Spring Cloud Netflix Eureka
- H2 / MySQL

## Default Ports

- `8761`: discovery server
- `8080`: API Gateway
- `8081`: course-service
- `8082`: quiz-service
- `8083`: user-service
- `4200`: Angular frontend

## Demo Accounts

Seeded users:
- Student
  - email: `student@learnivo.local`
  - password: `student123`
- Teacher
  - email: `teacher@learnivo.local`
  - password: `teacher123`

## Prerequisites

Before running the project, make sure you have:
- Java 17
- Maven 3.9+
- Node.js 20+
- npm 10+

## How To Run

### Backend

From the `backend` folder, start the services in this order:

1. discovery server
2. user service
3. course service
4. quiz service
5. API Gateway

Commands:

```powershell
cd backend
mvn -q -pl discovery-server spring-boot:run
mvn -q -pl user-service spring-boot:run
mvn -q -pl course-service spring-boot:run
mvn -q -pl quiz-service spring-boot:run
mvn -q -pl api-gateway spring-boot:run
```

### Frontend

From the `frontend` folder:

```powershell
cd frontend
npm install
npm run start
```

The frontend uses the API Gateway at `http://localhost:8080`.

## Testing

### Backend Tests

```powershell
cd backend
mvn -q -pl course-service test
mvn -q -pl quiz-service test
mvn -q -pl api-gateway test
```

### Frontend Tests

```powershell
cd frontend
npm test -- --watch=false
```

### Frontend Production Build

```powershell
cd frontend
npm run build
```

## Architecture Notes

- the frontend communicates only with the API Gateway
- service discovery is handled by Eureka
- `course-service` communicates with `quiz-service` using OpenFeign
- security rules are enforced both at gateway level and service level
- learner progress is handled in Angular and reinforced by backend quiz and course APIs

## AI Features

### Quiz Hints
- endpoint: `POST /api/quizzes/{id}/hint`
- secured for authenticated `STUDENT` or `TEACHER`
- uses remote AI when configured
- falls back to local hint generation when AI is unavailable

### Course Recommendations
- endpoint: `POST /api/courses/recommendations/ai`
- secured for authenticated `STUDENT` or `TEACHER`
- uses remote AI ranking when configured
- falls back to local rule-based recommendation scoring

## Quality and Testing Highlights

- backend unit tests for business rules
- backend security tests for protected endpoints
- frontend service tests for authentication, recommendations, and learning progress
- dedicated microservices for modularity and maintainability

## Contributors

- Feryel Mansouri
- Hazem Ankoud
- Iyadh Cherni
- Mohamed Smida
- Imed Akrimi
