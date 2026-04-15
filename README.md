# Learnivo

Learnivo is a microservices-based English school management and e-learning platform built in the Esprit PIDEV 4SAE program for 2025-2026.

The project combines:
- course management with chapter-by-chapter progression
- quiz management with weighted scoring and AI hints
- AI-powered course recommendations
- role-based authentication for students and teachers
- API Gateway and Eureka-based service discovery

## Project Structure

### Backend services
- `backend/api-gateway`: single entry point for frontend requests
- `backend/discovery-server`: Eureka service registry
- `backend/user-service`: authentication, JWT, user roles
- `backend/course-service`: course CRUD, analytics, progress, AI recommendations
- `backend/quiz-service`: quiz CRUD, evaluation, AI hints

### Frontend
- `frontend`: Angular application for students and teachers

## Main Features

### Course module
- CRUD for courses and chapters
- progress tracking per course
- calculated difficulty score and label
- analytics overview
- AI-assisted course recommendations with local fallback

### Quiz module
- CRUD for quizzes
- weighted quiz evaluation
- quiz availability by publication date
- AI-assisted hints with safe local fallback
- email summary payload after submission

### Security
- JWT authentication
- role-based access for `STUDENT` and `TEACHER`
- protected teacher endpoints for administration
- learner-only authenticated actions for quiz attempts, quiz hints, and personalized recommendations

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

## Demo Accounts

The seeded users are:

- Student
  - email: `student@learnivo.local`
  - password: `student123`
- Teacher
  - email: `teacher@learnivo.local`
  - password: `teacher123`

## How To Run

### Backend

From the `backend` folder, run the services in this order:

1. discovery server
2. user service
3. course service
4. quiz service
5. api gateway

Example commands:

```powershell
mvn -q -pl discovery-server spring-boot:run
mvn -q -pl user-service spring-boot:run
mvn -q -pl course-service spring-boot:run
mvn -q -pl quiz-service spring-boot:run
mvn -q -pl api-gateway spring-boot:run
```

### Frontend

From the `frontend` folder:

```powershell
npm install
npm run start
```

## Testing

### Backend tests

```powershell
cd backend
mvn -q -pl course-service test
mvn -q -pl quiz-service test
mvn -q -pl api-gateway test
```

### Frontend tests

```powershell
cd frontend
npm test
```

### Frontend production build

```powershell
cd frontend
npm run build
```

## Architecture Notes

- the frontend calls services through the API Gateway on `http://localhost:8080`
- service discovery is handled by Eureka
- course-service communicates with quiz-service through OpenFeign
- learner progress is handled in the Angular frontend and reinforced by backend quiz/course APIs

## AI Features

### Quiz hints
- endpoint: `POST /api/quizzes/{id}/hint`
- secured for authenticated `STUDENT` or `TEACHER`
- uses remote AI when configured
- falls back to local hint generation if AI is unavailable

### Course recommendations
- endpoint: `POST /api/courses/recommendations/ai`
- secured for authenticated `STUDENT` or `TEACHER`
- uses remote AI ranking when configured
- falls back to local rule-based recommendation scoring

## Contributors

- Feryel Mansouri
- Hazem Ankoud
- Iyadh Cherni
- Mohamed Smida
- Imed Akrimi
