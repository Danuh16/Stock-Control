const jwt = require('jsonwebtoken');
require('dotenv').config();

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.APP_SECRET);

    // Fetch the user from the database
    const user = await User.findById(decoded.id).populate('role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach user information to the request object
    req.user = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role.module,
      permissions: user.permissions,
    };

    // Check if the user has the required permissions
    const requiredPermissions = req.body.permissions || req.query.permissions;
    if (requiredPermissions) {
      const hasPermissions = requiredPermissions.every((permission) =>
        user.permissions.includes(permission)
      );
      if (!hasPermissions) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: 'Failed to authenticate token' });
  }
};

module.exports = userAuth;