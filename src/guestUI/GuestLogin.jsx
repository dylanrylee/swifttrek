import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GuestLogin.module.css'; 
import Header from './Header';
import Footer from './Footer';

const GuestLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleInputChange = (e) => {
        setCredentials({ ...credentials, [e.target.id]: e.target.value });
    };

    const handleEnterClick = () => {
        if (credentials.username.trim() && credentials.password.trim()) {
            navigate('/guest-home'); // Only navigate if both fields are filled
        } else {
            alert('Please enter both username and password.');
        }
    };

    return (
        <div className={styles.container}>
            <main className={styles.mainContent}>
                <div className={styles.loginBox}>
                    <h2>Welcome to Travel Planner</h2>
                    <div className={styles.loginContainer}>
                        <label htmlFor="username">Login:</label>
                        <input 
                            type="text" 
                            id="username" 
                            placeholder="Enter your username" 
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
                        <p>Don't have an account? <a href="#register">Register</a></p>
                    </div>
                    <button 
                        className={styles.backButton} 
                        onClick={() => navigate('/')} // Back to SelectAccountType
                    >
                        Back
                    </button>
                </div>
            </main>
        </div>
    );
};

export default GuestLogin;
