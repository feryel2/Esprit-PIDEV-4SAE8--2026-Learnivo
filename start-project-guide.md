# Learnivo Project - Startup Guide

## Prerequisites

Ensure you have the following installed:

1. **Java 17** (for backend)
2. **Node.js** (v16 or higher) and **npm** (for frontend)
3. **MySQL 8** (or compatible version)

## Step 1: Set up MySQL Database

### 1.1 Create Database
```sql
CREATE DATABASE IF NOT EXISTS learnivo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### 1.2 Optional: Create Dedicated User
```sql
CREATE USER 'learnivo'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON learnivo.* TO 'learnivo'@'localhost';
FLUSH PRIVILEGES;
```

## Step 2: Configure Backend

### 2.1 Update Database Credentials
Edit `demo/src/main/resources/application.properties`:

```properties
# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/learnivo?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

### 2.2 Start Backend Server
```bash
cd demo
./mvnw spring-boot:run
```

**Windows users**: Use `mvnw.cmd` instead of `./mvnw`

The backend will start on `http://localhost:8085`

### Verify Backend is Running
Test the API:
```bash
curl -X GET http://localhost:8085/api/events
```

## Step 3: Configure Frontend

### 3.1 Install Dependencies
```bash
cd frontoffice/frontoffice
npm install
```

### 3.2 Start Frontend Development Server
```bash
npm start
```

The frontend will start on `http://localhost:4200`

## Step 4: Access the Application

### Application URLs
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8085/api

### Key Pages
- **Home**: http://localhost:4200
- **Events List**: http://localhost:4200/events
- **Clubs List**: http://localhost:4200/clubs
- **Sign Up**: http://localhost:4200/signup
- **Sign In**: http://localhost:4200/signin

## Step 5: Test the Application

### 5.1 Test Sign Up
1. Go to http://localhost:4200/signup
2. Fill in name and email
3. Click "Sign Up"
4. Verify user is created in database

### 5.2 Test Events
1. Go to http://localhost:4200/events
2. Check if events are listed
3. Try adding a new event
4. Verify event is created

### 5.3 Test Registrations
1. Sign up or sign in
2. Go to events page
3. Register for an event
4. Check registration in account page

## Troubleshooting

### Common Issues

#### 1. MySQL Connection Error
**Problem**: Backend can't connect to MySQL  
**Solution**:
- Ensure MySQL server is running
- Verify credentials in `application.properties`
- Check if port 3306 is accessible

#### 2. Port Already in Use
**Problem**: Port 8085 or 4200 is already used  
**Solution**:
- For backend: Change port in `application.properties` and `api.config.ts`
- For frontend: Use `ng serve --port 4201`

#### 3. Frontend Can't Connect to Backend
**Problem**: Frontend shows "Le backend ne répond pas"  
**Solution**:
- Ensure backend is running on port 8085
- Check API_BASE_URL in `api.config.ts`
- Verify CORS settings

#### 4. Dependency Installation Failures
**Problem**: npm install fails  
**Solution**:
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version compatibility

## Additional Notes

### Database Initialization
- Tables are created automatically by JPA on first run
- Initial data is loaded from `schema.sql` and `data.sql`

### Development Mode
- Frontend uses hot-reload
- Backend uses Spring Boot dev tools

### Production Deployment
- Build frontend with `npm run build`
- Build backend with `mvn clean package`

## Project Structure Summary

```
Learnivo/
├── demo/                      # Spring Boot backend
│   └── src/main/
│       ├── java/com/learnivo/demo/
│       │   ├── controller/    # API endpoints
│       │   ├── service/       # Business logic
│       │   ├── entity/        # JPA entities
│       │   └── repository/    # Data access
│       └── resources/
│           ├── application.properties    # Configuration
│           └── schema.sql                # Database schema
└── frontoffice/frontoffice/   # Angular frontend
    └── src/app/
        ├── pages/            # Page components
        ├── components/       # Reusable components
        ├── services/         # API services
        └── config/           # Configuration
```
