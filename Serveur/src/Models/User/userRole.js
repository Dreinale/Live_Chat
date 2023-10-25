const mongoose = require('mongoose');
const { Schema } = mongoose;

const userRoleSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
});

module.exports = mongoose.model('UserRole', userRoleSchema);