import React, { useState } from 'react';
import styles from './PaymentCheckout.module.css';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCheckCircle } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

import Header from './Header';
import Footer from './Footer';

const PaymentCheckout = () => {
    const [showDebitForm, setShowDebitForm] = useState(false);
    const [showCreditForm, setShowCreditForm] = useState(false);
    const [showPaypalForm, setShowPaypalForm] = useState(false);
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = getAuth();

    const {
        selectedCar,
        fromDate,
        toDate,
        hotelName,
        roomNumber,
        price,
        hotelId,
        hotelLocation,
        companyID
    } = location.state || {};

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${month}/${day}/${year}`;
    };

    const markCarAsBooked = async (carId) => {
        try {
            const carRef = doc(db, 'cars', carId);
            await updateDoc(carRef, { availability: 'Booked' });
        } catch (error) {
            console.error('Error updating car availability:', error);
        }
    };

    const markHotelAsBooked = async (hotelDocId) => {
        try {
            const hotelRef = doc(db, 'hotels', hotelDocId);
            await updateDoc(hotelRef, { availability: 'Booked' });
        } catch (error) {
            console.error('Error updating hotel room availability:', error);
        }
    };

    const storeBookingData = async () => {
        try {
            if (selectedCar) {
                await addDoc(collection(db, 'booked_cars'), {
                    carName: selectedCar.model,
                    carPrice: selectedCar.price,
                    companyID: selectedCar.companyID,
                    fromDate: fromDate,
                    toDate: toDate,
                    guestID: currentUser?.uid
                });
            }

            if (hotelName) {
                await addDoc(collection(db, 'booked_hotels'), {
                    fromDate,
                    toDate,
                    guestID: currentUser?.uid ,
                    hotelLocation: hotelLocation,
                    hotelName,
                    hotelPrice: price,
                    companyID: companyID
                });
            }
        } catch (err) {
            console.error('Error saving booking data:', err);
        }
    };

    const handleConfirm = async () => {
        if (
            cardNumber.length !== 19 ||
            expiry.length !== 5 ||
            cvv.length !== 3 ||
            !cardHolder
        ) {
            alert('Please fill in all fields correctly.');
            return;
        }

        try {
            if (selectedCar?.id) await markCarAsBooked(selectedCar.id);
            if (hotelId) await markHotelAsBooked(hotelId);
            await storeBookingData(); // Add booking to appropriate collection
            setPaymentConfirmed(true);
        } catch (error) {
            alert('Payment failed. Please try again.');
        }
    };

    const handlePaypalConfirm = async () => {
        try {
            if (selectedCar?.id) await markCarAsBooked(selectedCar.id);
            if (hotelId) await markHotelAsBooked(hotelId);
            await storeBookingData(); // Add booking to appropriate collection
            setPaymentConfirmed(true);
        } catch (error) {
            alert('Payment failed. Please try again.');
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

                        {selectedCar && (
                            <div className={styles.carInfoBox}>
                                <h2 className={styles.subheading}>Car Booking</h2>
                                <p><strong>Car Model:</strong> {selectedCar.model}</p>
                                <p><strong>Car Type:</strong> {selectedCar.type}</p>
                                <p><strong>Booked From:</strong> {formatDate(fromDate)}</p>
                                <p><strong>Booked To:</strong> {formatDate(toDate)}</p>
                                <p><strong>Price per Day:</strong> ${selectedCar.price}</p>
                            </div>
                        )}

                        {hotelName && roomNumber && price && (
                            <div className={styles.hotelInfoBox}>
                                <h2 className={styles.subheading}>Hotel Booking</h2>
                                <p><strong>Hotel Name:</strong> {hotelName}</p>
                                <p><strong>Room Number:</strong> {roomNumber}</p>
                                <p><strong>Booked From:</strong> {formatDate(fromDate)}</p>
                                <p><strong>Booked To:</strong> {formatDate(toDate)}</p>
                                <p><strong>Price per Night:</strong> ${price}</p>
                            </div>
                        )}

                        <div className={styles.buttonContainer}>
                            <button className={styles.paymentButton} onClick={() => {
                                setShowDebitForm(true);
                                setShowCreditForm(false);
                                setShowPaypalForm(false);
                            }}>
                                <FaCcVisa className={styles.icon} /> Debit Card
                            </button>
                            <button className={styles.paymentButton} onClick={() => {
                                setShowDebitForm(false);
                                setShowCreditForm(true);
                                setShowPaypalForm(false);
                            }}>
                                <FaCcMastercard className={styles.icon} /> Credit Card
                            </button>
                            <button className={styles.paymentButton} onClick={() => {
                                setShowDebitForm(false);
                                setShowCreditForm(false);
                                setShowPaypalForm(true);
                            }}>
                                <FaCcPaypal className={styles.icon} /> PayPal
                            </button>
                        </div>

                        {(showDebitForm || showCreditForm) && (
                            <div className={styles.debitForm}>
                                <h3 className={styles.formHeading}>
                                    Enter {showDebitForm ? 'Debit' : 'Credit'} Card Details
                                </h3>

                                <input
                                    type="text"
                                    placeholder="Cardholder Name"
                                    className={styles.inputField}
                                    value={cardHolder}
                                    onChange={(e) => setCardHolder(e.target.value)}
                                />

                                <input
                                    type="text"
                                    placeholder="Card Number"
                                    className={styles.inputField}
                                    maxLength="19"
                                    value={cardNumber}
                                    onChange={(e) => {
                                        const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                                        const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
                                        setCardNumber(formatted);
                                    }}
                                />

                                <div className={styles.row}>
                                    <input
                                        type="text"
                                        placeholder="Expiry Date (MM/YY)"
                                        className={styles.inputField}
                                        maxLength="5"
                                        value={expiry}
                                        onChange={(e) => {
                                            let input = e.target.value.replace(/\D/g, '').slice(0, 4);
                                            if (input.length >= 3) input = `${input.slice(0, 2)}/${input.slice(2)}`;
                                            setExpiry(input);
                                        }}
                                    />

                                    <input
                                        type="text"
                                        placeholder="CVV"
                                        className={styles.inputField}
                                        maxLength="3"
                                        value={cvv}
                                        onChange={(e) => {
                                            const input = e.target.value.replace(/\D/g, '').slice(0, 3);
                                            setCvv(input);
                                        }}
                                    />
                                </div>

                                <button className={styles.confirmButton} onClick={handleConfirm}>
                                    Confirm Payment
                                </button>
                            </div>
                        )}

                        {showPaypalForm && (
                            <div className={styles.debitForm}>
                                <h3 className={styles.formHeading}>Pay with PayPal</h3>
                                <p>This will redirect you to PayPal in a real-world scenario.</p>
                                <button className={styles.confirmButton} onClick={handlePaypalConfirm}>
                                    Confirm PayPal Payment
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
