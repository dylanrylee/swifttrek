// src/components/RegisterAccount.jsx

import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Hook for navigation after successful registration
import styles from './RegisterAccount.module.css'; // CSS module for styling the modal

// RegisterAccount component for user sign-up and registration
const RegisterAccount = ({ showModal, onClose }) => {
    // State to store user email input
    const [email, setEmail] = useState('');
    
    // State to store user password input
    const [password, setPassword] = useState('');
    
    // State to store any error messages for user feedback
    const [error, setError] = useState('');

    // Hook from React Router to navigate between pages
    const navigate = useNavigate();

    // If modal is not visible, return null to prevent rendering
    if (!showModal) return null;

    // Handles user registration with Firebase Authentication
    const signUp = async () => {
        setError(''); // Reset any existing error messages

        // Only proceed if both fields are filled
        if (email && password) {
            const auth = getAuth(); // Get Firebase Auth instance

            try {
                // Create a new user account with email and password
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Store the user email in Firestore under 'users' collection
                await setDoc(doc(db, 'users', user.uid), {
                    email: email,
                });

                // Inform the user and close the modal
                alert("Account created: " + user.email);
                onClose();              // Close modal after success
                navigate('/guest-login'); // Navigate to guest login screen

            } catch (error) {
                // Handle and display registration errors
                setError(error.message);
                console.error("Error signing up: ", error);
                alert("Failed to sign up. " + error.message);
            }
        } else {
            // Prompt user to fill in all fields
            setError('Please fill in all fields.');
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Register</h2>

                {/* Display error message if any */}
                {error && <p className={styles.error}>{error}</p>}

                {/* Email input field */}
                <label htmlFor="regEmail">Email:</label>
                <input 
                    type="email" 
                    id="regEmail" 
                    value={email}
                    placeholder="Enter your email" 
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Password input field */}
                <label htmlFor="regPassword">Password:</label>
                <input 
                    type="password" 
                    id="regPassword" 
                    value={password} 
                    placeholder="Enter your password" 
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* Register button triggers signUp */}
                <button onClick={signUp}>Register</button>

                {/* Close button to exit the modal */}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default RegisterAccount;
