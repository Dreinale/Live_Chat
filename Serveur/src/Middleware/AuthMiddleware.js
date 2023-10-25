const jwt = require('jsonwebtoken');
const UserRole = require('../Models/User/userRole');
const Role = require('../Models/Role/Role');

require('dotenv').config();

const auth = async (req, res, next) => {
  const token = req.header('auth-token');

  if (!token) {
    return res.status(401).send('Accès refusé. Aucun token fourni.');
  }

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    const userRole = await UserRole.findOne({ userId: decodedToken.userId });

    if (!userRole) {
      return res.status(404).send("Rôle d'utilisateur non trouvé.");
    }

    // Find role by roleId
    const role = await Role.findById(userRole.roleId);
    if (!role) {
      return res.status(404).send("Rôle non trouvé.");
    }

    // Store user role and user id in req object for further usage
    req.user = {
      id: decodedToken.userId,
      roleId: userRole.roleId,
      role: role.name, // Optionally, store the role name as well
    };

    next();
  } catch (err) {
    res.status(400).send('Token invalide.');
  }
};

module.exports = auth;
