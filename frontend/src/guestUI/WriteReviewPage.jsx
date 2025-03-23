// Import necessary libraries and components
import React, { useState } from 'react';
import styles from './WriteReviewPage.module.css';
import Header from './Header';
import Footer from './Footer';

const WriteReviewPage = () => {
    // State variables to store the review title, rating, and description
    const [title, setTitle] = useState('');
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState('');
    
    // Handle the review submission
    const handleSubmit = () => {
        // Log the review data and show a confirmation alert
        console.log({ title, rating, description });
        alert('Review submitted!');
    };

    return (
        // Main container for the review page
        <div className={styles.container}>
            <Header hideTabs={false} />
            <div className={styles.content}>
                <div className={styles.reviewBox}>
                    <h1 className={styles.heading}>Write a Review</h1>
                    <input
                        type="text" // Input field for the review title
                        placeholder="Review Title"
                        value={title} // Binds to title state
                        onChange={(e) => setTitle(e.target.value)} // Update title on change
                        className={styles.inputField}
                    />
                    <div className={styles.ratingContainer}>
                        {/* Generate star rating buttons dynamically */}
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star} // Unique key for each star button
                                className={`${styles.starButton} ${rating >= star ? styles.filledStar : styles.emptyStar}`} 
                                // Conditionally apply filled or empty star styles based on rating
                                onClick={() => setRating(star)} // Set rating when clicked
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    <textarea
                        placeholder="Write your review here..." // Placeholder for the review content
                        value={description} // Binds to description state
                        onChange={(e) => setDescription(e.target.value)} // Update description on change
                        className={styles.textArea}
                    />
                    <div className={styles.buttonContainer}>
                        <button className={styles.cancelButton}>Cancel</button> {/* Cancel button */}
                        <button className={styles.submitButton} onClick={handleSubmit}>Post Review</button> {/* Submit button */}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default WriteReviewPage;
