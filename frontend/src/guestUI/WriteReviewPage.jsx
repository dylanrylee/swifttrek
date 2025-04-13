import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import styles from './WriteReviewPage.module.css';
import Header from './Header';
import Footer from './Footer';

const WriteReviewPage = () => {
    const locationHook = useLocation();
    const navigate = useNavigate();

    // Grab car, hotel, and flight values from route state
    const {
        model, type, location: carLocation, carId,
        hotelName, roomType, location: hotelLocation, hotelId,
        flightNumber, departureCity, arrivalCity, flightId, companyId
    } = locationHook.state || {};

    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState('');
    const maxCharacters = 200;

    const handleDescriptionChange = (e) => {
        const input = e.target.value;
        if (input.length <= maxCharacters) {
            setDescription(input);
        }
    };

    const handleSubmit = async () => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
            alert('User is not authenticated.');
            return;
        }

        const guestID = currentUser.uid;
        const formattedRating = `${rating}/5`;

        try {
            if (carId) {
                // Submit car review
                await addDoc(collection(db, 'reviewed_cars'), {
                    carId,
                    guestID,
                    description,
                    ratings: formattedRating
                });
            } else if (hotelId) {
                // Submit hotel review
                await addDoc(collection(db, 'reviewed_hotels'), {
                    hotelId,
                    guestID,
                    description,
                    rating: formattedRating
                });
            } else if (flightId) {
                // Submit flight review
                await addDoc(collection(db, 'reviewed_flights'), {
                    flightId,
                    companyId,
                    guestID,
                    description,
                    rating: formattedRating
                });
            } else {
                alert('No valid car, hotel, or flight ID provided.');
                return;
            }

            alert('Review posted!');
            navigate('/guest-home');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review.');
        }
    };

    return (
        <div className={styles.container}>
            <Header hideTabs={false} />
            <div className={styles.content}>
                <div className={styles.reviewBox}>
                    <h1 className={styles.heading}>Write a Review</h1>

                    {/* Car Info */}
                    {model && type && carLocation && (
                        <div className={styles.carInfoBox}>
                            <p><strong>Car Model:</strong> {model}</p>
                            <p><strong>Car Type:</strong> {type}</p>
                            <p><strong>Location:</strong> {carLocation}</p>
                        </div>
                    )}

                    {/* Hotel Info */}
                    {hotelName && roomType && hotelLocation && (
                        <div className={styles.carInfoBox}>
                            <p><strong>Hotel Name:</strong> {hotelName}</p>
                            <p><strong>Room Type:</strong> {roomType}</p>
                            <p><strong>Location:</strong> {hotelLocation}</p>
                        </div>
                    )}

                    {/* Flight Info */}
                    {flightNumber && departureCity && arrivalCity && (
                        <div className={styles.carInfoBox}>
                            <p><strong>Flight Number:</strong> {flightNumber}</p>
                            <p><strong>From:</strong> {departureCity}</p>
                            <p><strong>To:</strong> {arrivalCity}</p>
                        </div>
                    )}

                    {/* Rating Stars */}
                    <div className={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                className={`${styles.starButton} ${rating >= star ? styles.filledStar : styles.emptyStar}`}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    {/* Review Text */}
                    <textarea
                        placeholder="Write your review here..."
                        value={description}
                        onChange={handleDescriptionChange}
                        className={styles.textArea}
                    />

                    {/* Character Counter */}
                    <div className={`${styles.charCounter} ${description.length === maxCharacters ? styles.warningText : ''}`}>
                        {maxCharacters - description.length} characters remaining
                    </div>

                    {/* Buttons */}
                    <div className={styles.buttonContainer}>
                        <button
                            className={styles.cancelButton}
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                        <button className={styles.submitButton} onClick={handleSubmit}>
                            Post Review
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default WriteReviewPage;
