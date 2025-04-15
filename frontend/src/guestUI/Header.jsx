import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css'; 

// The Header component takes in a "hideTabs" prop to conditionally render the navigation
const Header = ({ hideTabs }) => {
    return (
        <header className={styles.header}>
            <h1>SwiftTrek</h1>

            {/* Conditionally render the navigation links based on the hideTabs prop */}
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
