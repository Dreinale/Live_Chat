// Route for user related operations
const express = require('express');
const router = express.Router();
const userController = require('../Controllers/UserController');

// route for assigning a role to a user
router.post('/assignRole', userController.assignRole);

//route for getting all users
router.get('/getAllUsers', userController.getUsers);

//route for getting user profile by id
router.get('/', userController.getUser);

// route for updating user profile
router.put('/', userController.updateUser);

//route for deleting user profile
router.delete('/:userId', userController.deleteUser);

// route for user logout
//router.post('/logout', userController.logout);


module.exports = router;
