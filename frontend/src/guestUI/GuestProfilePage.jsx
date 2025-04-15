import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import {
    collection,
    getDocs,
    query,
    where,
    deleteDoc,
    doc,
    getDoc
} from 'firebase/firestore';
import { updatePassword as updateAuthPassword } from 'firebase/auth';
import styles from './GuestProfilePage.module.css';
import Header from './Header';
import Footer from './Footer';

const GuestProfilePage = () => {
    const [email, setEmail] = useState('');
    const [planeBookings, setPlaneBookings] = useState([]);
    const [hotelBookings, setHotelBookings] = useState([]);
    const [carBookings, setCarBookings] = useState([]);
    const [flightReviews, setFlightReviews] = useState([]);
    const [hotelReviews, setHotelReviews] = useState([]);
    const [carReviews, setCarReviews] = useState([]);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const navigate = useNavigate();

    const fetchPlaneBookings = async (userId) => {
        const snapshot = await getDocs(query(collection(db, 'booked_flights'), where('guestID', '==', userId)));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'plane' }));
    };

    const fetchHotelBookings = async (userId) => {
        const snapshot = await getDocs(query(collection(db, 'booked_hotels'), where('guestID', '==', userId)));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'hotel' }));
    };

    const fetchCarBookings = async (userId) => {
        const snapshot = await getDocs(query(collection(db, 'booked_cars'), where('guestID', '==', userId)));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'car' }));
    };

    const fetchReviews = async (userId) => {
        try {
            // Fetch flight reviews
            const flightReviewsQuery = query(
                collection(db, 'reviewed_flights'),
                where('guestID', '==', userId)
            );
            const flightReviewsSnapshot = await getDocs(flightReviewsQuery);
            const flightReviewsData = await Promise.all(flightReviewsSnapshot.docs.map(async doc => {
                const reviewData = doc.data();
                
                // Fetch flight details using companyId
                let flightDetails = {};
                if (reviewData.companyId) {
                    const flightDoc = await getDocs(query(collection(db, 'flights'), where('companyId', '==', reviewData.companyId)));
                    if (!flightDoc.empty) {
                        flightDetails = flightDoc.docs[0].data();
                    }
                }
                
                return {
                    id: doc.id,
                    ...reviewData,
                    type: 'flight',
                    itemDetails: {
                        flightNumber: flightDetails.flightNumber || 'N/A',
                        departureCity: flightDetails.departureCity || 'N/A',
                        arrivalCity: flightDetails.arrivalCity || 'N/A',
                        companyName: flightDetails.companyName || 'N/A'
                    }
                };
            }));
            setFlightReviews(flightReviewsData);

            // Fetch hotel reviews
            const hotelReviewsQuery = query(
                collection(db, 'reviewed_hotels'),
                where('guestID', '==', userId)
            );
            const hotelReviewsSnapshot = await getDocs(hotelReviewsQuery);
            const hotelReviewsData = await Promise.all(hotelReviewsSnapshot.docs.map(async doc => {
                const reviewData = doc.data();
                
                // Fetch hotel details using hotelId
                let hotelDetails = {};
                if (reviewData.hotelId) {
                    const hotelDoc = await getDocs(query(collection(db, 'hotels'), where('hotelId', '==', reviewData.hotelId)));
                    if (!hotelDoc.empty) {
                        hotelDetails = hotelDoc.docs[0].data();
                    }
                }
                
                return {
                    id: doc.id,
                    ...reviewData,
                    type: 'hotel',
                    itemDetails: {
                        hotelName: hotelDetails.hotelName || 'N/A',
                        location: hotelDetails.location || 'N/A',
                        roomType: hotelDetails.roomType || 'N/A'
                    }
                };
            }));
            setHotelReviews(hotelReviewsData);

            // Fetch car reviews
            const carReviewsQuery = query(
                collection(db, 'reviewed_cars'),
                where('guestID', '==', userId)
            );
            const carReviewsSnapshot = await getDocs(carReviewsQuery);
            const carReviewsData = await Promise.all(carReviewsSnapshot.docs.map(async doc => {
                const reviewData = doc.data();
                
                // Fetch car details using carId
                let carDetails = {};
                if (reviewData.carId) {
                    const carDoc = await getDocs(query(collection(db, 'cars'), where('carId', '==', reviewData.carId)));
                    if (!carDoc.empty) {
                        carDetails = carDoc.docs[0].data();
                    }
                }
                
                return {
                    id: doc.id,
                    ...reviewData,
                    type: 'car',
                    itemDetails: {
                        model: carDetails.model || 'N/A',
                        type: carDetails.type || 'N/A',
                        location: carDetails.location || 'N/A'
                    }
                };
            }));
            setCarReviews(carReviewsData);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleDelete = async (type, id) => {
        const collectionName = {
            plane: 'booked_flights',
            hotel: 'booked_hotels',
            car: 'booked_cars'
        }[type];

        try {
            await deleteDoc(doc(db, collectionName, id));
            if (type === 'plane') setPlaneBookings(prev => prev.filter(b => b.id !== id));
            if (type === 'hotel') setHotelBookings(prev => prev.filter(b => b.id !== id));
            if (type === 'car') setCarBookings(prev => prev.filter(b => b.id !== id));
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    const handleDeleteReview = async (type, id) => {
        const collectionName = {
            flight: 'reviewed_flights',
            hotel: 'reviewed_hotels',
            car: 'reviewed_cars'
        }[type];

        try {
            await deleteDoc(doc(db, collectionName, id));
            if (type === 'flight') setFlightReviews(prev => prev.filter(r => r.id !== id));
            if (type === 'hotel') setHotelReviews(prev => prev.filter(r => r.id !== id));
            if (type === 'car') setCarReviews(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/guest-login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            return;
        }

        try {
            const user = auth.currentUser;
            await updateAuthPassword(user, newPassword);
            setPasswordSuccess('Password updated successfully');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Error updating password:', error);
            setPasswordError('Failed to update password. Please try again.');
        }
    };

    const handleProfileUpdate = (e) => {
        e.preventDefault();
    };

    useEffect(() => {
        const fetchData = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            setEmail(currentUser.email);
            const uid = currentUser.uid;

            try {
                const [planes, hotels, cars] = await Promise.all([
                    fetchPlaneBookings(uid),
                    fetchHotelBookings(uid),
                    fetchCarBookings(uid)
                ]);
                setPlaneBookings(planes);
                setHotelBookings(hotels);
                setCarBookings(cars);
                await fetchReviews(uid);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const renderBookings = (bookings, type) => {
        if (bookings.length === 0) return <p>No {type} bookings found.</p>;

        return (
            <ul className={styles.bookingList}>
                {bookings.map(b => (
                    <li key={b.id}>
                        <div>
                            {type === 'plane' && (
                                <>
                                    <strong>Flight Details:</strong><br />
                                    <strong>From:</strong> {b.departureCity} at {b.departureTime}<br />
                                    <strong>To:</strong> {b.arrivalCity} at {b.arrivalTime}<br />
                                    <strong>Date:</strong> {b.availableDate}<br />
                                    <strong>Class:</strong> {b.type}<br />
                                    <strong>Price:</strong> ${b.ticketPrice}
                                </>
                            )}
                            {type === 'hotel' && (
                                <>
                                    <strong>Hotel Details:</strong><br />
                                    <strong>Hotel:</strong> {b.hotelName}<br />
                                    <strong>Location:</strong> {b.hotelLocation}<br />
                                    <strong>Check-in:</strong> {b.fromDate}<br />
                                    <strong>Check-out:</strong> {b.toDate}<br />
                                    <strong>Price:</strong> ${b.hotelPrice}
                                </>
                            )}
                            {type === 'car' && (
                                <>
                                    <strong>Car Details:</strong><br />
                                    <strong>Car:</strong> {b.carName}<br />
                                    <strong>Pick-up:</strong> {b.fromDate}<br />
                                    <strong>Return:</strong> {b.toDate}<br />
                                    <strong>Price:</strong> ${b.carPrice}
                                </>
                            )}
                        </div>
                        <button onClick={() => handleDelete(type, b.id)} className={styles.deleteButton}>
                            Cancel Booking
                        </button>
                    </li>
                ))}
            </ul>
        );
    };

    const renderReviews = (reviews, type) => {
        if (reviews.length === 0) return <p>No {type} reviews found.</p>;

        return (
            <ul className={styles.bookingList}>
                {reviews.map(review => (
                    <li key={review.id}>
                        <div>
                            {type === 'flight' && review.itemDetails && (
                                <>
                                    <strong>Flight Details:</strong><br />
                                    <strong>Flight Number:</strong> {review.itemDetails.flightNumber}<br />
                                    <strong>From:</strong> {review.itemDetails.departureCity}<br />
                                    <strong>To:</strong> {review.itemDetails.arrivalCity}<br />
                                    <strong>Rating:</strong> {review.rating}<br />
                                    <strong>Review:</strong> {review.description}
                                </>
                            )}
                            {type === 'hotel' && review.itemDetails && (
                                <>
                                    <strong>Hotel Details:</strong><br />
                                    <strong>Hotel:</strong> {review.itemDetails.hotelName}<br />
                                    <strong>Location:</strong> {review.itemDetails.location}<br />
                                    <strong>Room Type:</strong> {review.itemDetails.roomType}<br />
                                    <strong>Rating:</strong> {review.rating}<br />
                                    <strong>Review:</strong> {review.description}
                                </>
                            )}
                            {type === 'car' && review.itemDetails && (
                                <>
                                    <strong>Car Details:</strong><br />
                                    <strong>Car Model:</strong> {review.itemDetails.model}<br />
                                    <strong>Type:</strong> {review.itemDetails.type}<br />
                                    <strong>Location:</strong> {review.itemDetails.location}<br />
                                    <strong>Rating:</strong> {review.ratings}<br />
                                    <strong>Review:</strong> {review.description}
                                </>
                            )}
                        </div>
                        <button 
                            onClick={() => handleDeleteReview(type, review.id)} 
                            className={styles.deleteButton}
                        >
                            Delete Review
                        </button>
                    </li>
                ))}
            </ul>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className={styles.profileSection}>
                        <h2>Profile Information</h2>
                        <form onSubmit={handleProfileUpdate} className={styles.profileForm}>
                            <div className={styles.formGroup}>
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={profileData.firstName}
                                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={profileData.lastName}
                                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className={styles.input}
                                />
                            </div>
                            <button type="submit" className={styles.updateButton}>Update Profile</button>
                        </form>
                    </div>
                );
            case 'password':
                return (
                    <div className={styles.passwordSection}>
                        <h2>Change Password</h2>
                        <form onSubmit={handlePasswordChange} className={styles.passwordForm}>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={styles.passwordInput}
                            />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={styles.passwordInput}
                            />
                            <button type="submit" className={styles.changePasswordButton}>
                                Change Password
                            </button>
                            {passwordError && <div className={styles.error}>{passwordError}</div>}
                            {passwordSuccess && <div className={styles.success}>{passwordSuccess}</div>}
                        </form>
                    </div>
                );
            case 'bookings':
                return (
                    <div className={styles.bookingsSection}>
                        <h2>My Bookings</h2>
                        <div className={styles.bookingsContainer}>
                            <div className={styles.bookingType}>
                                <h3>Flight Bookings</h3>
                                {renderBookings(planeBookings, 'plane')}
                            </div>
                            <div className={styles.bookingType}>
                                <h3>Hotel Bookings</h3>
                                {renderBookings(hotelBookings, 'hotel')}
                            </div>
                            <div className={styles.bookingType}>
                                <h3>Car Bookings</h3>
                                {renderBookings(carBookings, 'car')}
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <Header hideTabs={false} />

            <div className={styles.content}>
                <h1>Guest Profile</h1>
                <p><strong>Email:</strong> {email}</p>

                <div className={styles.passwordSection}>
                    <h2>Change Password</h2>
                    <div className={styles.passwordForm}>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={styles.passwordInput}
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={styles.passwordInput}
                        />
                        <button 
                            onClick={handlePasswordChange}
                            className={styles.changePasswordButton}
                        >
                            Change Password
                        </button>
                        {passwordError && <p className={styles.error}>{passwordError}</p>}
                        {passwordSuccess && <p className={styles.success}>{passwordSuccess}</p>}
                    </div>
                </div>

                <h2>Your Reviews</h2>
                <h3>Flight Reviews</h3>
                {renderReviews(flightReviews, 'flight')}

                <h3>Hotel Reviews</h3>
                {renderReviews(hotelReviews, 'hotel')}

                <h3>Car Reviews</h3>
                {renderReviews(carReviews, 'car')}

                <h2>Flight Bookings</h2>
                {renderBookings(planeBookings, 'plane')}

                <h2>Hotel Bookings</h2>
                {renderBookings(hotelBookings, 'hotel')}

                <h2>Car Bookings</h2>
                {renderBookings(carBookings, 'car')}
            </div>

            <div className={styles.logoutSection}>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    Logout
                </button>
            </div>

            <Footer />
        </div>
    );
};

export default GuestProfilePage;
