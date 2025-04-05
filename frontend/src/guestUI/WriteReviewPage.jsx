import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import styles from './WriteReviewPage.module.css';
import Header from './Header';
import Footer from './Footer';

const WriteReviewPage = () => {
    const locationHook = useLocation();
    // Expecting car details including carID to be passed in the state
    const { model, type, location: carLocation, carID } = locationHook.state || {};

    const [title, setTitle] = useState('');
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState('');
    const maxCharacters = 200;

    // Handle changes to the review description with a character limit
    const handleDescriptionChange = (e) => {
        const input = e.target.value;
        if (input.length <= maxCharacters) {
            setDescription(input);
        }
    };

    // Submit review to Firestore
    const handleSubmit = async () => {
        // Replace this with the actual guestID (e.g., from your auth context)
        const guestID = 'guest123';
        try {
            await addDoc(collection(db, 'reviewed_cars'), {
                carID: carID || 'unknown',
                description,
                guestID,
                // Store the rating as a fraction string (e.g., "3/5")
                ratings: `${rating}/5`
            });
            alert('Review submitted successfully!');
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

                    {/* Display Car Information if available */}
                    {model && type && carLocation && (
                        <div className={styles.carInfoBox}>
                            <p><strong>Car Model:</strong> {model}</p>
                            <p><strong>Car Type:</strong> {type}</p>
                            <p><strong>Location:</strong> {carLocation}</p>
                        </div>
                    )}

                    {/* Review Title */}
                    <input
                        type="text"
                        placeholder="Review Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.inputField}
                    />

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

                    {/* Review Description */}
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
                        <button className={styles.cancelButton}>Cancel</button>
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
