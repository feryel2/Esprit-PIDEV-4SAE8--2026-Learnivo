# Backend Microservices

This backend now contains four Spring Boot modules:

- `course-service`: course CRUD, chapter content, filtering, status toggle, and analytics.
- `quiz-service`: quiz CRUD, question management, evaluation, status toggle, and analytics.
- `discovery-server`: Eureka service registry.
- `api-gateway`: gateway entry point for backend APIs.

## Run the platform

From `backend/`:

```powershell
./mvnw.cmd -pl discovery-server spring-boot:run
./mvnw.cmd -pl api-gateway spring-boot:run
./mvnw.cmd -pl course-service spring-boot:run
./mvnw.cmd -pl quiz-service spring-boot:run
```

Default ports:

- `discovery-server`: `8761`
- `api-gateway`: `8080`
- `course-service`: `8081`
- `quiz-service`: `8082`

Gateway routes:

- `http://localhost:8080/api/courses/**` -> `course-service`
- `http://localhost:8080/uploads/**` -> `course-service`
- `http://localhost:8080/api/quizzes/**` -> `quiz-service`

Both services use MySQL at runtime:

- `course-service` -> `course_service_db`
- `quiz-service` -> `quiz_service_db`

Default local credentials in the service properties:

- username: `root`
- password: empty

Tests still use H2 so `./mvnw.cmd test -q` works without MySQL.
