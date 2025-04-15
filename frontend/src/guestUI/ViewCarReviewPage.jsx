import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import styles from './ViewCarReviewPage.module.css';
import Header from './Header';
import Footer from './Footer';

const ViewCarReviewPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [carDetails, setCarDetails] = useState(null);
    
    // Access the passed state from the navigate function
    const location = useLocation();
    const { carId, model, type, location: carLocation } = location.state || {};

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                console.log('Fetching reviews for car ID:', carId);
                
                const reviewsQuery = query(
                    collection(db, 'reviewed_cars'),
                    where('carId', '==', carId)
                );
                
                const querySnapshot = await getDocs(reviewsQuery);
                const reviewsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                console.log('Found reviews:', reviewsData);
                setReviews(reviewsData);
                setError(null);
            } catch (err) {
                console.error('Error fetching car reviews:', err);
                setError('Failed to load reviews. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (carId) {
            fetchReviews();
        } else {
            setError('No car ID provided');
            setLoading(false);
        }
    }, [carId]);

    const renderStars = (rating) => {
        if (!rating) return null;
        
        const ratingValue = parseInt(rating.split('/')[0]);
        const maxRating = parseInt(rating.split('/')[1]);
        
        return (
            <div className={styles.starsContainer}>
                {[...Array(maxRating)].map((_, index) => (
                    <span 
                        key={index} 
                        className={`${styles.star} ${index < ratingValue ? styles.filled : ''}`}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <h1 className={styles.title}>Car Reviews</h1>
                
                {carDetails && (
                    <div className={styles.itemDetails}>
                        <h2>{model}</h2>
                        <p><strong>Type:</strong> {type}</p>
                        <p><strong>Location:</strong> {carLocation}</p>
                    </div>
                )}
                
                {loading ? (
                    <div className={styles.loading}>Loading reviews...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : reviews.length === 0 ? (
                    <div className={styles.noReviews}>No reviews available for this car.</div>
                ) : (
                    <div className={styles.reviewsContainer}>
                        {reviews.map(review => (
                            <div key={review.id} className={styles.reviewCard}>
                                <div className={styles.reviewHeader}>
                                    <div className={styles.ratingContainer}>
                                        {review.ratings && renderStars(review.ratings)}
                                    </div>
                                </div>
                                <div className={styles.reviewBody}>
                                    <p className={styles.reviewText}>
                                        {review.description || 'No description provided.'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ViewCarReviewPage;
