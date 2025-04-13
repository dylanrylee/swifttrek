import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SelectAccountType.module.css';

const SelectAccountType = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            {/* hideTabs={true} to mske navigation tabs invisble*/}
            <Header hideTabs={true} />
            <main className={styles.mainContent}>
                <div className={styles.contentBox}> 
                    <h2>Select Account Type</h2>
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
            <Footer className={styles.footer} />
        </div>
    );
};

export default SelectAccountType;
