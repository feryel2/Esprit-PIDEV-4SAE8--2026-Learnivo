# Backend Microservices

This backend now contains two Spring Boot microservices:

- `course-service`: course CRUD, chapter content, filtering, status toggle, and analytics.
- `quiz-service`: quiz CRUD, question management, evaluation, status toggle, and analytics.

## Run both services

From `backend/`:

```powershell
./mvnw.cmd -pl course-service spring-boot:run
./mvnw.cmd -pl quiz-service spring-boot:run
```

Default ports:

- `course-service`: `8081`
- `quiz-service`: `8082`

Both services use MySQL at runtime:

- `course-service` -> `course_service_db`
- `quiz-service` -> `quiz_service_db`

Default local credentials in the service properties:

- username: `root`
- password: empty

Tests still use H2 so `./mvnw.cmd test -q` works without MySQL.
