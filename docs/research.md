# Research Document – Multi-Tenant SaaS Platform

## 1. Multi-Tenancy Architecture Analysis

Multi-tenancy is a core concept in Software-as-a-Service (SaaS) platforms where a single application instance serves multiple organizations (tenants). Each tenant must have complete data isolation while sharing the same infrastructure.

### 1.1 Multi-Tenancy Approaches

| Approach | Description | Pros | Cons |
|--------|-------------|------|------|
| Shared Database + Shared Schema | All tenants share the same database and schema, separated using a tenant_id column | Cost-effective, easy to scale, simple deployment | Requires strict tenant isolation logic |
| Shared Database + Separate Schema | One database, but each tenant has its own schema | Better isolation than shared schema | Complex schema management, harder migrations |
| Separate Database per Tenant | Each tenant has its own database | Strong isolation and security | High infrastructure cost, poor scalability |

### 1.2 Chosen Approach and Justification

The chosen approach for this project is **Shared Database with Shared Schema using a tenant_id column**.  
This approach is widely used in modern SaaS applications because it provides a good balance between scalability, cost efficiency, and maintainability.

By storing all tenant data in the same schema and separating it using a tenant_id column, the system can support multiple organizations without requiring separate databases. This significantly reduces infrastructure cost and simplifies deployment and maintenance. Proper tenant isolation is enforced at the application level using middleware that automatically filters all queries by tenant_id obtained from the authenticated JWT token.

This approach also allows easier onboarding of new tenants and supports horizontal scaling as the number of tenants grows.

---

## 2. Technology Stack Justification

### 2.1 Backend Technologies

**Node.js** is used as the backend runtime due to its non-blocking, event-driven architecture, which makes it suitable for scalable APIs.  
**Express.js** is chosen as the web framework because it is lightweight, flexible, and widely adopted for building RESTful APIs.  
**JWT (JSON Web Tokens)** is used for stateless authentication, allowing secure and scalable user authentication without server-side session storage.  
**bcrypt** is used for password hashing to ensure secure storage of user credentials.

Alternative backend frameworks such as Django or Spring Boot were considered, but Node.js with Express provides faster development and better flexibility for API-based systems.

### 2.2 Frontend Technologies

**React** is chosen for frontend development due to its component-based architecture and efficient state management. It allows building reusable UI components and handling role-based rendering easily.  
HTML, CSS, and JavaScript are used alongside React to build responsive and interactive user interfaces.

Alternatives like Angular or Vue.js were considered, but React has a larger ecosystem and community support.

### 2.3 Database

**PostgreSQL** is selected as the database because it is a reliable, ACID-compliant relational database. It supports complex relationships, foreign keys, indexing, and transactions, which are essential for multi-tenant SaaS applications. PostgreSQL also performs well under concurrent workloads and supports scalability.

### 2.4 DevOps & Tooling

**Docker** and **Docker Compose** are used to containerize the application and ensure consistent environments across development and deployment.  
Docker allows packaging the backend, frontend, and database as isolated services, making deployment simple and repeatable.  
**Git** is used for version control to track changes and manage collaboration.

---

## 3. Security Considerations

### 3.1 Data Isolation Strategy

Data isolation is enforced using a tenant_id column in all tenant-specific tables. Every API request extracts the tenant_id from the JWT token and automatically filters database queries using this value. This ensures that users can access only their own tenant’s data.

### 3.2 Authentication & Authorization

The system uses JWT-based authentication with a 24-hour expiry. Role-Based Access Control (RBAC) is implemented to differentiate permissions between super_admin, tenant_admin, and regular users. Authorization checks are enforced at the API level.

### 3.3 Password Security

User passwords are never stored in plain text. All passwords are securely hashed using bcrypt with salt rounds before storing them in the database. During login, password hashes are compared using bcrypt’s secure comparison function.

### 3.4 API Security Measures

The system implements multiple security measures including:
- JWT token validation for all protected routes
- Role-based access control for sensitive APIs
- Input validation to prevent malformed requests
- Proper HTTP status codes for error handling
- Audit logging of critical actions such as user and project management

These measures help protect the application against unauthorized access and common security vulnerabilities.
