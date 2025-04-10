import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerLinks}>
                <a href='/businessUI/aboutus.html' className="nav-link text-white">About Us</a>
                <a href="mailto:swifttrek@gmail.com" className="nav-link text-white">Contact Us</a>
            </div>
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

export default Footer;