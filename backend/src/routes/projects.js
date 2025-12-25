const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const tenant = require('../middleware/tenant');

const router = express.Router();

/**
 * API 12: Create Project
 * POST /api/projects
 */
router.post('/projects', auth, tenant, async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Project name is required'
    });
  }

  try {
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM projects WHERE tenant_id = $1',
      [req.tenantId]
    );

    const tenantResult = await pool.query(
      'SELECT max_projects FROM tenants WHERE id = $1',
      [req.tenantId]
    );

    if (parseInt(countResult.rows[0].count) >= tenantResult.rows[0].max_projects) {
      return res.status(403).json({
        success: false,
        message: 'Project limit reached'
      });
    }

    const projectId = uuidv4();

    await pool.query(
      `INSERT INTO projects (id, tenant_id, name, description, created_by)
       VALUES ($1, $2, $3, $4, $5)`,
      [projectId, req.tenantId, name, description, req.user.userId]
    );

    return res.status(201).json({
      success: true,
      data: {
        id: projectId,
        tenantId: req.tenantId,
        name,
        description
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create project'
    });
  }
});

/**
 * API 13: List Projects
 * GET /api/projects
 */
router.get('/projects', auth, tenant, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.name, p.description, p.status, p.created_at,
              u.full_name AS created_by
       FROM projects p
       LEFT JOIN users u ON p.created_by = u.id
       WHERE p.tenant_id = $1
       ORDER BY p.created_at DESC`,
      [req.tenantId]
    );

    return res.json({
      success: true,
      data: {
        projects: result.rows,
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
});

/**
 * API 14: Update Project
 * PUT /api/projects/:projectId
 */
router.put('/projects/:projectId', auth, tenant, async (req, res) => {
  const { name, description, status } = req.body;

  try {
    const projectResult = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND tenant_id = $2',
      [req.params.projectId, req.tenantId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const project = projectResult.rows[0];

    if (req.user.role !== 'tenant_admin' && req.user.userId !== project.created_by) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update project'
      });
    }

    await pool.query(
      `UPDATE projects SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [name, description, status, project.id]
    );

    return res.json({
      success: true,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
});

/**
 * API 15: Delete Project
 * DELETE /api/projects/:projectId
 */
router.delete('/projects/:projectId', auth, tenant, async (req, res) => {
  try {
    const projectResult = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND tenant_id = $2',
      [req.params.projectId, req.tenantId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const project = projectResult.rows[0];

    if (req.user.role !== 'tenant_admin' && req.user.userId !== project.created_by) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete project'
      });
    }

    await pool.query(
      'DELETE FROM projects WHERE id = $1',
      [project.id]
    );

    return res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete project'
    });
  }
});

module.exports = router;
