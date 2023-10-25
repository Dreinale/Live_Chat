const mongoose = require('mongoose');
const Role = require('./Models/Role/Role');
const Permission = require('./Models/Permission/Permission');
const RolePermission = require('./Models/RolePermission/RolePermission');
require('dotenv').config();


mongoose.set('strictQuery', true);
const dbUri = process.env.DB_URI;
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

db.on('connected', async () => {
    console.log('Connected to MongoDB');
    await seedDatabase();  // Appelle la fonction de seed une fois connecté à MongoDB
});

db.on('disconnected', () => {
    console.warn('MongoDB disconnected');
});

process.on('SIGINT', () => {
    db.close(() => {
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
    });
});


//Drop the database
if (process.env.NODE_ENV === 'development') {
    db.dropDatabase();
}


const roles = ['admin', 'moderator', 'user'];
const permissions = [
    'send_messages',
    'read_messages',
    'delete_messages',
    'ban_users',
    'create_channels',
];

const users = [
    { username: 'test1', email: 'admin@example.com', password: 'password123' },
    { username: 'test2', email: 'moderator@example.com', password: 'password123' },
    { username: 'test3', email: 'user@example.com', password: 'password123' }
];

const chatRooms = [
    { name: 'General' },
    { name: 'Off-topic' }
];

const seedDatabase = async () => {
    try {
        // Supprimer les données existantes
        await Role.deleteMany({});
        await Permission.deleteMany({});
        await RolePermission.deleteMany({});

        // Créer les utilisateurs
        const hashedPasswords = await Promise.all(users.map(user => bcrypt.hash(user.password, 10)));
        const userDocuments = users.map((user, i) => new User({ ...user, password: hashedPasswords[i] }));
        const createdUsers = await User.insertMany(userDocuments);

        // Créer les salles de chat
        const chatRoomDocuments = chatRooms.map((chatRoom, i) => new ChatRoom({ ...chatRoom, createdBy: createdUsers[i % createdUsers.length]._id, members: createdUsers.map(user => user._id) }));
        const createdChatRooms = await ChatRoom.insertMany(chatRoomDocuments);

        // Créer un message pour chaque utilisateur dans chaque salle de chat
        for (const user of createdUsers) {
            for (const chatRoom of createdChatRooms) {
                const message = new Message({
                    content: `Hello, I am ${user.username}!`,
                    userId: user._id,
                    chatRoomId: chatRoom._id
                });
                await message.save();
            }

        // Créer les rôles
        const roleDocuments = roles.map(role => new Role({ name: role }));
        await Role.insertMany(roleDocuments);

        // Créer les permissions
        const permissionDocuments = permissions.map(permission => new Permission({ name: permission }));
        await Permission.insertMany(permissionDocuments);

        // Associer toutes les permissions au rôle 'admin'
        const adminRole = await Role.findOne({ name: 'admin' });
        const allPermissions = await Permission.find({});
        const rolePermissionDocuments = allPermissions.map(permission => new RolePermission({ roleId: adminRole.id, permissionsId: permission.id }));
        await RolePermission.insertMany(rolePermissionDocuments);

    }
    } catch (error) {
        console.error(error);
    }
};

