exports.validateRegisterInput = (username, email, password) => {
    const errors = {};

    if (!username || typeof username !== 'string' || username.length < 3 || username.length > 30) {
        errors.username = 'Le nom d\'utilisateur doit être une chaîne de 3 à 30 caractères.';
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
        errors.email = 'L\'email doit être une chaîne contenant un @.';
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
        errors.password = 'Le mot de passe doit être une chaîne d\'au moins 6 caractères.';
    }

    return errors;
};

exports.validateUpdateInput = (username, email, password) => {
    const errors = {};

    if (username && (typeof username !== 'string' || username.length < 3 || username.length > 30)) {
        errors.username = 'Le nom d\'utilisateur doit être une chaîne de 3 à 30 caractères.';
    }

    if (email && (typeof email !== 'string' || !email.includes('@'))) {
        errors.email = 'L\'email doit être une chaîne contenant un @.';
    }

    if (password && (typeof password !== 'string' || password.length < 6)) {
        errors.password = 'Le mot de passe doit être une chaîne d\'au moins 6 caractères.';
    }

    return errors;
};
