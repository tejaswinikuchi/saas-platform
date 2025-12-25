# API Documentation – Multi-Tenant SaaS Platform

This document describes all REST API endpoints exposed by the backend service.  
All endpoints (except health check and login) require JWT authentication.

Base URL (Docker):
http://localhost:5000/api


---

## 🔐 Authentication & Authorization

### 1. Register Tenant
**POST** `/auth/register-tenant`

Creates a new tenant and a tenant admin.

**Request Body**
```json
{
  "tenantName": "Acme Corp",
  "subdomain": "acme",
  "adminEmail": "admin@acme.com",
  "adminPassword": "Admin@123",
  "adminFullName": "Acme Admin"
}
}
Response

json
Copy code
{
  "success": true,
  "message": "Tenant registered successfully"
}
2. Login

POST /auth/login

Authenticates a user and returns JWT token.

Request Body

{
  "email": "admin@demo.com",
  "password": "Demo@123",
  "tenantSubdomain": "demo"
}


Response

{
  "success": true,
  "data": {
    "token": "<JWT_TOKEN>",
    "expiresIn": 86400
  }
}

3. Get Current User

GET /auth/me

Headers

Authorization: Bearer <JWT_TOKEN>


Response

{
  "success": true,
  "data": {
    "email": "admin@demo.com",
    "role": "tenant_admin",
    "tenant": {
      "subdomain": "demo"
    }
  }
}

👥 User Management
4. Create User

POST /tenants/:tenantId/users

Tenant admin only.

Request Body

{
  "email": "user@demo.com",
  "password": "User@123",
  "fullName": "Demo User",
  "role": "user"
}

5. List Users

GET /tenants/:tenantId/users

Returns all users in a tenant.

6. Update User

PUT /users/:userId

Updates user details.

7. Delete User

DELETE /users/:userId

Deletes a user.

📁 Project Management
8. Create Project

POST /projects

Request Body

{
  "name": "Project Alpha",
  "description": "Sample project"
}

9. List Projects

GET /projects

10. Update Project

PUT /projects/:projectId

11. Delete Project

DELETE /projects/:projectId

📝 Task Management
12. Create Task

POST /projects/:projectId/tasks

Request Body

{
  "title": "Design DB",
  "priority": "high"
}

13. List Tasks

GET /projects/:projectId/tasks

14. Update Task

PUT /tasks/:taskId

15. Update Task Status

PATCH /tasks/:taskId/status

❤️ Health Check
16. Health Check

GET /health

Returns backend and database status.

🔒 Security Notes

JWT-based authentication

Role-Based Access Control (RBAC)

Tenant data isolation enforced at API level

Passwords hashed using bcrypt

📌 Notes

All APIs return JSON

Proper HTTP status codes are used

Unauthorized access returns 401 or 403


---

