// schema for chat room
const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatRoomSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    createBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);