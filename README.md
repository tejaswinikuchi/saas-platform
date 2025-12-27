# Multi-Tenant SaaS Platform

##  Project Overview
This project is a **Dockerized Multi-Tenant SaaS Platform** designed to demonstrate backend system design, authentication, authorization, and tenant isolation.

A single application instance serves multiple organizations (tenants) while ensuring strict data isolation using a **shared database + shared schema** approach.

The platform supports:
- User management
- Project management
- Task management
- Role-based access control (RBAC)

---

##  Technology Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React (minimal frontend for verification)

### DevOps
- Docker
- Docker Compose

---

##  Architecture Summary
- **Multi-tenancy model:** Shared database + shared schema
- **Tenant isolation:** Enforced using `tenant_id` at the application level
- **Authentication:** JWT-based stateless authentication
- **Authorization:** Role-Based Access Control (RBAC)
- **Services:** Frontend, Backend API, PostgreSQL Database

---

##  Setup & Run Instructions

### Prerequisites
- Docker
- Docker Compose

### Run the application
```bash
docker-compose up -d
This command starts all services automatically:

PostgreSQL database

Backend API

Frontend application

No manual setup is required.

## Verify Services
Backend Health Check
http://localhost:5000/api/health

Frontend Application
http://localhost:3000

## Test Credentials

These credentials are pre-seeded automatically and are also documented in submission.json.

Super Admin
Email: superadmin@system.com
Password: Super@123

Tenant Admin
Email: admin@demo.com
Password: Demo@123
Tenant Subdomain: demo

Regular User
Email: user1@demo.com
Password: User@123
Tenant Subdomain: demo

##  API Documentation

Complete API documentation is available at:

docs/API.md


The platform exposes 19 secured REST APIs, including authentication, user management, project management, and task management.

## Key API Endpoints
Authentication

POST /api/auth/register-tenant

POST /api/auth/login

GET /api/auth/me

Users

POST /api/tenants/:tenantId/users

GET /api/tenants/:tenantId/users

PUT /api/users/:userId

DELETE /api/users/:userId

Projects

POST /api/projects

GET /api/projects

PUT /api/projects/:projectId

DELETE /api/projects/:projectId

Tasks

POST /api/projects/:projectId/tasks

GET /api/projects/:projectId/tasks

PUT /api/tasks/:taskId

PATCH /api/tasks/:taskId/status

##  Docker Services
Service	Description	Port
database	PostgreSQL Database	5432
backend	Node.js Backend API	5000
frontend	React Frontend	3000

## Demo Video

A demo video (5–12 minutes) showcasing:

Architecture walkthrough

Tenant registration

Login & RBAC

Project & task management

Multi-tenancy isolation

YouTube Link: https://youtu.be/331JyVfmztY

##  Project Status

All services start using docker-compose up -d

Database migrations run automatically

Seed data loads automatically

Authentication & RBAC verified

Frontend accessible and functional

## Author

This project was developed as part of a technical task to demonstrate multi-tenant backend architecture, authentication & authorization, and Docker-based deployment.


---

