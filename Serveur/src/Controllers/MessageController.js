const Message = require('../Models/message');
const ChatRoom = require('../Models/ChatRoom');
const User = require('../Models/User/User');


// Create message
const createMessage = async (req, res) => {
    try {
        // Récupérer les données du nouveau message à partir du corps de la requête
        const { chatRoomId, message } = req.body;

        // Vérifier que le chatRoomId et le message sont fournis
        if (!chatRoomId || !message) {
            return res.status(400).json({ msg: 'Veuillez fournir un chatRoomId et un message.' });
        }

        // Récupérer l'ID de l'utilisateur à partir du jeton d'authentification
        const sendBy = req.user.id;

        // Récupérer le document de l'utilisateur à partir de la base de données
        const user = await User.findById(sendBy);

        // Créer une nouvelle instance de Message
        const newMessage = new Message({
            chatRoomId,
            sendBy,
            message
        });

        // Enregistrer le nouveau message dans la base de données
        await newMessage.save();

        // Créer  un nouvel objet de réponse avec le nom de l'utilisateur à la place de l'ID
        const messageResponse = {
            _id: newMessage._id,
            chatRoomId: newMessage.chatRoomId,
            sendBy: user.username,
            message: newMessage.message,
            createdAt: newMessage.createdAt
        };

        // Renvoyer une réponse 201 Created avec les informations du nouveau message
        // et le nom de l'utilisateur
        res.status(201).json({ message: messageResponse });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// get messages by userId
const getMessagesByUserId = async (req, res) => {
    try {
        // Récupérer l'ID de l'utilisateur à partir du jeton d'authentification
        const userId = req.user.id;

        // Trouver tous les messages envoyés par l'utilisateur spécifié
        const messages = await Message.find({ sendBy: userId });

        // Vérifier s'il y a des messages envoyés par cet utilisateur
        if (!messages || messages.length === 0) {
            return res.status(404).json({ msg: "Aucun message trouvé pour cet utilisateur." });
        }

        // Créer un nouvel objet de réponse avec le nom de l'utilisateur à la place de l'ID
        const messageResponses = await Promise.all(messages.map(async (msg) => {
            const user = await User.findById(msg.sendBy);
            return {
                _id: msg._id,
                chatRoomId: msg.chatRoomId,
                sendBy: user.username, // Remplacer l'ID par le nom de l'utilisateur
                message: msg.message,
                createdAt: msg.createdAt
            };
        }));

        // Renvoyer une réponse 200 OK avec les informations des messages
        res.status(200).json({ messages: messageResponses });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// get messages by chatRoomId
const getMessagesByChatRoomId = async (req, res) => {
    try {

        const chatRoomId = req.params.roomId;
        // console.log('params', req.params.roomId);
        // console.log('query', req.query);

        // pagination
        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        // Count total messages
        const totalMessages = await Message.countDocuments({ chatRoomId });
        // console.log('Total messages:', totalMessages);

        const messages = await Message.find({ chatRoomId })
            .sort({ createdAt: -1 }) // get the oldest messages first
            .skip(skip)
            .limit(pageSize);

        // console.log('Loaded messages:', messages.length);

        if (!messages || messages.length === 0) {
            return res.status(200).json([]);
        }

        // Prepare the response
        const messageResponses = await Promise.all(messages.map(async (msg) => {
            const user = await User.findById(msg.sendBy);
            return {
                _id: msg._id,
                chatRoomId: msg.chatRoomId,
                sendBy: user.username, // Send user ID directly for now
                message: msg.message,
                createdAt: msg.createdAt,
            };
        }));

        res.status(200).json({ totalMessages, messages: messageResponses });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: `Server Error: ${err.message}` }); // Send specific error message
    }
};


// get messages by chatRoomId and userId
const getMessagesByChatRoomIdAndUserId = async (req, res) => {
    try {
        // Récupérer l'ID de la salle de discussion à partir des paramètres de la requête
        const chatRoomId = req.params.roomId;

        // Récupérer l'ID de l'utilisateur à partir du jeton d'authentification
        const userId = req.user._id;

        // Trouver tous les messages de la salle de discussion spécifiée envoyés par l'utilisateur authentifié
        const messages = await Message.find({ chatRoomId, sendBy: userId });

        // Vérifier s'il y a des messages dans cette salle de discussion envoyés par l'utilisateur
        if (!messages || messages.length === 0) {
            return res.status(404).json({ msg: "Aucun message trouvé pour cette salle de discussion et cet utilisateur." });
        }

        // Créer un nouvel objet de réponse avec le nom de l'utilisateur à la place de l'ID
        const messageResponses = await Promise.all(messages.map(async (msg) => {
            const user = await User.findById(msg.sendBy);
            return {
                _id: msg._id,
                chatRoomId: msg.chatRoomId,
                sendBy: user.username, // Remplacer l'ID par le nom de l'utilisateur
                message: msg.message,
                createdAt: msg.createdAt
            };
        }));

        // Renvoyer une réponse 200 OK avec les informations des messages
        res.status(200).json({ messages: messageResponses });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// update message
const updateMessage = async (req, res) => {
    try {
        // Récupérer l'ID du message à partir des paramètres de la requête
        const messageId = req.params.messageId;

        // Récupérer l'ID de l'utilisateur à partir du jeton d'authentification
        const userId = req.user.id;

        // Récupérer le nouveau contenu du message à partir du corps de la requête
        const { message } = req.body;

        // Trouver le message dans la base de données en utilisant l'ID du message et l'ID de l'utilisateur
        const existingMessage = await Message.findOne({ _id: messageId, sendBy: userId });

        // Vérifier si le message existe
        if (!existingMessage) {
            return res.status(404).json({ msg: "Message introuvable." });
        }

        // Mettre à jour le contenu du message
        existingMessage.message = message || existingMessage.message;

        // Enregistrer le message mis à jour dans la base de données
        await existingMessage.save();

        // Renvoyer une réponse 200 OK avec les informations du message mis à jour
        res.status(200).json({ message: existingMessage });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};


// delete message
const deleteMessage = async (req, res) => {
    try {
        // Récupérer l'ID du message à partir des paramètres de la requête
        const messageId = req.params.messageId;

        // Trouver le message par son ID
        const message = await Message.findById(messageId);

        // Vérifier si le message existe
        if (!message) {
            return res.status(404).json({ msg: 'Message introuvable.' });
        }

        // Vérifier si l'utilisateur connecté est celui qui a envoyé le message
        if (req.user.id.toString() !== message.sendBy.toString()) {
            return res.status(403).json({ msg: "Vous n'avez pas l'autorisation de supprimer ce message." });
        }

        // Supprimer le message
        await Message.findByIdAndDelete(messageId);

        // Renvoyer une réponse 200 OK avec un message de confirmation
        res.status(200).json({ msg: 'Message supprimé avec succès.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};



module.exports = { createMessage, getMessagesByUserId, getMessagesByChatRoomId, getMessagesByChatRoomIdAndUserId, updateMessage, deleteMessage };