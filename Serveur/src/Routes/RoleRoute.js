const express = require('express');
const router = express.Router();
const roleController = require('../Controllers/RoleController');


// route for creating a role
router.post('/', roleController.createRole);

// route for getting all roles
//router.get('/', roleController.getAllRoles);

// route for getting role by id
router.get('/:roleId', roleController.getRoleById);

// route for updating role
router.put('/:roleId', roleController.updateRole);

// route for deleting role
router.delete('/:roleId', roleController.deleteRole);


module.exports = router;