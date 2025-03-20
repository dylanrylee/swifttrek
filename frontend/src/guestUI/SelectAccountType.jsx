import React from 'react';
import './SelectAccountType.css';
import Header from './Header';
import Footer from './Footer';

const SelectAccountType = () => {
    return (
        <div className="container">
            <Header />
            <main className="main-content">
                <h2>Select Account Type</h2>
                <div className="button-container">
                    <button className="account-button">Guest</button>
                    <button className="account-button">Business</button>
                    <button className="account-button">Admin</button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SelectAccountType;