const UserRole = require('../Models/User/userRole');
const Role = require('../Models/Role/Role');
const User = require('../Models/User/User');

const getUsersRoles = async (req, res) => {
    try {
        // aller dans la table UserRole et récupérer tous les userRoles
        const userRoles = await UserRole.find();

        // vérifier si des userRoles existent
        if (!userRoles) {
            return res.status(404).json({ error: "userRoles not found" });
        }

        // créer un objet vide pour stocker les utilisateurs et leurs rôles
        const usersWithRoles = {};

        // boucle sur tous les userRoles
        for (let i = 0; i < userRoles.length; i++) {
            // récupérer le userRole actuel
            const userRole = userRoles[i];

            // récupérer le rôle de l'utilisateur
            const role = await Role.findById(userRole.roleId);

            // récupérer l'utilisateur
            const user = await User.findById(userRole.userId);

            // vérifier si le rôle et l'utilisateur existent
            if (!role || !user) {
                continue; // passer à l'itération suivante de la boucle
            }

            // vérifier si l'utilisateur est déjà dans l'objet
            if (!usersWithRoles[user.username]) {
                // s'il n'y est pas, ajouter l'utilisateur avec un tableau contenant le rôle
                usersWithRoles[user.username] = [role.name];
            } else {
                // s'il y est déjà, ajouter le rôle au tableau de cet utilisateur
                usersWithRoles[user.username].push(role.name);
            }

        }

        // transformer l'objet en tableau pour la réponse
        const userRolesResponses = Object.keys(usersWithRoles).map(username => {
            return { username: username, roles: usersWithRoles[username] }
        });

        // renvoyer une réponse 200 OK avec les informations des userRoles
        res.status(200).json({ userRoles: userRolesResponses });

    } catch (err) {
        console.error("Erreur lors de la récupération des UserRoles:", err);
        res.status(400).send(err);
    }
}


module.exports = { getUsersRoles };