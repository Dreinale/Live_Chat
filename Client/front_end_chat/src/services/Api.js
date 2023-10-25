import axios from 'axios';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

export const socket = io('http://localhost:5000');

socket.on('connect', () => {
    console.log(`${socket.id} connected`);
});

// vérifie si l'utilisateur à rejoins la room
socket.on('joinedRoom', (roomId) => {
    console.log('User joined room:', roomId);
});

socket.on("hello", (arg) => {
    console.log(arg); // world
});

socket.on('message', (message) => {
    console.log('Nouveau message :', message);
    console.log('Contenu du message :', message.content);
});

socket.on('disconnect', () => {
    console.log(socket.id);
});

const api = axios.create({
    baseURL: process.env.API_URL || 'http://localhost:5000/',
    withCredentials: true,
});

api.interceptors.request.use(function (config) {
    const token = Cookies.get('token');
    console.log(token);
    if (token) {
        config.headers['auth-token'] = token;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});



// Fonction pour la connexion de l'utilisateur
export const loginUser = (email, password) => {
    return api.post('/login', {
        email,
        password,
    });
};

// Fonction pour l'inscription de l'utilisateur
export const registerUser = (email, password, username) => {
    return api.post('/register', {
        email,
        password,
        username,
    });
}

// Fonction pour afficher les utilisateurs enregistrés
export const getUsers = (page = 1, limit = 5) => {
    return api.get(`api/user/getAllUsers?page=${page}&limit=${limit}`);
}


// Fonction pour obtenir les salles de chat
export const getChatRooms = () => {
    return api.get('/api/chatRoom/getChatRoomByUserId');
};

export const getChatMessages = (roomId, page = 1) => {
    return api.get(`api/message/chatRoom/${roomId}/all?page=${page}`);
}


export const postMessage = (roomId, message) => {
    return api.post('/api/message', {
        chatRoomId: roomId,
        message
    })
        .then((response) => {
            // Après avoir posté le message, émettez un événement sur le socket pour informer les autres utilisateurs.
            socket.emit('message', { roomId, content: message });
            return response;
        });
};

export const updateUser = (userId, username, email, password) => {
    return api.put(`api/user/${userId}`, {
        username,
        email,
        password,
    });
}

export const deleteUsers = (userId) => {
    return api.delete(`api/user/${userId}`);
}

export const getAllUsersRoles = () => {
    return api.get('/api/userrole');
}

Notification.requestPermission().then(function(permission) {
    if (permission === "granted") {
        console.log("Notification permission granted.");
    } else {
        console.log("Unable to get permission to notify.");
    }
});

/* Room */

export const createRoom = (name) => {
    return api.post('/api/chatRoom', {
        name,
    });
}

export const getRooms = (page = 1, limit = 5) => {
    return api.get(`/api/chatRoom?page=${page}&limit=${limit}`);
}

export const updateRoom = (roomId, name) => {
    return api.put(`api/chatRoom/${roomId}`, {
        name,
    });
}

export const deleteRoom = (roomId) => {
    return api.delete(`api/chatRoom/${roomId}`);
}

/* Reaction */

export const getReactions = () => {
    return api.get(`api/reaction`, {});
}

export const getReactionsByReactionId = (reactionId) => {
    return api.get(`api/reaction/Id/${reactionId}/`, {});
}

/* Message Reaction */


export const getReactionsByMessageId = (messageId) => {
    return api.get(`/api/messagereaction/message/${messageId}`);
}

export const addReaction = (messageId, reactionId) => {
    return api.post(`/api/messagereaction/${messageId}/${reactionId}`)
        .then((response) => {
            // Après avoir ajouté la réaction, émettez un événement sur le socket pour informer les autres utilisateurs.
            socket.emit('addReaction', { messageId, reactionId });
            return response;
        });
};
