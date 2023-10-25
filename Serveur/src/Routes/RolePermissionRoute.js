const express = require('express');
const router = express.Router();
const rolePermissionController = require('../Controllers/RolePermissionController');


// route for creating a rolePermission
router.post('/', rolePermissionController.createRolePermission);

// route for getting all rolePermissions
//router.get('/', rolePermissionController.getAllRolePermissions);

// route for getting rolePermission by id
router.get('/:rolePermissionId', rolePermissionController.getRolePermissionById);

// route for updating rolePermission
router.put('/:rolePermissionId', rolePermissionController.updateRolePermission);

// route for deleting rolePermission
router.delete('/:rolePermissionId', rolePermissionController.deleteRolePermission);


module.exports = router;