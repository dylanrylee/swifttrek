// src/components/SelectAccountFooter.jsx

import React from 'react';
import styles from './SelectAccountFooter.module.css';

const SelectAccountFooter = () => {
    return (
        // Footer wrapper
        <footer className={styles.footer}>
           
            {/* Footer navigation links */}
            <div className={styles.footerLinks}>
                <a href='/businessUI/aboutus.html' className="nav-link text-white">About Us</a>
                <a href="mailto:swifttrek@gmail.com" className="nav-link text-white">Contact Us</a>
            </div>

            {/* Logo and brand name */}
            <div className={styles.footerLogo}>
                <img 
                    src="https://static.vecteezy.com/system/resources/previews/041/041/333/non_2x/travel-app-logo-icon-brand-identity-sign-symbol-vector.jpg" 
                    alt="SwiftTrek Logo" 
                    className={styles.footerLogoImage}
                />
                <span>SwiftTrek</span>
            </div>

        </footer>
    );
};

export default SelectAccountFooter;
