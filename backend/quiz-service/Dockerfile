# syntax=docker/dockerfile:1
FROM maven:3.9.3-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy parent pom and all service pom.xmls
COPY pom.xml ./
COPY api-gateway/pom.xml ./api-gateway/pom.xml
COPY course-service/pom.xml ./course-service/pom.xml
COPY quiz-service/pom.xml ./quiz-service/pom.xml
COPY user-service/pom.xml ./user-service/pom.xml
COPY discovery-server/pom.xml ./discovery-server/pom.xml

# Copy source code
COPY quiz-service/src ./quiz-service/src

# Build with optimized caching
RUN mvn -B -f quiz-service/pom.xml -DskipTests clean package

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create non-root user
RUN useradd -m -u 1000 appuser
COPY --from=build /workspace/quiz-service/target/*.jar app.jar
RUN chown -R appuser:appuser /app

USER appuser
EXPOSE 8082
ENTRYPOINT ["java","-jar","/app/app.jar"]
