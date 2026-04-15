# Backend Microservices

This backend now contains four Spring Boot modules:

- `course-service`: course CRUD, chapter content, filtering, status toggle, and analytics.
- `quiz-service`: quiz CRUD, question management, evaluation, status toggle, and analytics.
- `discovery-server`: Eureka service registry.
- `api-gateway`: gateway entry point for backend APIs.
- `user-service`: role-based login for student and teacher access.

## Run the platform

From `backend/`:

```powershell
./mvnw.cmd -pl discovery-server spring-boot:run
./mvnw.cmd -pl api-gateway spring-boot:run
./mvnw.cmd -pl course-service spring-boot:run
./mvnw.cmd -pl quiz-service spring-boot:run
./mvnw.cmd -pl user-service spring-boot:run
```

Default ports:

- `discovery-server`: `8761`
- `api-gateway`: `8080`
- `course-service`: `8081`
- `quiz-service`: `8082`
- `user-service`: `8083`

Gateway routes:

- `http://localhost:8080/api/courses/**` -> `course-service`
- `http://localhost:8080/uploads/**` -> `course-service`
- `http://localhost:8080/api/quizzes/**` -> `quiz-service`
- `http://localhost:8080/api/auth/**` -> `user-service`
- `http://localhost:8080/api/users/**` -> `user-service`

OpenAPI / Swagger:

- `course-service` Swagger UI: `http://localhost:8081/swagger-ui/index.html`
- `quiz-service` Swagger UI: `http://localhost:8082/swagger-ui/index.html`
- `user-service` Swagger UI: `http://localhost:8083/swagger-ui/index.html`
- `course-service` OpenAPI JSON: `http://localhost:8081/v3/api-docs`
- `quiz-service` OpenAPI JSON: `http://localhost:8082/v3/api-docs`
- `user-service` OpenAPI JSON: `http://localhost:8083/v3/api-docs`

Recommended demo flow for evaluation:

- Login from `user-service` with `POST /api/auth/login`
- Browse or create courses from `course-service`
- Browse, publish, or evaluate quizzes from `quiz-service`
- Use Swagger UI on each service to inspect payloads and test endpoints live

Both services use MySQL at runtime:

- `course-service` -> `course_service_db`
- `quiz-service` -> `quiz_service_db`

Default local credentials in the service properties:

- username: `root`
- password: empty

Tests still use H2 so `./mvnw.cmd test -q` works without MySQL.

Demo users:

- `student@learnivo.local` / `student123`
- `teacher@learnivo.local` / `teacher123`
