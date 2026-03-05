#learnivo _ English School Management Application
# Overview

This project was developed as part of the PIDEV – 4th Year Engineering Program at **Esprit School of Engineering** (Academic Year 2025–2026).

Learnivo is a microservices-based e-learning platform that allows  instructors, and administrators to manage courses, quizzes, classes, progress tracking, clubs, events, internships, and support complaints requests efficiently while students can access courses ,take quizzes and classes.

## Features
- user Management
- Course Management
- Quiz Management
-Events Management
- Clubs Management
- competition Management
- class Management
- internship Management
- support complaints Management
  
# Tech Stack

### Frontend
- Angular
- HTML5 / CSS3

### Backend
- Spring Boot v21
- MySQL
- JPA / Hibernate
- Spring Cloud Netflix Eureka (Service Discovery)  
- Spring Cloud Gateway (API Gateway) 

## Academic Context
Developed at **Esprit School of Engineering – Tunisia**
PIDEV – 4SAE | 2025–2026

## Contributors

- Feryel Mansouri
- hazem ankoud
- iyadh cherni
- mohamed smida
- imed akrimi

## Architecture
Learnivo is built on a **microservices architecture** with **API Gateway** and **Eureka service discovery** for better scalability and modularity.

### Tools 
- Git & GitHub  
- Postman (API testing) 
## Getting Started

### Backend
mvn spring-boot:run

### Frontend
npm install
ng serve

###Microservices Mode (local, without Docker)
Run each service with Maven:

backend/course-service on port 8081
backend/quiz-service on port 8082
backend/service-registry on port 8761
