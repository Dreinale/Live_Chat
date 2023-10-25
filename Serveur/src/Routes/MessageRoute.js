const express = require('express');
const router = express.Router();
const messageController = require('../Controllers/MessageController');

const auth = require('../Middleware/AuthMiddleware');

// route for creating a message
router.post('/', messageController.createMessage);

// route for getting all messages by userId
router.get('/user', messageController.getMessagesByUserId);

// route for getting all messages by chatRoomId
router.get('/chatRoom/:roomId/all', messageController.getMessagesByChatRoomId);

// route for getting all messages by chatRoomId and userId
router.get('/chatRoom/:roomId/user', messageController.getMessagesByChatRoomIdAndUserId);

// route for updating a message
router.put('/:messageId', messageController.updateMessage);

// route for deleting a message
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router;