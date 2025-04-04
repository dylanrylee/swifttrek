import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SelectAccountType.module.css';

const SelectAccountType = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <main className={styles.mainContent}>
                <div className={styles.contentBox}> 
                    <h2>Select Account Type</h2>
                    <div className={styles.buttonContainer}>
                        <button className={styles.accountButton} onClick={() => navigate('/guest-login')}>
                            Guest
                        </button>
                        <button className={styles.accountButton}>Business</button>
                        <button className={styles.accountButton}>Admin</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SelectAccountType;
