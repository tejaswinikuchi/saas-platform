const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const auth = require('../middleware/auth');
const tenant = require('../middleware/tenant');
const role = require('../middleware/role');

const router = express.Router();

/**
 * API 8: Add User to Tenant
 * POST /api/tenants/:tenantId/users
 */
router.post('/tenants/:tenantId/users',
  auth,
  tenant,
  role(['tenant_admin']),
  async (req, res) => {
    const { email, password, fullName, role: userRole = 'user' } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (req.user.tenantId !== req.params.tenantId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized tenant access'
      });
    }

    try {
      const countResult = await pool.query(
        'SELECT COUNT(*) FROM users WHERE tenant_id = $1',
        [req.user.tenantId]
      );

      const tenantResult = await pool.query(
        'SELECT max_users FROM tenants WHERE id = $1',
        [req.user.tenantId]
      );

      if (parseInt(countResult.rows[0].count) >= tenantResult.rows[0].max_users) {
        return res.status(403).json({
          success: false,
          message: 'Subscription user limit reached'
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const userId = uuidv4();

      await pool.query(
        `INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, req.user.tenantId, email, passwordHash, fullName, userRole]
      );

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          id: userId,
          email,
          fullName,
          role: userRole,
          tenantId: req.user.tenantId
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create user'
      });
    }
  }
);

/**
 * API 9: List Tenant Users
 * GET /api/tenants/:tenantId/users
 */
router.get('/tenants/:tenantId/users',
  auth,
  tenant,
  async (req, res) => {
    if (req.user.role !== 'super_admin' && req.user.tenantId !== req.params.tenantId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    try {
      const result = await pool.query(
        `SELECT id, email, full_name, role, is_active, created_at
         FROM users WHERE tenant_id = $1
         ORDER BY created_at DESC`,
        [req.params.tenantId]
      );

      return res.json({
        success: true,
        data: {
          users: result.rows,
          total: result.rows.length
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch users'
      });
    }
  }
);

/**
 * API 10: Update User
 * PUT /api/users/:userId
 */
router.put('/users/:userId',
  auth,
  tenant,
  async (req, res) => {
    const { fullName, role: newRole, isActive } = req.body;

    try {
      const userResult = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [req.params.userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const targetUser = userResult.rows[0];

      if (req.user.role !== 'tenant_admin' && req.user.userId !== targetUser.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }

      await pool.query(
        `UPDATE users SET
          full_name = COALESCE($1, full_name),
          role = COALESCE($2, role),
          is_active = COALESCE($3, is_active),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $4`,
        [fullName, newRole, isActive, targetUser.id]
      );

      return res.json({
        success: true,
        message: 'User updated successfully'
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update user'
      });
    }
  }
);

/**
 * API 11: Delete User
 * DELETE /api/users/:userId
 */
router.delete('/users/:userId',
  auth,
  tenant,
  role(['tenant_admin']),
  async (req, res) => {
    if (req.user.userId === req.params.userId) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete yourself'
      });
    }

    try {
      await pool.query(
        'UPDATE tasks SET assigned_to = NULL WHERE assigned_to = $1',
        [req.params.userId]
      );

      await pool.query(
        'DELETE FROM users WHERE id = $1 AND tenant_id = $2',
        [req.params.userId, req.user.tenantId]
      );

      return res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete user'
      });
    }
  }
);

module.exports = router;
