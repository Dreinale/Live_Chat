/* 
Description: Ce fichier contient les fonctions de contrôle pour les permissions de l'application. 
Il contient les fonctions suivantes: createPermission, getPermissions, getPermissionById, updatePermission, deletePermission. 
Ces fonctions sont utilisées pour créer, récupérer, mettre à jour et supprimer des permissions dans la base de données. 
Ces fonctions sont appelées par les routes dans le fichier PermissionRoutes.js. 
*/

// import permission model
const Permission = require('../Models/Permission/Permission');

// Fonction pour créer une permission
const createPermission = async (req, res) => {
    try {
        const permission = new Permission(req.body);
        await permission.save();
        res.status(201).send(permission);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Fonction pour récupérer toutes les permissions
const getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.status(200).send(permissions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Fonction pour récupérer une permission spécifique
const getPermissionById = async (req, res) => {
    try {
        const permission = await Permission.findById(req.params.id);
        res.status(200).send(permission);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Fonction pour mettre à jour une permission spécifique
const updatePermission = async (req, res) => {
    try {
        const permission = await Permission.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(permission);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Fonction pour supprimer une permission spécifique
const deletePermission = async (req, res) => {
    try {
        const permission = await Permission.findByIdAndDelete(req.params.id);
        res.status(200).send(permission);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Exportation des fonctions de contrôle pour les permissions
module.exports = { createPermission, getPermissions, getPermissionById, updatePermission, deletePermission };