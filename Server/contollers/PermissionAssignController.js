const Permission = require('../models/PermissionSchema');
const UserRole = require('../models/UserRoleSchema');

const assignPermission = async (req, res) => {
  try {
    const { userId, permissionId } = req.body;

    // Check if the permission exists
    const permission = await Permission.findById(permissionId);
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    // Check if the user already has the permission
    const existingUserRole = await UserRole.findOne({ userId, permissionId });
    if (existingUserRole) {
      return res.status(400).json({ message: 'User already has this permission' });
    }

    // Create a new user-role association
    const newUserRole = new UserRole({
      userId,
      permissionId
    });

    await newUserRole.save();

    res.status(201).json(newUserRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  assignPermission
};