const Permission = require('../models/PermissionSchema');

const getPermissionsByRole = async (req, res) => {
  try {
    const { roleId } = req.params;

    const permissions = await Permission.find({ roleID: roleId });

    if (permissions.length === 0) {
      return res.status(404).json({ message: 'No permissions found for the given role' });
    }

    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getPermissionsByRole
};