const { register, login } = require("../Controllers/UserController");
const router = require('express').Router();
const checkPermission = require("../Middleware/CheckPermission");
const auth = require('../Middleware/AuthMiddleware');


router.post('/register', auth, checkPermission("CreateUser"), register);
router.post('/login', login);

module.exports = router;
