// schema for Reaction
const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Emoji: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Reaction', ReactionSchema);