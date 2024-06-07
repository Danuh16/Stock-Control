const checkRoleAndPermission = (allowedRoles, allowedPermissions) => {
  return async (req, res, next) => {
    try {
      // Retrieve the user from the database
      const { fullName } = req.body;
      const user = await User.findOne({ fullName });

      // Check if the user's role is in the allowed roles
      if (allowedRoles.includes(user.role)) {
        // Check if the user has the required permissions
        if (allowedPermissions.every(permission => user.permissions.includes(permission))) {
          next();
        } else {
          return res.status(403).json({ message: 'Forbidden' });
        }
      } else {
        return res.status(403).json({ message: 'Forbidden' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = { checkRoleAndPermission };
