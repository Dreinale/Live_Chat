const mongoose = require('mongoose');
const { Schema } = mongoose;

const rolePermissionSchema = new Schema({
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    permissionsId: {
        type: Schema.Types.ObjectId,
        ref: 'Permission'
    }
});


module.exports = mongoose.model('RolePermission', rolePermissionSchema);