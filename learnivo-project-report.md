# Learnivo Project Report - English Learning Platform

## Project Overview

Learnivo is a full-stack web application for an English learning platform with event management capabilities. It consists of:

- **Backend**: Spring Boot 3 (Java 17) with MySQL 8 database
- **Frontend**: Angular 17 with Tailwind CSS
- **Architecture**: RESTful API with Angular frontend consuming backend services

## Core Features

### 1. Backend Features (Spring Boot)
Located in `demo/` directory

#### **Entities & Services**
- **Students Management**: Create, read, update, delete students with email uniqueness validation
- **Events Management**: CRUD operations for events with filtering, sorting, and pagination
- **Event Registrations**: Students can register/unregister for events with status tracking
- **Clubs Management**: Club creation and membership management
- **Certificate Generation**: PDF certificate generation using OpenPDF library
- **Email Integration**: YouremailAPI integration for event creation notifications
- **Professors Management**: Professor profiles and management

#### **API Endpoints**
- `/api/students`: Student operations (including by-email lookup and next-event retrieval)
- `/api/events`: Event operations (with search, pagination, filtering)
- `/api/event-registrations`: Event registration management
- `/api/clubs`: Club management
- `/api/club-memberships`: Club membership management
- `/api/professors`: Professor management
- `/api/certificates`: Certificate generation

#### **Key Technologies**
- Spring Boot 3.5.10
- Spring Data JPA (with Hibernate)
- MySQL Connector/J
- OpenPDF for PDF generation
- Lombok for code simplification
- Jakarta Validation for input validation

### 2. Frontend Features (Angular)
Located in `frontoffice/frontoffice/` directory

#### **Pages & Components**
- **Home Page**: Hero section, companies, courses preview, mentors, testimonials, newsletter
- **Authentication**: Sign in and sign up pages
- **Account Page**: User profile management and event registrations
- **Events Page**: Event listing with CRUD operations (list, add, edit, delete)
- **Clubs Page**: Club listing with CRUD operations
- **Documentation Page**: Project documentation
- **404 Page**: Not found error handling

#### **Services**
- `StudentService`: Manages student operations and session management
- `EventService`: Event CRUD operations with error handling
- `ClubService`: Club management functionality

#### **Key Features**
- Responsive design with Tailwind CSS
- Session management using sessionStorage
- Event countdown timer
- Email notifications for event creation
- PDF certificate download
- Search and filtering capabilities
- Pagination for events and clubs
- Toast notifications for user feedback

## Technical Architecture

### Backend Architecture
```
com.learnivo.demo/
├── config/              (Configuration classes)
├── controller/          (REST endpoints)
├── dto/                 (Data Transfer Objects)
├── entity/              (JPA entities)
├── exception/           (Global exception handling)
├── repository/          (JPA repositories)
└── service/             (Business logic)
```

### Frontend Architecture
```
src/app/
├── components/          (Reusable UI components)
├── pages/              (Page components with routing)
├── services/           (API service layer)
├── types/              (TypeScript interfaces)
├── utils/              (Helper functions)
└── config/             (Configuration files)
```

## Configuration & Setup

### Backend Configuration
- **Port**: 8085 (configurable in `application.properties`)
- **Database**: MySQL 8 (localhost:3306/learnivo)
- **JPA**: Hibernate with auto-update schema
- **CORS**: Enabled for all origins

### Frontend Configuration
- **API Base URL**: `http://localhost:8085/api` (configurable in `api.config.ts`)
- **Session Storage**: Stores student ID, name, and popup preferences
- **Dependencies**: Angular 17, AOS (Animate on Scroll), Axios, Date-fns

## Potential Problems & Improvements

### 1. Security Issues
- **No Authentication/Authorization**: API endpoints are publicly accessible (CORS allows all origins)
- **Session Management**: Uses sessionStorage which is vulnerable to XSS attacks
- **No Input Sanitization**: Potential SQL injection risks
- **API Key Exposure**: YouremailAPI key is hardcoded in `application.properties`

### 2. Data Management
- **No Data Validation**: Limited validation on input fields
- **No Error Handling**: Minimal error handling for API failures
- **No Data Backup**: No backup strategy for the MySQL database

### 3. Performance
- **No Caching**: No caching mechanism for API responses
- **No Pagination**: Some endpoints return all data without pagination
- **Large Images**: SVG files in `public/images/` are very large (up to 2MB)

### 4. User Experience
- **No Loading States**: No feedback for API calls in progress
- **No Error Messages**: Generic error messages for all failures
- **No Responsive Design**: Some components may not be mobile-friendly

### 5. Code Quality
- **Hardcoded Values**: Multiple hardcoded values in services and components
- **Duplicate Code**: Potential code duplication between services
- **Lack of Tests**: No test files in frontend or backend

### 6. Architecture Improvements
- **No Logging**: Minimal logging configuration
- **No Monitoring**: No health check or monitoring endpoints
- **No Documentation**: API endpoints are not documented
- **No Versioning**: API versioning is not implemented

## Recommendations

### Immediate Fixes
1. Implement proper authentication (JWT/OAuth2)
2. Add authorization checks for API endpoints
3. Secure API keys and sensitive configuration
4. Implement input validation and sanitization
5. Add proper error handling and user feedback

### Medium-Term Improvements
1. Add unit and integration tests
2. Implement caching mechanism
3. Optimize large image files
4. Add responsive design improvements
5. Implement API documentation (Swagger)

### Long-Term Enhancements
1. Add data backup and recovery strategy
2. Implement monitoring and health checks
3. Add real-time features (WebSockets)
4. Improve search and filtering capabilities
5. Implement analytics and reporting features

## Conclusion

Learnivo is a functional English learning platform with event management capabilities. While the core features are implemented, the application has significant security, performance, and usability issues that need to be addressed before production deployment. The architecture is well-structured but lacks essential features like authentication, authorization, and proper error handling.
