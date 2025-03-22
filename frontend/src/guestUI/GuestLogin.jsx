import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GuestLogin.module.css'; // Import CSS Module
import Header from './Header';
import Footer from './Footer';

const GuestLogin = () => {
    const navigate = useNavigate();

    const handleInputChange = () => {
        navigate('/guest-home'); // rn it goes to GuestHomePage even though anything is inputted lol
    };

    return (
        <div className={styles.container}>
            <Header hideTabs={true} />
            <main className={styles.mainContent}>
                <h2>Welcome to Travel Planner</h2>
                <div className={styles.loginContainer}>
                    <label htmlFor="username">Login:</label>
                    <input 
                        type="text" 
                        id="username" 
                        placeholder="Enter your username" 
                        onChange={handleInputChange} // Trigger navigation on input change
                    />
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        placeholder="Enter your password" 
                        onChange={handleInputChange} // trigger navigation on input change
                    />
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
            </main>
            <Footer />
        </div>
    );
};

export default GuestLogin;
