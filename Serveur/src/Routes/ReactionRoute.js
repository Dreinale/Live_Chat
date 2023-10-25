const express = require('express');
const router = express.Router();
const ReactionController = require('../Controllers/ReactionController');

// route for adding a reaction to a message
router.post('/', ReactionController.createReaction);

//Get All
router.get('/', ReactionController.getReactions);

//Get by name
router.get('/:reactionName/', ReactionController.getReactionByName);

//Get by Id
router.get('/Id/:reactionId/', ReactionController.getReactionId);

//Update
router.put('/:reactionName/', ReactionController.updateReactionByName);

//Delete
router.delete('/:reactionName/', ReactionController.deleteReactionByName);

module.exports = router;