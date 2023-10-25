const express = require('express');
const router = express.Router();
const permissionController = require('../Controllers/PermissionController');

router.post('/', permissionController.createPermission);

//router.get('/', permissionController.getAllPermissions);

router.get('/:permissionId', permissionController.getPermissionById);

router.put('/:permissionId', permissionController.updatePermission);

router.delete('/:permissionId', permissionController.deletePermission);

module.exports = router;
