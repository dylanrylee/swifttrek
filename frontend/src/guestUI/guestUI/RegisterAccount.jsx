// src/components/RegisterAccount.jsx
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // ✅ Import for navigation
import styles from './RegisterAccount.module.css';

const RegisterAccount = ({ showModal, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate(); // ✅ Initialize the hook

    if (!showModal) return null;

    const signUp = async () => {
        setError('');

        if (email && password) {
            const auth = getAuth();

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await setDoc(doc(db, 'users', user.uid), {
                    email: email,
                });

                alert("Account created: " + user.email);
                onClose();            // ✅ Close the modal
                navigate('/guest-login'); // ✅ Navigate to login page

            } catch (error) {
                setError(error.message);
                console.error("Error signing up: ", error);
                alert("Failed to sign up. " + error.message);
            }
        } else {
            setError('Please fill in all fields.');
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Register</h2>
                {error && <p className={styles.error}>{error}</p>}
                <label htmlFor="regEmail">Email:</label>
                <input 
                    type="email" 
                    id="regEmail" 
                    value={email}
                    placeholder="Enter your email" 
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="regPassword">Password:</label>
                <input 
                    type="password" 
                    id="regPassword" 
                    value={password} 
                    placeholder="Enter your password" 
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={signUp}>Register</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default RegisterAccount;
