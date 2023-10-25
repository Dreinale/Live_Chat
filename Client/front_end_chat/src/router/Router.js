import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { ChatHomePage } from '../pages/ChatHomePage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import Cookies from 'js-cookie';

// cette fonction vérifie si l'utilisateur est connecté
// par exemple, vous pouvez vérifier si un token existe dans le local storage

function isLoggedIn() {
    const token = Cookies.get('token');
    return token !== undefined;
}

function ProtectedRoute({ children }) {
    return isLoggedIn() ? children : <Navigate to="/" />;
}

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/chat" element={
                    <ProtectedRoute>
                        <ChatHomePage />
                    </ProtectedRoute>
                } />
                <Route path= "/admin" element={<AdminDashboardPage />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;
