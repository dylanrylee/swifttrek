import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminLogin.module.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ 
        username: '', 
        password: '' 
    });

    const handleInputChange = (e) => {
        setCredentials({ 
            ...credentials, 
            [e.target.id]: e.target.value 
        });
    };

    const handleLogin = () => {
        if (credentials.username.trim() && credentials.password.trim()) {
            if (credentials.username === 'admin' && credentials.password === 'admin123') {
                navigate('/admin-dashboard');
            } else {
                alert('Invalid admin credentials');
            }
        } else {
            alert('Please enter both username and password.');
        }
    };

    return (
        <div className={styles.container}>
            <main className={styles.mainContent}>
                <div className={styles.loginBox}>
                    <h2>Admin Portal</h2>
                    <div className={styles.loginContainer}>
                        <label htmlFor="username">Admin ID:</label>
                        <input 
                            type="text" 
                            id="username" 
                            placeholder="Enter admin username" 
                            value={credentials.username}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="password">Password:</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Enter admin password" 
                            value={credentials.password}
                            onChange={handleInputChange}
                        />
                        <button 
                            className={styles.loginButton} 
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                    </div>
                    <button 
                        className={styles.backButton} 
                        onClick={() => navigate('/')}
                    >
                        Back
                    </button>
                </div>
            </main>
        </div>
    );
};

export default AdminLogin;