module.exports = (req, res, next) => {
  // Super admin can access all tenants
  if (req.user.role === 'super_admin') {
    return next();
  }

  // Tenant ID must exist for non-super-admin users
  if (!req.user.tenantId) {
    return res.status(403).json({
      success: false,
      message: 'Tenant access denied'
    });
  }

  req.tenantId = req.user.tenantId;
  next();
};
