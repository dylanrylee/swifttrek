import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import {
    collection,
    getDocs,
    query,
    where,
    deleteDoc,
    doc
} from 'firebase/firestore';
import styles from './GuestProfilePage.module.css';
import Header from './Header';
import Footer from './Footer';

const GuestProfilePage = () => {
    const [email, setEmail] = useState('');
    const [planeBookings, setPlaneBookings] = useState([]);
    const [hotelBookings, setHotelBookings] = useState([]);
    const [carBookings, setCarBookings] = useState([]);
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

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/guest-login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
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
            } catch (error) {
                console.error('Error fetching bookings:', error);
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

    const renderContent = () => (
        <div className={styles.container}>
            <Header hideTabs={false} />

            <div className={styles.content}>
                <h1>Guest Profile</h1>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Password:</strong> ******</p>

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

    return renderContent();
};

export default GuestProfilePage;
