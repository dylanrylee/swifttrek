import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SelectAccountType.module.css';
import Header from './Header';
import Footer from './Footer';

const SelectAccountType = () => {
    const navigate = useNavigate();

    return (
        
        <div className={styles.container}>
<<<<<<< HEAD
            <div className={styles.welcomeText}>
            <img src="https://static.vecteezy.com/system/resources/previews/041/041/333/non_2x/travel-app-logo-icon-brand-identity-sign-symbol-vector.jpg" alt="SwiftTrek Logo" className={styles.logo} />
            <div className={styles.textContent}>
                <h1>Welcome to SwiftTrek</h1>
                <div className={styles.tagline}>Your Swift Escape Starts Here...</div>
            </div>
</div>
            {/* hideTabs={true} to mske navigation tabs invisble*/}
=======
            {/* hideTabs={true} to make navigation tabs invisible*/}
>>>>>>> adminUI
            <Header hideTabs={true} />
            <main className={styles.mainContent}>
                <div className={styles.contentBox}> 
                    <h2>Select Account Type</h2>
                    <div className={styles.buttonContainer}>
<<<<<<< HEAD
                        <button className={styles.guestaccountButton} onClick={() => navigate('/guest-login')}>
                            Guest
                        </button>
                        <button className={styles.businessaccountButton} onClick={() => window.location.href = '/businessUI/loginbusiness.html'}>
                            Business</button>
                        <button className={styles.adminaccountButton} onClick={() => window.location.href = '/adminUI/login_admin.html'}> Admin</button>
=======
                        <button 
                            className={styles.accountButton} 
                            onClick={() => navigate('/guest-login')}
                        >
                            Guest
                        </button>
                        <button 
                            className={styles.accountButton}
                            onClick={() => navigate('/business-login')}  // Added business navigation
                        >
                            Business
                        </button>
                        <button 
                            className={styles.accountButton}
                            onClick={() => navigate('/admin-login')}
                        >
                            Admin
                        </button>
>>>>>>> adminUI
                    </div>
                </div>
            </main>
            <Footer className={styles.footer} />
        </div>
    );
};

export default SelectAccountType;