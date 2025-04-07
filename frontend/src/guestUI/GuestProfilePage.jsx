import React, { useEffect, useState } from 'react';
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

    const fetchPlaneBookings = async (userId) => {
        const snapshot = await getDocs(query(collection(db, 'planeBookings'), where('userID', '==', userId)));
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
            plane: 'planeBookings',
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

    return (
        <div className={styles.container}>
            <Header hideTabs={false} />
            <div className={styles.content}>
                <h1>Guest Profile</h1>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Password:</strong> ******</p>

                <h2>Plane Bookings</h2>
                {planeBookings.length === 0 ? (
                    <p>No plane bookings found.</p>
                ) : (
                    <ul className={styles.bookingList}>
                        {planeBookings.map(b => (
                            <li key={b.id}>
                                <strong>{b.flightNumber}</strong> — {b.departureCity} to {b.arrivalCity} on {b.departureDate}
                                <button onClick={() => handleDelete('plane', b.id)} className={styles.deleteButton}>Delete</button>
                            </li>
                        ))}
                    </ul>
                )}

                <h2>Hotel Bookings</h2>
                {hotelBookings.length === 0 ? (
                    <p>No hotel bookings found.</p>
                ) : (
                    <ul className={styles.bookingList}>
                        {hotelBookings.map(b => (
                            <li key={b.id}>
                                <strong>{b.hotelName}</strong> in {b.hotelLocation} from {b.fromDate} to {b.toDate} — ${b.hotelPrice}
                                <button onClick={() => handleDelete('hotel', b.id)} className={styles.deleteButton}>Delete</button>
                            </li>
                        ))}
                    </ul>
                )}

                <h2>Car Bookings</h2>
                {carBookings.length === 0 ? (
                    <p>No car bookings found.</p>
                ) : (
                    <ul className={styles.bookingList}>
                        {carBookings.map(b => (
                            <li key={b.id}>
                                <strong>{b.carName}</strong> from {b.fromDate} to {b.toDate} — ${b.carPrice}
                                <button onClick={() => handleDelete('car', b.id)} className={styles.deleteButton}>Delete</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default GuestProfilePage;
