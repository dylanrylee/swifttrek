import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './SelectAccountType.css';
import Header from './Header';
import Footer from './Footer';

const SelectAccountType = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <Header />
            <main className="main-content">
                <h2>Select Account Type</h2>
                <div className="button-container">
                    <button 
                        className="account-button" 
                        onClick={() => navigate('/guest-login')}
                    >
                        Guest
                    </button>
                    <button className="account-button">Business</button>
                    <button className="account-button">Admin</button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SelectAccountType;