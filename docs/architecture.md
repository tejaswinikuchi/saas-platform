# System Architecture Document

## 1. High-Level System Architecture

The Multi-Tenant SaaS Platform follows a three-tier architecture consisting of a frontend client, backend API server, and a relational database. The system is designed to ensure scalability, security, and strict tenant data isolation.

### Architecture Overview

- **Client (Browser):** Users interact with the system through a web browser.
- **Frontend Application:** Built using React, responsible for UI rendering and user interactions.
- **Backend API Server:** Built using Node.js and Express.js, handles authentication, authorization, business logic, and database access.
- **Database:** PostgreSQL database storing tenant, user, project, task, and audit log data.
- **Authentication Flow:** JWT-based authentication ensures secure access to protected APIs.

### Request Flow

1. User sends request from browser to frontend.
2. Frontend sends API request to backend with JWT token.
3. Backend validates JWT and extracts user role and tenant_id.
4. Backend processes request and queries database with tenant isolation.
5. Response is sent back to frontend.

---

## 2. System Architecture Diagram

The system architecture diagram illustrates the interaction between frontend, backend, and database layers, including authentication flow.

**Diagram Location:**  
`docs/images/system-architecture.png`

---

## 3. Database Schema Design

The database schema is designed to support multi-tenancy with strict data isolation.

### Core Tables

- **tenants:** Stores organization details and subscription information.
- **users:** Stores user accounts linked to tenants.
- **projects:** Stores projects associated with tenants.
- **tasks:** Stores tasks linked to projects and tenants.
- **audit_logs:** Stores records of critical system actions.

Each tenant-specific table includes a `tenant_id` column to ensure isolation.

### ER Diagram

The Entity Relationship Diagram (ERD) shows relationships between tenants, users, projects, tasks, and audit logs.

**Diagram Location:**  
`docs/images/database-erd.png`

---

## 4. API Architecture

The backend exposes RESTful APIs organized by functional modules.

### Authentication APIs
- POST /api/auth/register-tenant
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/logout

### Tenant Management APIs
- GET /api/tenants/:tenantId
- PUT /api/tenants/:tenantId
- GET /api/tenants

### User Management APIs
- POST /api/tenants/:tenantId/users
- GET /api/tenants/:tenantId/users
- PUT /api/users/:userId
- DELETE /api/users/:userId

### Project Management APIs
- POST /api/projects
- GET /api/projects
- PUT /api/projects/:projectId
- DELETE /api/projects/:projectId

### Task Management APIs
- POST /api/projects/:projectId/tasks
- GET /api/projects/:projectId/tasks
- PATCH /api/tasks/:taskId/status
- PUT /api/tasks/:taskId
