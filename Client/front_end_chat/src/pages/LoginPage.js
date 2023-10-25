import React, { useState } from 'react';
import { Form, FormField } from '../components/FormComponent';
import { loginUser } from '../services/Api';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import '../css/pages/Login.css';

//test
import { getToken} from "../utils/Token";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    let token = getToken();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(email, password);
            Cookies.set('token', response.data.token);
            navigate("/chat");

            console.log("token:", token);

            Notification.requestPermission().then(function(permission) {
                if (permission === "granted") {
                    console.log("Notification permission granted.");
                } else {
                    console.log("Unable to get permission to notify.");
                }
            });
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
        }
    };

    return (
        <div className="login">
            <h1>Connexion</h1>
            <Form onSubmit={handleSubmit}>
                <FormField
                    label="Email"
                    type="text"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <FormField
                    label="Password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </Form>
        </div>
    );
};

export default LoginPage;