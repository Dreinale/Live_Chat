const express = require('express');
const router = express.Router();
const chatRoomController = require('../Controllers/ChatRoomController');
const checkPermission = require("../Middleware/CheckPermission");


// route for creating chat room
router.post('/',checkPermission("createRoom") , chatRoomController.createChatRoom);

// route for adding user to chat room
router.post('/addMember', chatRoomController.addUserToRoom);

// route for getting all chat rooms
router.get('/', chatRoomController.getAllChatRooms);

// route for getting chat room by userId
router.get('/getChatRoomByUserId', chatRoomController.getChatRoomByUserId);

// route for updating chat room
router.put('/:roomId', chatRoomController.updateChatRoom);

// route for deleting chat room
router.delete('/:roomId', chatRoomController.deleteChatRoom);

module.exports = router;