const jwt = require('jsonwebtoken');
require('dotenv').config();

const userAuth = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.APP_SECRET);

    // Set the user information in the req.user object
    req.user = {
      id: decoded.id,
      fullName: decoded.fullName,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: 'Failed to authenticate token' });
  }
};
const checkRoleAndPermission = (allowedRoles, allowedPermissions) => {
  return (req, res, next) => {
    // Check if the user's role is in the allowed roles
    if (req.user && allowedRoles.includes(req.user.role)) {
      // Check if the user has the required permissions
      if (allowedPermissions.every(permission => req.user.permissions.includes(permission))) {
        next();
      } else {
        return res.status(403).json({ message: 'Forbidden' });
      }
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }
  };
};
  
  module.exports = { userAuth, checkRoleAndPermission };