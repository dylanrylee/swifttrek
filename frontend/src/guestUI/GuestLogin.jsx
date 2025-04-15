import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GuestLogin.module.css'; 
import RegisterAccount from './RegisterAccount';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const GuestLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' }); // Stores user input
    const [error, setError] = useState(''); // Tracks any login errors
    const [showModal, setShowModal] = useState(false); // Controls the visibility of the registration modal

    const handleInputChange = (e) =>{
        // This spreads previous state and update the changed field by its `id`
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
                navigate('/guest-home');    // Navigate to guest homepage on successful login
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
        // Handle the registration inside RegisterAccount
    };

    return (
        <div className={styles.container}>
            <main className={styles.mainContent}>
                <div className={styles.loginBox}>
                    <h2>Welcome to SwiftTrek</h2>
                    <div className={styles.loginContainer}>
                        {/* Display error message if login fails */}
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

                        {/* Main login button */}
                        <button 
                            className={styles.enterButton} 
                            onClick={handleEnterClick}
                        >
                            Enter
                        </button>
                    </div>

                    {/* Registration link */}
                    <div className={styles.register}>
                        <p>Don't have an account? <a href="#" onClick={() => setShowModal(true)}>Register</a></p>
                    </div>

                    {/* Navigate back to home page */}
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
