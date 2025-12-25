# Multi-Tenant SaaS Platform

## 📌 Project Overview
This project is a Dockerized Multi-Tenant SaaS Platform designed to demonstrate backend system design, authentication, authorization, and tenant isolation.  
A single application instance serves multiple organizations (tenants) while ensuring strict data isolation using a shared database and shared schema approach.

The platform supports user management, project management, task management, and role-based access control.

---

## 🛠️ Technology Stack

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

## 🏗️ Architecture Summary
- **Multi-tenancy model:** Shared database + shared schema
- **Tenant isolation:** Enforced using `tenant_id` at the application level
- **Authentication:** JWT-based stateless authentication
- **Authorization:** Role-Based Access Control (RBAC)
- **Services:** Frontend, Backend API, PostgreSQL Database

---

## 🚀 Setup & Run Instructions

### Prerequisites
- Docker
- Docker Compose

###
Verify Services

Backend Health Check:
http://localhost:5000/api/health

Frontend Application:
http://localhost:3000

🔐 Test Credentials
Super Admin

Email: superadmin@system.com

Password: Admin@123

Tenant Admin

Email: admin@demo.com

Password: Demo@123

Tenant Subdomain: demo

Regular User

Email: user1@demo.com

Password: User@123

Tenant Subdomain: demo

📚 API Features
Authentication

Register Tenant

Login

Get Current User

User Management

Create User

List Users

Update User

Delete User

Project Management

Create Project

List Projects

Update Project

Delete Project

Task Management

Create Task

List Tasks

Update Task

Update Task Status

---> Docker Services

database: PostgreSQL (port 5432)

backend: Node.js API (port 5000)

frontend: React app (port 3000)

 Project Status

All services are running successfully using Docker Compose.
Backend, database, and frontend have been verified and are operational.

 Author

This project was developed as part of a technical task to demonstrate backend development, multi-tenancy design, and Docker-based deployment.


---

##  Step 3: Save the file
