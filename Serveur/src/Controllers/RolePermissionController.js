/* 
Description: Ce fichier contient les fonctions de contrôle pour les rôlePermission de l'application. 
Il contient les fonctions suivantes: createRolePermission, getRolePermissions, getRolePermissionById, updateRolePermission, deleteRolePermission. 
Ces fonctions sont utilisées pour créer, récupérer, mettre à jour et supprimer des rôlePermission dans la base de données. 
Ces fonctions sont appelées par les routes dans le fichier RolePermissionRoutes.js. 
*/

// importation du modèle rolePermission
const RolePermission = require('../Models/RolePermission/RolePermission');

// Fonction pour créer une association de rôle et de permission
const createRolePermission = async (req, res) => {
    try {
        const rolePermission = new RolePermission(req.body);
        await rolePermission.save();
        res.status(201).send(rolePermission);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Fonction pour récupérer toutes les associations de rôle et de permission
const getRolePermissions = async (req, res) => {
    try {
        const rolePermissions = await RolePermission.find();
        res.status(200).send(rolePermissions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Fonction pour récupérer une association de rôle et de permission spécifique
const getRolePermissionById = async (req, res) => {
    try {
        const rolePermission = await RolePermission.findById(req.params.id);
        res.status(200).send(rolePermission);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Fonction pour mettre à jour une association de rôle et de permission spécifique
const updateRolePermission = async (req, res) => {
    try {
        const rolePermission = await RolePermission.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(rolePermission);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Fonction pour supprimer une association de rôle et de permission spécifique
const deleteRolePermission = async (req, res) => {
    try {
        const rolePermission = await RolePermission.findByIdAndDelete(req.params.id);
        res.status(200).send(rolePermission);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// exportation des fonctions de contrôle des associations de rôle et de permission
module.exports = { createRolePermission, getRolePermissions, getRolePermissionById, updateRolePermission, deleteRolePermission };