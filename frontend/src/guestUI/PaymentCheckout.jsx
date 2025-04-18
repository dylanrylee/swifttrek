import React, { useState } from 'react';
import styles from './PaymentCheckout.module.css';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCheckCircle } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, updateDoc, collection, addDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

import Header from './Header';
import Footer from './Footer';

const PaymentCheckout = () => {

    // State variables for managing the form visibility and payment data    
    const [showDebitForm, setShowDebitForm] = useState(false);
    const [showCreditForm, setShowCreditForm] = useState(false);
    const [showPaypalForm, setShowPaypalForm] = useState(false);
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    // Navigate and location hook to handle routing and location state
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = getAuth(); // Get current user for authentication

    // Destructuring location state for booking details (car, hotel, flight)
    const {
        selectedCar,
        fromDate,
        toDate,
        hotelName,
        roomNumber,
        price,
        hotelId,
        hotelLocation,
        companyID,
        selectedPlane
    } = location.state || {};

    // Function to format the date from YYYY-MM-DD to MM/DD/YYYY
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${month}/${day}/${year}`;
    };

    // Functions to update booking status in Firebase Firestore
    const markCarAsBooked = async (carId) => {
        const carRef = doc(db, 'cars', carId);
        await updateDoc(carRef, { availability: 'Booked' });
    };

    const markHotelAsBooked = async (hotelDocId) => {
        const hotelRef = doc(db, 'hotels', hotelDocId);
        await updateDoc(hotelRef, { availability: 'Booked' });
    };

    const updatePlaneSeatCount = async (planeId) => {
        const planeRef = doc(db, 'flights', planeId);
        const planeSnap = await getDoc(planeRef);
        const currentSeats = planeSnap.data()?.availableSeats;

        if (currentSeats > 0) {
            await updateDoc(planeRef, {
                availableSeats: currentSeats - 1
            });
        }
    };

    // Function to store booking details in Firestore
    const storeBookingData = async () => {
        if (selectedCar) {
            await addDoc(collection(db, 'booked_cars'), {
                model: selectedCar.model,
                price: Number(selectedCar.price),
                companyId: Number(selectedCar.companyId),
                fromDate,
                toDate,
                guestID: currentUser?.uid || ''
            });
        }

        if (hotelName) {
            await addDoc(collection(db, 'booked_hotels'), {
                fromDate,
                toDate,
                guestID: currentUser?.uid || '',
                location: hotelLocation,
                hotelName,
                price: Number(price),   
                companyId: Number(companyID)
            });
        }

        if (selectedPlane) {
            await addDoc(collection(db, 'booked_flights'), {
                arrivalCity: selectedPlane.arrivalCity,
                arrivalTime: selectedPlane.arrivalTime,
                availableDate: fromDate,
                companyId: selectedPlane.companyId,
                departureCity: selectedPlane.departureCity,
                departureTime: selectedPlane.departureTime,
                guestID: currentUser?.uid || '',
                ticketPrice: String(selectedPlane.price),
                type: selectedPlane.airline
            });
        }
    };

    // Function to handle card payment confirmation
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
            if (selectedPlane?.id) await updatePlaneSeatCount(selectedPlane.id);
            await storeBookingData();
            setPaymentConfirmed(true);
        } catch (error) {
            alert('Payment failed. Please try again.');
        }
    };

    // Function to handle PayPal payment confirmation
    const handlePaypalConfirm = async () => {
        // Update availability and store booking data
        try {
            if (selectedCar?.id) await markCarAsBooked(selectedCar.id);
            if (hotelId) await markHotelAsBooked(hotelId);
            if (selectedPlane?.id) await updatePlaneSeatCount(selectedPlane.id);
            await storeBookingData();
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

                        {selectedPlane && (
                            <div className={styles.hotelInfoBox}>
                                <h2 className={styles.subheading}>Flight Booking</h2>
                                <p><strong>Flight Number:</strong> {selectedPlane.name}</p>
                                <p><strong>Class:</strong> {selectedPlane.airline}</p>
                                <p><strong>From:</strong> {selectedPlane.departureCity}</p>
                                <p><strong>To:</strong> {selectedPlane.arrivalCity}</p>
                                <p><strong>Departure:</strong> {selectedPlane.departureTime}</p>
                                <p><strong>Arrival:</strong> {selectedPlane.arrivalTime}</p>
                                <p><strong>Duration:</strong> {selectedPlane.duration}</p>
                                <p><strong>Date:</strong> {formatDate(fromDate)}</p>
                                <p><strong>Available Seats:</strong> {selectedPlane.seats}</p>
                                <p><strong>Price:</strong> ${selectedPlane.price}</p>
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
