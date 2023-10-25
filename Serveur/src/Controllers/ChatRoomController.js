const ChatRoom = require('../Models/ChatRoom');
const User = require('../Models/User/User'); // Ajoutez cette ligne pour importer le modèle User

// Create chat room
const createChatRoom = async (req, res) => {
    try {
        // Récupérer les données de la nouvelle salle de discussion à partir du corps de la requête
        const { name } = req.body;

        // Vérifier que le nom de la salle de discussion est fourni
        if (!name) {
            return res.status(400).json({ msg: 'Veuillez fournir un nom pour la salle de discussion.' });
        }

        // Vérifier si une salle de discussion avec le même nom existe déjà
        const chatRoomExists = await ChatRoom.exists({ name });
        if (chatRoomExists) {
            return res.status(400).json({ msg: 'Une salle de discussion avec ce nom existe déjà.' });
        }

        // Récupérer l'ID de l'utilisateur à partir du jeton d'authentification qui se trouve dans le header de la requête
        const createdBy = req.user.id;

        // Récupérer le document de l'utilisateur à partir de la base de données
        const user = await User.findById(createdBy);

        // Créer une nouvelle instance de ChatRoom
        const newChatRoom = new ChatRoom({
            name,
            createdBy,
            members: [createdBy] // Ajouter le créateur de la salle de discussion en tant que membre
        });

        // Enregistrer la nouvelle salle de discussion dans la base de données
        await newChatRoom.save();

        // Créer un nouvel objet de réponse avec le nom du créateur à la place de l'ID
        const chatRoomResponse = {
            _id: newChatRoom._id,
            name: newChatRoom.name,
            createdAt: newChatRoom.createdAt,
            createdBy: user.username, // Remplacer l'ID par le nom du créateur
            members: [user.username] // Ajouter le nom du créateur en tant que membre
        };

        // Renvoyer une réponse 201 Created avec les informations de la nouvelle salle de discussion
        // et le nom de l'utilisateur
        res.status(201).json({ chatRoom: chatRoomResponse });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// add user to room
const addUserToRoom = async (req, res) => {
    try {
        const { roomName, userName } = req.body;

        if (!roomName || !userName) {
            return res.status(400).json({ msg: 'Veuillez fournir le nom de la salle de discussion et le nom de l\'utilisateur.' });
        }

        const chatRoom = await ChatRoom.findOne({ name: roomName });
        const user = await User.findOne({ username: userName });

        if (!chatRoom) {
            return res.status(404).json({ msg: 'Salle de discussion non trouvée.' });
        }

        if (!user) {
            return res.status(404).json({ msg: 'Utilisateur non trouvé.' });
        }

        const isUserAlreadyMember = chatRoom.members.indexOf(user._id) !== -1;

        if (isUserAlreadyMember) {
            return res.status(400).json({ msg: 'L\'utilisateur est déjà membre de cette salle de discussion.' });
        }

        chatRoom.members.push(user._id);
        await chatRoom.save();

        res.status(200).json({ msg: `Utilisateur ${user.username} ajouté à la salle de discussion ${chatRoom.name}.` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// get all chat rooms
const getAllChatRooms = async (_req, res) => {
    try {
        const chatRooms = await ChatRoom.find({}).populate('members', 'username');
        res.status(200).json({ chatRooms });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

//get chat room by userId
const getChatRoomByUserId = async (req, res) => {
    try {
        const userId = req.user.id;
        const chatRooms = await ChatRoom.find({ members: userId }).populate('members', 'username');
        res.status(200).json({ chatRooms });
        console.log(chatRooms);
        console.log(userId);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

const updateChatRoom = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const { newName } = req.body;

        if (!roomId || !newName) {
            return res.status(400).json({ msg: 'Veuillez fournir l\'ID de la salle de discussion et le nouveau nom.' });
        }

        const chatRoom = await ChatRoom.findById(roomId);

        if (!chatRoom) {
            return res.status(404).json({ msg: 'Salle de discussion non trouvée.' });
        }

        chatRoom.name = newName;
        await chatRoom.save();

        res.status(200).json({ msg: `Room: ${chatRoom.name}.`, chatRoom });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Delete chat room
const deleteChatRoom = async (req, res) => {
    try {
        const roomId = req.params.roomId;

        if (!roomId) {
            return res.status(400).json({ msg: 'Veuillez fournir l\'ID de la salle de discussion.' });
        }

        const deleteChatRoom = await ChatRoom.findByIdAndDelete(roomId);

        if (!deleteChatRoom) {
            return res.status(404).json({ msg: 'Salle de discussion non trouvée.' });
        }

        res.status(200).json({ msg: `Salle de discussion ${deleteChatRoom.name} supprimée.` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

module.exports = { createChatRoom, addUserToRoom, getAllChatRooms, getChatRoomByUserId, updateChatRoom, deleteChatRoom };