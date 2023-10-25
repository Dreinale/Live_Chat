// schema for message
const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    chatRoomId: {
        type: Schema.Types.ObjectId,
        ref: 'ChatRoom',
        required: true
    },
    sendBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message : {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    reactionCounts: {
        type: Map,
        of: Number,
        default: {}
    }
});

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);
