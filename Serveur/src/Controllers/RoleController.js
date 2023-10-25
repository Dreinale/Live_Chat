/* 
Description: Ce fichier contient les fonctions de contrôle pour les rôles de l'application. 
Il contient les fonctions suivantes: createRole, getRoles, getRoleById, updateRole, deleteRole. 
Ces fonctions sont utilisées pour créer, récupérer, mettre à jour et supprimer des rôles dans la base de données. 
Ces fonctions sont appelées par les routes dans le fichier RoleRoutes.js. 
*/

// importation du modèle de rôle
const Role = require('../Models/Role/Role');

// Fonction pour créer un rôle
const createRole = async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).send(role);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Fonction pour récupérer tous les rôles
const getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).send(roles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Fonction pour récupérer un rôle spécifique
const getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        res.status(200).send(role);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Fonction pour mettre à jour un rôle spécifique
const updateRole = async (req, res) => {
    try {
        // Logique pour mettre à jour un rôle spécifique
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(role);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Fonction pour supprimer un rôle spécifique
const deleteRole = async (req, res) => {
    try {
        // Logique pour supprimer un rôle spécifique
        const role = await Role.findByIdAndDelete(req.params.id);
        res.status(200).send(role);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Exporter les fonctions de contrôle pour les rôles
module.exports = { createRole, getRoles, getRoleById, updateRole, deleteRole };