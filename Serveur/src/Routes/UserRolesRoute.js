const express = require('express');
const router = express.Router();
const UserRolesController = require('../Controllers/UserRolesController');

// route for get all user roles
router.get('/', UserRolesController.getUsersRoles);

module.exports = router;