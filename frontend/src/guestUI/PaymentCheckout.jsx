import React, { useState } from 'react';
import styles from './PaymentCheckout.module.css';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCheckCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Header from './Header';
import Footer from './Footer';

const PaymentCheckout = () => {
    const [showDebitForm, setShowDebitForm] = useState(false);
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const flight = location.state?.flight;

    const handlePaymentConfirm = async () => {
        if (!flight || flight.availableSeats <= 0) {
            alert('No available seats or flight data is missing.');
            return;
        }

        try {
            const flightRef = doc(db, 'flights', flight.id);
            await updateDoc(flightRef, {
                availableSeats: flight.availableSeats - 1
            });
            setPaymentConfirmed(true);
        } catch (error) {
            console.error('Error updating flight seats:', error);
            alert('Something went wrong with your booking.');
        }
    };

    return (
        <div className={styles.container}>
            <Header hideTabs={false} />

            <div className={styles.content}>
                {paymentConfirmed ? (
                    <div className={styles.confirmationScreen}>
                        <h1 className={styles.confirmationText}>
                            Payment Confirmed <FaCheckCircle className={styles.checkmark} />
                        </h1>
                        <button className={styles.confirmButton} onClick={() => navigate('/guest-home')}>
                            Go to Homepage
                        </button>
                    </div>
                ) : (
                    <>
                        <h1 className={styles.heading}>Payment Checkout</h1>
                        <h2 className={styles.subheading}>{flight?.flightNumber || 'Your Flight'}</h2>
                        <p className={styles.date}>
                            From {flight?.departureCity} to {flight?.arrivalCity}
                        </p>

                        <div className={styles.buttonContainer}>
                            <button className={styles.paymentButton} onClick={() => setShowDebitForm(true)}>
                                <FaCcVisa className={styles.icon} /> Debit Card
                            </button>
                            <button className={styles.paymentButton}>
                                <FaCcMastercard className={styles.icon} /> Credit Card
                            </button>
                            <button className={styles.paymentButton}>
                                <FaCcPaypal className={styles.icon} /> PayPal
                            </button>
                        </div>

                        {showDebitForm && (
                            <div className={styles.debitForm}>
                                <h3 className={styles.formHeading}>Enter Debit Card Details</h3>
                                <input type="text" placeholder="Cardholder Name" className={styles.inputField} />
                                <input type="text" placeholder="Card Number" className={styles.inputField} maxLength="16" />
                                <div className={styles.row}>
                                    <input type="text" placeholder="Expiry Date (MM/YY)" className={styles.inputField} />
                                    <input type="text" placeholder="CVV" className={styles.inputField} maxLength="3" />
                                </div>
                                <button className={styles.confirmButton} onClick={handlePaymentConfirm}>
                                    Confirm Payment
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default PaymentCheckout;
