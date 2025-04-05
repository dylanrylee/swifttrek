import React, { useState } from 'react';
import styles from './WriteReviewPage.module.css';
import Header from './Header';
import Footer from './Footer';

const WriteReviewPage = () => {
    const [title, setTitle] = useState('');
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState('');
    const maxCharacters = 200;

    // Handle description change with character limit
    const handleDescriptionChange = (e) => {
        const input = e.target.value;
        
        if (input.length <= maxCharacters) {
            setDescription(input);
        }
    };

    // Handle form submission
    const handleSubmit = () => {
        console.log({ title, rating, description });
        alert('Review submitted!');
    };

    return (
        <div className={styles.container}>
            <Header hideTabs={false} />
            <div className={styles.content}>
                <div className={styles.reviewBox}>
                    <h1 className={styles.heading}>Write a Review</h1>

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
                        <button className={styles.submitButton} onClick={handleSubmit}>Post Review</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default WriteReviewPage;
