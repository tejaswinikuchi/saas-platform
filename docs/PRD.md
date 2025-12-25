# Product Requirements Document (PRD)

## 1. User Personas

### 1.1 Super Admin
**Role Description:**  
System-level administrator responsible for managing all tenants in the platform.

**Key Responsibilities:**
- Manage all tenants
- Control subscription plans and limits
- Monitor system usage

**Main Goals:**
- Ensure platform stability
- Maintain security and compliance

**Pain Points:**
- Managing multiple tenants efficiently
- Monitoring system-wide activities

---

### 1.2 Tenant Admin
**Role Description:**  
Administrator of an individual organization (tenant).

**Key Responsibilities:**
- Manage users within the tenant
- Create and manage projects
- Assign tasks to users

**Main Goals:**
- Organize team work efficiently
- Track project progress

**Pain Points:**
- User and project limits based on subscription
- Ensuring data security

---

### 1.3 End User
**Role Description:**  
Regular team member within a tenant.

**Key Responsibilities:**
- View assigned projects and tasks
- Update task status

**Main Goals:**
- Complete assigned tasks on time
- Track personal workload

**Pain Points:**
- Limited permissions
- Dependency on admin for access

---

## 2. Functional Requirements

### Authentication & Tenant Management
- **FR-001:** The system shall allow tenant registration with a unique subdomain.
- **FR-002:** The system shall authenticate users using email, password, and tenant subdomain.
- **FR-003:** The system shall support JWT-based authentication with 24-hour expiry.
- **FR-004:** The system shall enforce role-based access control.
- **FR-005:** The system shall isolate tenant data using tenant_id.

### User Management
- **FR-006:** The system shall allow tenant admins to create users.
- **FR-007:** The system shall enforce subscription-based user limits.
- **FR-008:** The system shall allow updating and deleting users.
- **FR-009:** The system shall prevent duplicate emails within the same tenant.

### Project Management
- **FR-010:** The system shall allow creation of projects per tenant.
- **FR-011:** The system shall enforce project limits based on subscription.
- **FR-012:** The system shall allow updating and deleting projects.
- **FR-013:** The system shall allow users to view assigned projects.

### Task Management
- **FR-014:** The system shall allow creation of tasks within projects.
- **FR-015:** The system shall allow assigning tasks to users.
- **FR-016:** The system shall allow updating task status.
- **FR-017:** The system shall allow filtering tasks by status and priority.

---

## 3. Non-Functional Requirements

- **NFR-001 (Performance):** The system shall respond to API requests within 200ms for 90% of requests.
- **NFR-002 (Security):** All passwords shall be securely hashed.
- **NFR-003 (Scalability):** The system shall support at least 100 concurrent users.
- **NFR-004 (Availability):** The system shall maintain 99% uptime.
- **NFR-005 (Usability):** The frontend shall be responsive on desktop and mobile devices.
