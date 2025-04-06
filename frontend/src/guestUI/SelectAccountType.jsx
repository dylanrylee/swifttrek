import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SelectAccountType.module.css';
import Header from './Header';
import Footer from './Footer';

const SelectAccountType = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            {/* hideTabs={true} to make navigation tabs invisible*/}
            <Header hideTabs={true} />
            <main className={styles.mainContent}>
                <div className={styles.contentBox}> 
                    <h2>Select Account Type</h2>
                    <div className={styles.buttonContainer}>
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
                    </div>
                </div>
            </main>
            <Footer className={styles.footer} />
        </div>
    );
};

export default SelectAccountType;