# LEARNIVO API ENDPOINTS - QUICK REFERENCE

## Base URL
```
http://localhost:8080
```

## Swagger Documentation
```
http://localhost:8080/swagger-ui.html
http://localhost:8080/v3/api-docs
```

---

## ENDPOINTS BY RESOURCE

### Internships
```
GET    /api/internships              # Get all internships
GET    /api/internships/{id}         # Get internship
POST   /api/internships              # Create internship
PUT    /api/internships/{id}         # Update internship
DELETE /api/internships/{id}         # Delete internship
```

### Internship Offers (with pagination & search)
```
GET    /api/offers?page=0&size=10&q=search&status=OPEN&sort=deadline,asc
GET    /api/offers/{id}
POST   /api/offers
PUT    /api/offers/{id}
DELETE /api/offers/{id}
```

### Internship Applications
```
GET    /api/applications
GET    /api/applications/{id}
POST   /api/applications
PUT    /api/applications/{id}
DELETE /api/applications/{id}
PUT    /api/applications/{id}/status
```

### Internship Documents
```
GET    /api/documents
GET    /api/documents/{id}
POST   /api/documents
PUT    /api/documents/{id}
DELETE /api/documents/{id}
```

### Internship Evaluations
```
GET    /api/evaluations
GET    /api/evaluations/{id}
POST   /api/evaluations
PUT    /api/evaluations/{id}
DELETE /api/evaluations/{id}
```

### Certificates
```
GET    /api/certificates
GET    /api/certificates/{id}
POST   /api/certificates
PUT    /api/certificates/{id}
DELETE /api/certificates/{id}
```

### Certificate Verifications
```
GET    /api/certificate-verifications
GET    /api/certificate-verifications/{id}
POST   /api/certificate-verifications
PUT    /api/certificate-verifications/{id}
DELETE /api/certificate-verifications/{id}
```

### Certification Rules
```
GET    /api/certification-rules
GET    /api/certification-rules/{id}
POST   /api/certification-rules
PUT    /api/certification-rules/{id}
DELETE /api/certification-rules/{id}
```

### Events
```
GET    /api/events
GET    /api/events/{id}
POST   /api/events
PUT    /api/events/{id}
DELETE /api/events/{id}
```

---

## QUERY PARAMETERS

### Pagination (all list endpoints)
```
page=0          # Page number (0-indexed)
size=10         # Items per page
sort=field,asc  # Sort by field (asc/desc)
sort=field,desc
```

### Offer Search (GET /api/offers)
```
q=developer     # Search title & company
status=OPEN     # Filter by OfferStatus (OPEN, CLOSED, PAUSED)
```

### Status Update (Offers)
```
OfferStatus: OPEN, CLOSED, PAUSED
```

---

## HTTP STATUS CODES

```
200 OK              # Successful GET/PUT
201 CREATED         # Successful POST
204 NO CONTENT      # Successful DELETE
400 BAD REQUEST     # Validation error
404 NOT FOUND       # Resource not found
500 SERVER ERROR    # Server error
```

---

## REQUEST/RESPONSE FORMATS

### InternshipOfferRequest (POST/PUT)
```json
{
  "title": "Senior Developer",
  "company": "TechCorp",
  "location": "Remote",
  "deadline": "2026-12-31",
  "status": "OPEN"
}
```

### InternshipRequest (POST/PUT)
```json
{
  "startDate": "2026-03-01",
  "endDate": "2026-05-31",
  "objectives": "Learn and build projects",
  "status": "IN_PROGRESS",
  "tutorName": "Jane Smith",
  "applicationId": 1
}
```

### Error Response (400/404/500)
```json
{
  "timestamp": "2026-03-03T21:44:50.123+01:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Request validation failed",
  "details": [
    "title: must not be blank",
    "company: must not be blank"
  ]
}
```

### Pagination Response
```json
{
  "content": [
    {
      "id": 1,
      "title": "Java Developer",
      "company": "TechCorp",
      "location": "Remote",
      "deadline": "2026-12-31",
      "status": "OPEN"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "unsorted": false
    }
  },
  "totalElements": 42,
  "totalPages": 5,
  "number": 0,
  "size": 10,
  "empty": false,
  "first": true,
  "last": false
}
```

---

## COMMON CURL EXAMPLES

### List with search and pagination
```bash
curl "http://localhost:8080/api/offers?page=0&size=10&q=java&status=OPEN&sort=deadline,asc"
```

### Create resource
```bash
curl -X POST http://localhost:8080/api/offers \
  -H "Content-Type: application/json" \
  -d '{"title":"Dev","company":"Corp","location":"Remote","deadline":"2026-12-31","status":"OPEN"}'
```

### Get single resource
```bash
curl http://localhost:8080/api/offers/1
```

### Update resource
```bash
curl -X PUT http://localhost:8080/api/offers/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","company":"Corp","location":"NY","deadline":"2026-12-31","status":"OPEN"}'
```

### Delete resource
```bash
curl -X DELETE http://localhost:8080/api/offers/1
```

---

**Generated:** March 3, 2026  
**API Version:** 1.0  
**Status:** Production Ready
