const jwt = require('jsonwebtoken');

const generateToken = (user, role) => {
    // console.log('User:', user);
    // console.log('Role:', role);

    const roleIds = role.map(role => role._id);

    const payload = {
        userId: user._id,
        username: user.username,
        roleIds: roleIds
    };

    // console.log('Payload:', payload);
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1h' });
};

module.exports = generateToken;
