const express = require('express');
const app = express();
const cors = require('cors');

// .env
require('dotenv').config();

//import ChatRoomRoute.js
const ChatRoomRoute = require('./Routes/ChatRoomRoute');
const UserRoutes = require('./Routes/UserRoute');
const MessageRoute = require('./Routes/MessageRoute');
const RoleRoute = require('./Routes/RoleRoute');
const PermissionRoute = require('./Routes/PermissionRoute');
const RolePermissionRoute = require('./Routes/RolePermissionRoute');
const UserRoleRoute = require('./Routes/UserRolesRoute');
const ReactionRoute = require('./Routes/ReactionRoute');
const MessageReactionRoute = require('./Routes/MessageReactionRoute');

//import AuthRoute.js
const AuthRoute = require('./Routes/AuthRoute');
//import AuthMiddleware.js
const auth = require('./Middleware/AuthMiddleware');
const checkPermission = require('./Middleware/CheckPermission')

// configuration de base de données
require('./Config/DBConnection');

const corsOptions = {
  origin: 'http://localhost:3000', // Remplacez par l'origine de votre application front-end
  methods: 'GET, POST, PUT, DELETE, OPTIONS', // Méthodes HTTP autorisées
  allowedHeaders: 'Content-Type, Authorization, X-Requested-With, auth-token', // En-têtes autorisés
  credentials: true, // Autorise les cookies
};

// Utilisez le middleware CORS avec les options définies
app.use(cors(corsOptions));

// Routes pour l'authRoute
app.use(express.json());
app.use('/', require('./Routes/AuthRoute'));

// Route non protégée
app.get('/', (_req, res) => {
  res.send('Bienvenue sur la page d\'accueil');
});

// Route protégée
app.use('/api/user',auth, UserRoutes);
app.use('/api/chatroom',auth,  ChatRoomRoute);
app.use('/api/message',auth, MessageRoute);
app.use('/api/role',auth, RoleRoute);
app.use('/api/permission',auth, PermissionRoute);
app.use('/api/rolepermission',auth, RolePermissionRoute);
app.use('/api/userrole',auth, UserRoleRoute);
app.use('/api/reaction',auth, ReactionRoute);
app.use('/api/messagereaction',auth, MessageReactionRoute);


// Configuration de socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'auth-token'],
    credentials: true,
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// app.use(require('./Routes/UserRoute'));
io.on('connection', (socket) => {
  console.log('New client connected');

  // Écouter les événements de message
  socket.on('message', (data) => {
    console.log('Received message:', data.message, 'from chat room:', data.roomId);

    // Emit the message event to all connected clients in the same room
    io.to(data.roomId).emit('message', data);
  });

  /*socket.on('messagereaction', (data) => {
    console.log('Reaction added successfully');

    io.emit('reactionAdded', { data });
  });*/

  socket.on('update', () => {
    io.emit('update');
  });

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
  });

  // Écouter les déconnexions
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(process.env.PORT, () => {
  console.log('Serveur lancé sur le port', process.env.PORT);
});