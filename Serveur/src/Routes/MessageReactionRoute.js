const express = require('express');
const router = express.Router();
const MessageReactionController = require('../Controllers/MessageReactionController');

// route for adding a reaction to a message
router.post('/:messageId/:reactionId', MessageReactionController.addReaction);

//Get by Message Id
router.get('/message/:messageId', MessageReactionController.getReactionsByMessageId);

//Get all reactions by messages
router.get('/', MessageReactionController.getReactionsByMessages);

//Update
router.put('/:messageId/:reactionId/', MessageReactionController.updateReaction);

//Delete
router.delete('/:messageId/:reactionId/', MessageReactionController.deleteReaction);

module.exports = router;
