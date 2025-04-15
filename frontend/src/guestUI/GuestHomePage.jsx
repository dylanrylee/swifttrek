import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GuestHomePage.module.css';
import Header from './Header';
import Footer from './Footer';

const GuestHomePage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.mainContent}>
                <div className={styles.buttonContainer}>
                    <button 
                        className={styles.actionButton}
                        onClick={() => navigate('/plane-booking')}
                    >
                        Book Flight
                    </button>
                    <button 
                        className={styles.actionButton}
                        onClick={() => navigate('/hotel-rental')}
                    >
                        Book Hotel
                    </button>
                    <button 
                        className={styles.actionButton} 
                        onClick={() => navigate('/car-rental')}
                    >
                        Rent Car
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default GuestHomePage;
