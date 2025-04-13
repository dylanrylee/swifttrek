import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css'; 

const Header = ({ hideTabs }) => {
    return (
        <header className={styles.header}>
            <h1>SwiftTrek</h1>
            {!hideTabs && (
                <nav className={styles.nav}>
                    <ul>
                        <li><Link to="/guest-home">Home</Link></li>
                        <li><Link to="/guest-profile">Profile</Link></li>
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default Header;
