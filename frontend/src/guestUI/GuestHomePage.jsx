import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GuestHomePage.module.css';
import Header from './Header';
import Footer from './Footer';
import frontpageImage from '../images/guest-frontpage.png';

const GuestHomePage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.mainContent}>
                <img src={frontpageImage} alt="Welcome" className={styles.welcomePhoto} />
                <div className={styles.buttonContainer}>
                    <button className={styles.actionButton}>Book Flight</button>
                    <button className={styles.actionButton}>Book Hotel</button>
                    <button className={styles.actionButton}>Rent Car</button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default GuestHomePage;
