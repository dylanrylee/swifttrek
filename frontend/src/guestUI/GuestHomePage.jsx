import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GuestHomePage.css';
import Header from './Header';
import Footer from './Footer';
import frontpageImage from '../images/guest-frontpage.png';

const GuestHomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <Header />
            <main className="main-content">
                <img src={frontpageImage} alt="Welcome" className="welcome-photo" />
                <div className="button-container">
                    <button className="action-button">Book Flight</button>
                    <button className="action-button">Book Hotel</button>
                    <button className="action-button">Rent Car</button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default GuestHomePage;