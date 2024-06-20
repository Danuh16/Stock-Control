const checkRoleAndPermission = (allowedRoles, allowedPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { role, permissions } = req.user;

    // Check if the user's role is allowed
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if the user has all required permissions
    if (!allowedPermissions.every(permission => permissions.includes(permission))) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

module.exports = checkRoleAndPermission;
