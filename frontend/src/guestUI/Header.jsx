import React from 'react';
import styles from './Header.module.css'; 

const Header = () => {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>Travel Planner Website</h1>
            <nav className={styles.nav}>
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#profile">Profile</a></li>
                    <li><a href="#settings">Settings</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
