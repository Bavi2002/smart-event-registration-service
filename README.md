# Smart Event Management System - Registration Service

## 📖 Description
The **Registration Service** is responsible for handling event bookings, managing user registrations, validating event availability, preventing duplicate bookings, and communicating with other microservices such as Event Service and Notification Service.

It acts as the core booking engine of the Smart Event Management System.

---

## ⚙️ Tech Stack
- Node.js + Express
- MongoDB (Atlas)
- Docker
- AWS ECS (Fargate)
- AWS ECR
- GitHub Actions (CI/CD)
- SonarCloud (DevSecOps SAST)

---

## 🚀 Core Features
- Create event registrations (book tickets)
- Validate event availability before booking
- Prevent duplicate bookings
- Cancel bookings
- Fetch user bookings
- Fetch event participants
- Send booking confirmation via Notification Service

---

## 🔗 Inter-Service Communication

This service integrates with other microservices:

### 1. Event Service
- Endpoint: `GET /events/:id/availability`
- Purpose: Check available seats before booking

### 2. Event Details Fetch
- Endpoint: `GET /events/:id`
- Purpose: Get event title and details

### 3. Notification Service
- Purpose: Send booking confirmation email after successful registration

👉 Demonstrates REST-based microservice communication.

---

## 📡 API Documentation (Swagger / OpenAPI)

All endpoints are documented using OpenAPI 3.0.

See: `openapi.yaml`

### Endpoints
- `POST /registrations` → Create booking
- `GET /registrations/my-bookings` → Get user bookings
- `GET /registrations/event/{eventId}` → Get event participants
- `DELETE /registrations/{id}` → Cancel booking
- `GET /health` → Service health check

---

## 🔐 Security Implementation (DevSecOps)

- JWT authentication middleware
- Role-based access control
- Input validation (ticket count, eventId checks)
- Rate limiting for API protection
- SonarCloud static code analysis integration

---

## 🧪 Testing
- Jest + Supertest for API testing
- Mocked external services
- Covers:
  - Booking creation
  - Validation errors
  - Duplicate booking prevention
  - Cancellation flow

---

## 🐳 Dockerization
- Service containerized using Docker
- Ensures consistent environments
- Docker image pushed to AWS ECR

---

## ☁️ CI/CD Pipeline

### Flow
```text
GitHub Push → GitHub Actions → SonarCloud Scan → Build Docker Image → Push to ECR → Deploy to ECS