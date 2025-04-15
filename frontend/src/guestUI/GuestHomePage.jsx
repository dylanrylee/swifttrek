import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GuestHomePage.module.css';
import Header from './Header';
import Footer from './Footer';

const GuestHomePage = () => {
    const navigate = useNavigate(); // We’ll use this to redirect users when they click the buttons

    return (
        <div className={styles.container}> 
            <Header />
            <main className={styles.mainContent}> {/* The central part of the page, where the key action happens */}
                
                {/* Each button takes the user to a different booking page when clicked */}
                <div className={styles.buttonContainer}>
                    <button 
                        className={styles.actionButton}
                        onClick={() => navigate('/plane-booking')} // Navigates to flight booking
                    >
                        Book Flight
                    </button>
                    <button 
                        className={styles.actionButton}
                        onClick={() => navigate('/hotel-rental')} // Navigates to hotel booking
                    >
                        Book Hotel
                    </button>
                    <button 
                        className={styles.actionButton} 
                        onClick={() => navigate('/car-rental')} // Navigates to car booking
                    >
                        Rent Car
                    </button>
                </div>
            </main>

            {/* Nice touch to include the footer here to wrap the experience and provide links/info */}
            <Footer />
        </div>
    );
};

export default GuestHomePage;
