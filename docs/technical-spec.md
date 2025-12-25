# Technical Specification Document

## 1. Project Structure

### Backend Structure

backend/
├── src/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── models/
│ ├── services/
│ ├── utils/
│ └── config/
├── migrations/
├── seeds/
├── tests/
├── Dockerfile
└── package.json


**Description:**
- controllers: Handles request and response logic
- routes: Defines API endpoints
- middleware: Authentication, authorization, and tenant isolation
- models: Database interaction logic
- services: Business logic and audit logging
- utils: Utility functions
- config: Database and environment configuration

---

### Frontend Structure

frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── context/
│ ├── hooks/
│ └── utils/
├── public/
├── Dockerfile
└── package.json

**Description:**
- components: Reusable UI components
- pages: Application pages (Login, Dashboard, Projects, Users)
- services: API integration logic
- context: Authentication and global state
- hooks: Custom React hooks
- utils: Helper functions

---

## 2. Development Setup Guide

### Prerequisites
- Node.js (v18 or above)
- Docker & Docker Compose
- Git

---

### Environment Variables

The following environment variables are required for the backend:

- DB_HOST
- DB_PORT
- DB_NAME
- DB_USER
- DB_PASSWORD
- JWT_SECRET
- JWT_EXPIRES_IN
- PORT
- FRONTEND_URL

All environment variables are defined in `.env` or `docker-compose.yml`.

---

### Local Development Setup

1. Clone the repository
2. Install backend dependencies
3. Install frontend dependencies
4. Configure environment variables
5. Run backend and frontend servers

---

### Docker Setup

The application is fully containerized using Docker.

To start all services:
docker-compose up -d

This command starts:
- PostgreSQL database
- Backend API server
- Frontend application

---

### Testing

- Backend APIs can be tested using Postman or Swagger
- Frontend functionality can be tested via browser
- Authentication and authorization flows should be verified using test credentials


