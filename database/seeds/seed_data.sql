-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================
-- SUPER ADMIN
-- ================================
INSERT INTO users (
    id, tenant_id, email, password_hash, full_name, role, is_active
) VALUES (
    uuid_generate_v4(),
    NULL,
    'superadmin@system.com',
    '$2b$10$VhE0Zz1kZtFf6u7Yq5F3eO9u1Y0ZxR9H9W0nR7B5M6PqC7XQ0J7aW',
    'System Super Admin',
    'super_admin',
    true
);

-- ================================
-- TENANT: DEMO COMPANY
-- ================================
INSERT INTO tenants (
    id, name, subdomain, status, subscription_plan, max_users, max_projects
) VALUES (
    uuid_generate_v4(),
    'Demo Company',
    'demo',
    'active',
    'pro',
    25,
    15
);

-- ================================
-- TENANT ADMIN
-- ================================
INSERT INTO users (
    id, tenant_id, email, password_hash, full_name, role, is_active
)
SELECT
    uuid_generate_v4(),
    t.id,
    'admin@demo.com',
    '$2b$10$9p2q4m6dYkEw9c7Nn5R8WeZ8qG0R9HkZP3Ew5ZB7sM2XQy3Bq',
    'Demo Admin',
    'tenant_admin',
    true
FROM tenants t WHERE t.subdomain = 'demo';

-- ================================
-- REGULAR USERS
-- ================================
INSERT INTO users (
    id, tenant_id, email, password_hash, full_name, role
)
SELECT uuid_generate_v4(), t.id, 'user1@demo.com',
'$2b$10$Qz9ZC3Y4wA2Yp4P5M6sD9UeH3YtXwP5B2k7V0QF0N8R9L3a',
'Demo User One', 'user'
FROM tenants t WHERE t.subdomain = 'demo';

INSERT INTO users (
    id, tenant_id, email, password_hash, full_name, role
)
SELECT uuid_generate_v4(), t.id, 'user2@demo.com',
'$2b$10$Qz9ZC3Y4wA2Yp4P5M6sD9UeH3YtXwP5B2k7V0QF0N8R9L3a',
'Demo User Two', 'user'
FROM tenants t WHERE t.subdomain = 'demo';

-- ================================
-- PROJECTS
-- ================================
INSERT INTO projects (
    id, tenant_id, name, description, created_by
)
SELECT uuid_generate_v4(), t.id, 'Project Alpha', 'First demo project', u.id
FROM tenants t, users u
WHERE t.subdomain = 'demo' AND u.email = 'admin@demo.com';

INSERT INTO projects (
    id, tenant_id, name, description, created_by
)
SELECT uuid_generate_v4(), t.id, 'Project Beta', 'Second demo project', u.id
FROM tenants t, users u
WHERE t.subdomain = 'demo' AND u.email = 'admin@demo.com';

-- ================================
-- TASKS
-- ================================
INSERT INTO tasks (
    id, project_id, tenant_id, title, priority, status
)
SELECT uuid_generate_v4(), p.id, p.tenant_id,
'Setup project structure', 'high', 'completed'
FROM projects p WHERE p.name = 'Project Alpha';

INSERT INTO tasks (
    id, project_id, tenant_id, title, priority
)
SELECT uuid_generate_v4(), p.id, p.tenant_id,
'Design database schema', 'medium'
FROM projects p WHERE p.name = 'Project Alpha';

INSERT INTO tasks (
    id, project_id, tenant_id, title, priority
)
SELECT uuid_generate_v4(), p.id, p.tenant_id,
'Implement authentication', 'high'
FROM projects p WHERE p.name = 'Project Beta';
