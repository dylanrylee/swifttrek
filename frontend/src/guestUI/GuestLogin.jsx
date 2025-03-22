import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GuestLogin.css';
import Header from './Header';
import Footer from './Footer';

const GuestLogin = () => {
    const navigate = useNavigate();

    const handleInputChange = () => {
        navigate('/guest-home'); // rn it goes to GuestHomePage even though anything is inputted lol
    };

    return (
        <div className="container">
            <Header />
            <main className="main-content">
                <h2>Welcome to Travel Planner</h2>
                <div className="login-container">
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
                <div className="register">
                    <p>Don't have an account? <a href="#register">Register</a></p>
                </div>
                <button 
                    className="back-button" 
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