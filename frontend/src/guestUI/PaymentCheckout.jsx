import React, { useState } from 'react';
import styles from './PaymentCheckout.module.css';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const PaymentCheckout = () => {
    const [showDebitForm, setShowDebitForm] = useState(false);
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <Header hideTabs={false} />

            <div className={styles.content}>
                {paymentConfirmed ? (
                    // Payment Confirmed View
                    <div className={styles.confirmationScreen}>
                        <h1 className={styles.confirmationText}>
                            Payment Confirmed <FaCheckCircle className={styles.checkmark} />
                        </h1>
                        <button className={styles.confirmButton} onClick={() => navigate('/guest-home')}>
                            Go to Homepage
                        </button>
                    </div>
                ) : (
                    // Payment Checkout View
                    <>
                        <h1 className={styles.heading}>Payment Checkout</h1>
                        <h2 className={styles.subheading}>Dylan Hotel</h2>
                        <p className={styles.date}>Jul. 21, 2025 @ 8 AM - Jul. 23, 2025 @ 5 PM</p>

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
                                <button className={styles.confirmButton} onClick={() => setPaymentConfirmed(true)}>
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
