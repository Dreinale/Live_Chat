// Importer le modèle d'utilisateur et le middleware d'authentification
const User = require('../Models/User/User');
const Role = require('../Models/Role/Role');
const UserRole = require('../Models/User/userRole');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateRegisterInput, validateUpdateInput } = require('../Validator/User');
const { UserNotFoundError, ValidationError, EmailNotFoundError, InvalidPasswordError, ServerError } = require('../Middleware/Errors/UserErrors');
const generateToken  = require('../Controllers/Token/TokenController');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Valider les données d'entrée
  const errors = validateRegisterInput(username, email, password);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    username,
    email,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();

    // Assign a default role to the new user
    const defaultRole = await Role.findOne({ name: 'user' });  // assuming 'user' is the default role
    if (!defaultRole) {
      return res.status(500).send('Default role not found');
    }

    const userRole = new UserRole({
      userId: savedUser._id,
      roleId: defaultRole._id
    });

    try {
      await userRole.save();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde de UserRole:", err);
      return res.status(500).send('Erreur lors de la sauvegarde de UserRole');
    }

    res.send(savedUser);
  } catch (err) {
    console.error("Erreur lors de la sauvegarde de User:", err);
    res.status(400).send(err);
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Get user role
    const userRole = await UserRole.findOne({ userId: user._id });

    // If userRole is not found, return an error
    if (!userRole) {
      return res.status(404).json({ error: "UserRole not found" });
    }

    const userRoles = await UserRole.find({ userId: user._id });

    const roles = [];

    for (const userRole of userRoles) {
      const role = await Role.findOne({ _id: userRole.roleId });
      if (role) {
        roles.push(role);
      }
    }

    console.log('Roles:', roles);

    // If role is not found, return an error
    if (!roles) {
      return res.status(404).json({ error: "Role not found" });
    }

    // Generate token using imported function
    const token = generateToken(user, roles);

    res.header('auth-token', token).send({ message: 'Connexion réussie!, Bienvenue ' + user.username + ' !', token: token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// Function to assign a role to a user
const assignRole = async (req, res) => {
    try {
        // Get user ID from request body
        const { userId } = req.body;

        // Get role ID from request body
        const { roleId } = req.body;

        // Check if user exists
        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
        return res.status(404).json({ error: "User not found" });
        }

        // Check if role exists
        const roleExists = await Role.exists({ _id: roleId });
        if (!roleExists) {
        return res.status(404).json({ error: "Role not found" });
        }

        // Check if userRole already exists
        const userRoleExists = await UserRole.exists({ userId: userId, roleId: roleId });
        if (userRoleExists) {
        return res.status(400).json({ error: "UserRole already exists" });
        }

        // Create new userRole
        const userRole = new UserRole({
        userId: userId,
        roleId: roleId
        });

        // Save userRole
        await userRole.save();

        res.send(userRole);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
}


// définir la méthode de récupération des utilisateurs
const getUsers = async (req, res) => {
  try {
    // Récupérer tous les utilisateurs de la base de données
    const users = await User.find();

    // Renvoyer une réponse 200 OK avec les utilisateurs
    res.status(200).json({ users });
  } catch (err) {
    console.error(err.message);
    res.status(ServerError.status).json({ msg: ServerError.message });
  }
};

// Définir la méthode de récupération de l'utilisateur
const getUser = async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur à partir du jeton d'authentification
    const userId = req.user._id;

    // Vérifier que l'utilisateur existe
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(UserNotFoundError.status).json({ msg: UserNotFoundError.message });
    }

    // Récupérer les informations de l'utilisateur
    const user = await User.findById(userId);

    // Renvoyer une réponse 200 OK avec les informations de l'utilisateur
    res.status(200).json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(ServerError.status).json({ msg: ServerError.message });
  }
};


// Update user
const updateUser = async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur à partir du jeton d'authentification
    const userId = req.user._id;

    // Vérifier que l'utilisateur existe
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).json({ msg: 'Utilisateur non trouvé.' });
    }

    // Récupérer les données mises à jour de l'utilisateur à partir du corps de la requête
    const { username, email, password } = req.body;

    // Valider les données d'entrée
    const errors = validateUpdateInput(username, email, password);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // Préparer les données de mise à jour
    const miseAJour = {
      username,
      email
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      miseAJour.password = await bcrypt.hash(password, salt);
    }

    // l'option new: true pour retourner le document mis à jour
    const options = { new: true };

    // Mettre à jour les informations de l'utilisateur et récupérer le document mis à jour
    const user = await User.findByIdAndUpdate(userId, miseAJour, options);
    if (!user) {
      return res.status(404).json({ msg: 'Utilisateur non trouvé.' });
    }

    // Convertir le document Mongoose en objet JavaScript et supprimer le champ 'password'
    const userObj = user.toObject();
    delete userObj.password;

    // Renvoyer une réponse 200 OK avec les informations mises à jour de l'utilisateur
    res.status(200).json({ userObj });
  } catch (err) {
    console.error(err.message);
    res.status(ServerError.status).send(ServerError.message);
  }
};


const deleteUser = async (req, res) => {
  try {
    // Récupérer l'id de l'utilisateur à partir du paramètre de la requête
    const userId = req.params.userId;

    // Vérifier que l'utilisateur existe dans la base de données
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
        return res.status(404).json({ msg: 'Utilisateur non trouvé.' });
    }


    // Supprimer l'utilisateur

    const user = await User.findByIdAndDelete(userId);

    // Renvoyer une réponse 200 OK avec les informations mises à jour de l'utilisateur
    res.status(200).json({ user });

  } catch (err) {
    console.error(err.message);
    res.status(ServerError.status).send(ServerError.message);
  }
};

module.exports = { login, register, assignRole, updateUser, deleteUser, getUser, getUsers };
