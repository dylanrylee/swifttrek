import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import styles from './ViewFlightReviewPage.module.css';
import Header from './Header';
import Footer from './Footer';

const ViewFlightReviewPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [flightDetails, setFlightDetails] = useState(null);
    const { companyId } = useParams();

    useEffect(() => {
        const fetchFlightDetails = async () => {
            try {
                // Fetch flight details from the flights collection
                const flightsQuery = query(
                    collection(db, 'flights'),
                    where('companyId', '==', companyId)
                );
                
                const flightsSnapshot = await getDocs(flightsQuery);
                if (!flightsSnapshot.empty) {
                    // Get the first flight with this companyId
                    const flightData = flightsSnapshot.docs[0].data();
                    setFlightDetails({
                        flightNumber: flightData.flightNumber,
                        departureCity: flightData.departureCity,
                        arrivalCity: flightData.arrivalCity,
                        companyName: flightData.companyName || 'Airline Company'
                    });
                }
            } catch (err) {
                console.error('Error fetching flight details:', err);
            }
        };

        const fetchReviews = async () => {
            try {
                setLoading(true);
                console.log('Fetching reviews for company ID:', companyId);
                
                const reviewsQuery = query(
                    collection(db, 'reviewed_flights'),
                    where('companyId', '==', companyId)
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
                console.error('Error fetching flight reviews:', err);
                setError('Failed to load reviews. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (companyId) {
            fetchFlightDetails();
            fetchReviews();
        } else {
            setError('No company ID provided');
            setLoading(false);
        }
    }, [companyId]);

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
                <h1 className={styles.title}>Flight Reviews</h1>
                
                {flightDetails && (
                    <div className={styles.itemDetails}>
                        <h2>{flightDetails.companyName}</h2>
                        <p><strong>Flight Number:</strong> {flightDetails.flightNumber}</p>
                        <p><strong>From:</strong> {flightDetails.departureCity}</p>
                        <p><strong>To:</strong> {flightDetails.arrivalCity}</p>
                    </div>
                )}
                
                {loading ? (
                    <div className={styles.loading}>Loading reviews...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : reviews.length === 0 ? (
                    <div className={styles.noReviews}>No reviews available for this flight company.</div>
                ) : (
                    <div className={styles.reviewsContainer}>
                        {reviews.map(review => (
                            <div key={review.id} className={styles.reviewCard}>
                                <div className={styles.reviewHeader}>
                                    <div className={styles.ratingContainer}>
                                        {review.rating && renderStars(review.rating)}
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

export default ViewFlightReviewPage; 