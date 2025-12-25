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
7. Multi-Tenancy Design Analysis (Deep Dive)

Multi-tenancy is the core architectural principle of this SaaS platform. A multi-tenant system allows a single application instance to serve multiple independent organizations (tenants) while ensuring strict data isolation and security boundaries between them. The primary challenge in multi-tenant design is balancing isolation, scalability, cost efficiency, and operational simplicity.

This project adopts a shared database, shared schema multi-tenancy model. In this approach, all tenants share the same physical database and the same set of tables, but each record is associated with a specific tenant using a tenant_id. Application-level enforcement ensures that users can only access data belonging to their own tenant.

The main advantage of this model is cost efficiency. Maintaining separate databases for each tenant increases operational overhead, backup complexity, and infrastructure cost. A shared schema approach significantly reduces these costs while still enabling strong isolation through proper access control and query filtering.

Another key advantage is ease of maintenance and deployment. Schema changes, migrations, and updates can be applied once and immediately benefit all tenants. This simplifies DevOps workflows and reduces the risk of version drift between tenant environments.

However, this approach requires strict discipline at the application layer. Every query must correctly apply tenant filtering. In this system, tenant isolation is enforced through middleware that injects tenant_id into every authenticated request context, ensuring that all database queries include tenant validation.

8. Tenant Isolation Strategy

Tenant isolation in this platform is achieved using a combination of authentication, authorization, and database-level constraints. Each authenticated user carries a JWT token that includes both the user_id and the tenant_id. This token is verified for every protected API request.

Once authenticated, a tenant middleware extracts the tenant identifier and makes it available throughout the request lifecycle. All queries for tenant-specific data include explicit filtering on tenant_id. Any attempt to access resources belonging to a different tenant results in an authorization error.

Super administrators are treated as a special case. They do not belong to any tenant and therefore have tenant_id = NULL. Their permissions are explicitly restricted to system-level operations and do not allow cross-tenant data manipulation unless explicitly intended.

This strategy ensures logical isolation even though physical resources are shared. Combined with role-based access control, it provides strong guarantees that tenant data remains isolated and secure.

9. Role-Based Access Control (RBAC)

Role-Based Access Control is implemented to ensure that users can only perform actions appropriate to their responsibilities. The system defines three primary roles:

Super Admin: Manages system-level operations and oversees tenants.

Tenant Admin: Manages users, projects, and tasks within a specific tenant.

Regular User: Performs operational tasks such as viewing and updating assigned tasks.

RBAC rules are enforced at the API level using middleware that checks the user’s role before allowing access to sensitive endpoints. This prevents privilege escalation and ensures compliance with the principle of least privilege.

10. Technology Stack Justification

The technology stack for this project was selected to balance performance, developer productivity, scalability, and ecosystem maturity.

Node.js and Express.js were chosen for the backend due to their non-blocking I/O model, which is well-suited for API-driven SaaS platforms. Express provides a minimal and flexible framework that allows clear separation of concerns between routing, middleware, and business logic.

PostgreSQL was selected as the database due to its strong consistency guarantees, advanced indexing capabilities, and robust support for relational data. Its support for transactional integrity makes it ideal for multi-tenant systems where data correctness is critical.

React was chosen for the frontend due to its component-based architecture and widespread adoption. Even though the frontend in this project is minimal, React provides a scalable foundation for future UI expansion.

Docker and Docker Compose are used to ensure environment consistency, reproducibility, and simplified evaluation. Containerization eliminates environment-specific issues and enables the entire application stack to be started with a single command.

11. Security Considerations

Security is a first-class concern in this platform. All passwords are securely hashed using bcrypt before storage, preventing exposure of plaintext credentials. Authentication is handled using JSON Web Tokens (JWT), which provide a stateless and scalable authentication mechanism.

JWT tokens include an expiration time to reduce the risk of token misuse. All protected endpoints validate the token before processing the request. Sensitive operations require both authentication and appropriate authorization checks.

Input validation is applied at API boundaries to prevent malformed data and reduce the risk of injection attacks. Parameterized queries are used for all database interactions, protecting against SQL injection vulnerabilities.

Docker security best practices are also considered. Minimal base images are used, and sensitive configuration values are injected via environment variables rather than hardcoded into the application.

12. Scalability and Performance Considerations

The system is designed to scale horizontally. Because the application is stateless, multiple backend instances can be deployed behind a load balancer if needed. PostgreSQL can be scaled vertically or augmented with read replicas to handle increased read traffic.

Indexes on frequently queried columns such as tenant_id, user_id, and foreign keys improve query performance. Pagination can be introduced for list endpoints to handle large datasets efficiently.

The shared schema model allows onboarding new tenants without provisioning new infrastructure, making the platform highly scalable from an operational standpoint.

13. Trade-offs and Limitations

While the shared schema multi-tenancy model offers significant advantages, it also introduces trade-offs. A bug in tenant filtering logic could potentially expose data across tenants if not carefully handled. This risk is mitigated through strict middleware enforcement and thorough testing.

Another limitation is that noisy tenants could impact performance for others if resource usage is not monitored and controlled. This can be addressed in future iterations through rate limiting, query optimization, and tenant-level quotas.

Despite these trade-offs, the chosen architecture provides an excellent balance between simplicity, scalability, and security for a production-grade SaaS platform.

14. Future Enhancements

Future improvements to this platform could include advanced audit logging, fine-grained permission models, per-tenant customization, and integration with external identity providers. Monitoring, alerting, and observability tools could also be added to improve operational visibility.


