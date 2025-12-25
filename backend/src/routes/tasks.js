const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const tenant = require('../middleware/tenant');

const router = express.Router();

/**
 * API 16: Create Task
 * POST /api/projects/:projectId/tasks
 */
router.post('/projects/:projectId/tasks', auth, tenant, async (req, res) => {
  const { title, description, assignedTo, priority = 'medium', dueDate } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Task title is required'
    });
  }

  try {
    const projectResult = await pool.query(
      'SELECT id, tenant_id FROM projects WHERE id = $1',
      [req.params.projectId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const project = projectResult.rows[0];

    if (project.tenant_id !== req.tenantId) {
      return res.status(403).json({
        success: false,
        message: 'Project does not belong to your tenant'
      });
    }

    if (assignedTo) {
      const userCheck = await pool.query(
        'SELECT id FROM users WHERE id = $1 AND tenant_id = $2',
        [assignedTo, req.tenantId]
      );

      if (userCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Assigned user does not belong to tenant'
        });
      }
    }

    const taskId = uuidv4();

    await pool.query(
      `INSERT INTO tasks
       (id, project_id, tenant_id, title, description, priority, assigned_to, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        taskId,
        project.id,
        project.tenant_id,
        title,
        description,
        priority,
        assignedTo || null,
        dueDate || null
      ]
    );

    return res.status(201).json({
      success: true,
      data: {
        id: taskId,
        projectId: project.id,
        tenantId: project.tenant_id,
        title,
        description,
        priority,
        assignedTo,
        dueDate
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create task'
    });
  }
});

/**
 * API 17: List Project Tasks
 * GET /api/projects/:projectId/tasks
 */
router.get('/projects/:projectId/tasks', auth, tenant, async (req, res) => {
  try {
    const projectResult = await pool.query(
      'SELECT id, tenant_id FROM projects WHERE id = $1',
      [req.params.projectId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (projectResult.rows[0].tenant_id !== req.tenantId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    const result = await pool.query(
      `SELECT t.id, t.title, t.description, t.status, t.priority, t.due_date,
              u.id AS assigned_user_id, u.full_name AS assigned_user_name
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.project_id = $1
       ORDER BY t.priority DESC, t.due_date ASC`,
      [req.params.projectId]
    );

    return res.json({
      success: true,
      data: {
        tasks: result.rows,
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
});

/**
 * API 18: Update Task Status
 * PATCH /api/tasks/:taskId/status
 */
router.patch('/tasks/:taskId/status', auth, tenant, async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Status is required'
    });
  }

  try {
    const result = await pool.query(
      'SELECT id, tenant_id FROM tasks WHERE id = $1',
      [req.params.taskId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (result.rows[0].tenant_id !== req.tenantId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    await pool.query(
      'UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [status, req.params.taskId]
    );

    return res.json({
      success: true,
      message: 'Task status updated'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update task status'
    });
  }
});

/**
 * API 19: Update Task
 * PUT /api/tasks/:taskId
 */
router.put('/tasks/:taskId', auth, tenant, async (req, res) => {
  const { title, description, status, priority, assignedTo, dueDate } = req.body;

  try {
    const taskResult = await pool.query(
      'SELECT id, tenant_id FROM tasks WHERE id = $1',
      [req.params.taskId]
    );

    if (taskResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (taskResult.rows[0].tenant_id !== req.tenantId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    if (assignedTo) {
      const userCheck = await pool.query(
        'SELECT id FROM users WHERE id = $1 AND tenant_id = $2',
        [assignedTo, req.tenantId]
      );

      if (userCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Assigned user does not belong to tenant'
        });
      }
    }

    await pool.query(
      `UPDATE tasks SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        priority = COALESCE($4, priority),
        assigned_to = $5,
        due_date = $6,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $7`,
      [
        title,
        description,
        status,
        priority,
        assignedTo || null,
        dueDate || null,
        req.params.taskId
      ]
    );

    return res.json({
      success: true,
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update task'
    });
  }
});

module.exports = router;
