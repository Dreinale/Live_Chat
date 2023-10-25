const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageReactionSchema = new mongoose.Schema({
    messageId: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    },
    reactionId: {
        type: Schema.Types.ObjectId,
        ref: 'Reaction',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('MessageReaction', MessageReactionSchema);