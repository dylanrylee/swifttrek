import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SelectAccountType.module.css';
import SelectAccountFooter from './SelectAccountFooter';

const SelectAccountType = () => {
    const navigate = useNavigate();

    return (
        
        <div className={styles.container}>
            <div className={styles.welcomeText}>
            <img src="https://static.vecteezy.com/system/resources/previews/041/041/333/non_2x/travel-app-logo-icon-brand-identity-sign-symbol-vector.jpg" alt="SwiftTrek Logo" className={styles.logo} />
            <div className={styles.textContent}>
                <h1>Welcome to SwiftTrek</h1>
                <div style={{
                    fontSize: '1.75rem',
                    color: 'white',
                    fontStyle: 'italic',
                    lineHeight: 1.5,
                    textShadow: '1px 1px 4px rgba(0, 0, 0, 0.4)'
                    }}>
                    Your Swift Escape Starts Here...
                    </div>
            </div></div>
            <main className={styles.mainContent}>
                <div className={styles.contentBox}> 
                    <h2 className={styles.selectAccountTypeHeader}>Select Account Type</h2>
                    <div className={styles.buttonContainer}>
                        <button className={styles.guestaccountButton} onClick={() => navigate('/guest-login')}>
                            Guest
                        </button>
                        <button className={styles.businessaccountButton} onClick={() => window.location.href = '/businessUI/loginbusiness.html'}>
                            Business</button>
                        <button className={styles.adminaccountButton} onClick={() => window.location.href = '/adminUI/login_admin.html'}> Admin</button>
                    </div>
                </div>
            </main>
            <SelectAccountFooter className={styles.footer} />
        </div>
    );
};

export default SelectAccountType;
