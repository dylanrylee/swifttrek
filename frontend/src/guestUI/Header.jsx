import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css'; 

const Header = ({ hideTabs }) => {
    return (
        <header className={styles.header}>
            <h1>Travel Planner Website</h1>
            {!hideTabs && (
                <nav className={styles.nav}>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">Profile</Link></li>
                        <li><Link to="/contact">Settings</Link></li>
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default Header;
