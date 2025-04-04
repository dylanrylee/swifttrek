// src/GuestLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GuestLogin.module.css'; 
import RegisterAccount from './RegisterAccount';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // ✅ Add this line

const GuestLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleInputChange = (e) => {
        setCredentials({ ...credentials, [e.target.id]: e.target.value });
    };

    const handleEnterClick = async () => {
        setError('');
        const { username, password } = credentials;

        if (username.trim() && password.trim()) {
            try {
                // Firebase Auth login
                const userCredential = await signInWithEmailAndPassword(auth, username, password);
                console.log("Logged in user:", userCredential.user.email);
                navigate('/guest-home');
            } catch (err) {
                console.error("Login failed:", err);
                setError(err.message);
                alert('Login failed: ' + err.message);
            }
        } else {
            alert('Please enter both username and password.');
        }
    };

    const handleRegister = (username, password) => {
        console.log('Registering new user:', { username, password });
        // You already handle registration inside RegisterAccount
    };

    return (
        <div className={styles.container}>
            <main className={styles.mainContent}>
                <div className={styles.loginBox}>
                    <h2>Welcome to Travel Planner</h2>
                    <div className={styles.loginContainer}>
                        {error && <p className={styles.error}>{error}</p>}
                        <label htmlFor="username">Login:</label>
                        <input 
                            type="text" 
                            id="username" 
                            placeholder="Enter your email" 
                            value={credentials.username}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="password">Password:</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Enter your password" 
                            value={credentials.password}
                            onChange={handleInputChange}
                        />
                        <button 
                            className={styles.enterButton} 
                            onClick={handleEnterClick}
                        >
                            Enter
                        </button>
                    </div>
                    <div className={styles.register}>
                        <p>Don't have an account? <a href="#" onClick={() => setShowModal(true)}>Register</a></p>
                    </div>
                    <button 
                        className={styles.backButton} 
                        onClick={() => navigate('/')} 
                    >
                        Back
                    </button>
                </div>
            </main>

            {/* Modal for registration */}
            <RegisterAccount 
                showModal={showModal} 
                onClose={() => setShowModal(false)} 
                onRegister={handleRegister} 
            />
        </div>
    );
};

export default GuestLogin;
