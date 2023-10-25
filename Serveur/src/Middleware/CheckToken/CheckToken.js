const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Récupérez le token du header de la requête
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ error: 'No token provided' });
    }

    // La valeur de authHeader est généralement "Bearer [token]", nous voulons juste le token
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Failed to authenticate token' });
        }

        // Attachez les données décodées à l'objet req
        req.user = decoded;

        // Appelez le prochain middleware ou gestionnaire de route
        next();
    });
};

module.exports = verifyToken;
