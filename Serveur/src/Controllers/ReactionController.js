const Reaction = require('../Models/Reaction/Reaction');
const MessageReaction = require("../Models/Reaction/MessageReaction");

const createReaction = async (req, res) => {
    try {
        const reaction = new Reaction({
            Name: req.body.Name,
            Emoji: req.body.Emoji
        });
        await reaction.save();
        res.status(201).send(reaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Fonction pour récupérer toutes les Reactions
const getReactions = async (req, res) => {
    try {
        const reactions = await Reaction.find();
        res.status(200).send(reactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Fonction pour récupérer une Reaction spécifique
const getReactionId = async (req, res) => {
    try {
        const reaction = await Reaction.findOne({ _id: req.params.reactionId });

        if (!reaction) {
            return res.status(404).send('Réaction non trouvée');
        }

        res.status(200).send(reaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};


// Fonction pour récupérer une Reaction spécifique
const getReactionByName = async (req, res) => {
    try {
        const reactionName = req.params.reactionName;
        const reaction = await Reaction.findOne({ Name: reactionName });

        res.status(200).send(reaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Fonction pour mettre à jour une Reaction spécifique par son nom
const updateReactionByName = async (req, res) => {
    try {
        const reactionName = req.params.reactionName;
        const updatedReaction = req.body;
        const reaction = await Reaction.findOneAndUpdate({ Name: reactionName }, updatedReaction, { new: true });

        if (!reaction) {
            return res.status(404).json({ error: 'Réaction introuvable' });
        }

        res.status(200).json(reaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Fonction pour supprimer une Reaction spécifique par son nom
const deleteReactionByName = async (req, res) => {
    try {
        const reactionName = req.params.reactionName;
        const reaction = await Reaction.findOneAndDelete({ Name: reactionName });

        if (!reaction) {
            return res.status(404).json({ error: 'Réaction introuvable' });
        }

        res.status(200).json({ message: 'Réaction supprimée avec succès' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};


module.exports = { createReaction, getReactions, getReactionByName, updateReactionByName, deleteReactionByName, getReactionId };