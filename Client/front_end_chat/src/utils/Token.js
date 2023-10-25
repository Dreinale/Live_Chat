import { getCookie} from "./Cookie";
import jwt_decode from 'jwt-decode';

export function getToken() {
    return getCookie('token');
}

export function getUsername() {
    const token = getToken();
    if (!token) {
        console.log('Token not found');
        return null;
    }
    try {
        const decodedToken = jwt_decode(token);
        return decodedToken.username;
    } catch (err) {
        console.error('Error decoding token:', err);
        return null;
    }
}
