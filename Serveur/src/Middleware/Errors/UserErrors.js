const UserNotFoundError = {
    message: 'Utilisateur non trouvé.',
    status: 404
};

const ValidationError = {
    message: 'Données d\'entrée non valides.',
    status: 400
};

const EmailNotFoundError = {
    message: 'Email is not found.',
    status: 400
};

const InvalidPasswordError = {
    message: 'Invalid password.',
    status: 400
};

const ServerError = {
    message: 'Erreur serveur.',
    status: 500
};

module.exports = { UserNotFoundError, ValidationError, EmailNotFoundError, InvalidPasswordError, ServerError };
