@echo off
echo ============================================
echo  LEARNIVO MICROSERVICES - STARTUP ORDER
echo ============================================
echo.
echo Step 1: Start Eureka Server (port 8761)
echo Step 2: Start Learnivo Service (port 8081)
echo Step 3: Start API Gateway (port 8080)
echo.
echo Eureka Dashboard: http://localhost:8761
echo API Gateway:      http://localhost:8080
echo Direct Service:   http://localhost:8081
echo Swagger UI:       http://localhost:8081/swagger-ui.html
echo.
echo Starting Eureka Server...
start "Eureka Server" cmd /k "cd eureka-server && mvn spring-boot:run"
timeout /t 15 /nobreak
echo Starting Learnivo Certification Service...
start "Learnivo Service" cmd /k "cd demo && mvnw.cmd spring-boot:run"
timeout /t 20 /nobreak
echo Starting API Gateway...
start "API Gateway" cmd /k "cd api-gateway && mvn spring-boot:run"
echo.
echo All services started!
