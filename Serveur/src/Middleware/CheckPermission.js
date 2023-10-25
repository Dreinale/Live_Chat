// checkPermission.js
const RolePermission = require('../Models/RolePermission/RolePermission');
const UserRole = require('../Models/User/userRole');

const checkPermission = (permissionRequired) => {
  return async (req, res, next) => {
    try {
      const userRoles = await UserRole.find({ userId: req.user.id }).populate('roleId');

      // console.log('User roles:', userRoles);

      const permissions = [];
      for (const userRole of userRoles) {
        const rolePermissions = await RolePermission.find({ roleId: userRole.roleId._id }).populate('permissionsId');

        for (const rolePermission of rolePermissions) {
          permissions.push(rolePermission.permissionsId.name);
        }
      }

      // console.log('Permissions premier :', permissions);

      if (!permissions.includes(permissionRequired)) {
        return res.status(403).json({ error: 'Permission insuffisante pour accéder à cette ressource.' });
      }

      // console.log('Permissions deuxième :', permissions);

      next();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Une erreur est survenue lors de la vérification des permissions.');
    }
  };
};

module.exports = checkPermission;
