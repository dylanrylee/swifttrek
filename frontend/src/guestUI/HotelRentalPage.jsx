import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import styles from './HotelRentalPage.module.css';
import Header from './Header';
import Footer from './Footer';

const HotelRentalPage = () => {
    const [hotels, setHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'hotels'));
                const hotelList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setHotels(hotelList);
            } catch (error) {
                console.error('Error fetching hotels:', error);
            }
        };

        fetchHotels();
    }, []);

    const handleDetailsClick = (hotel) => {
        setSelectedHotel(hotel);
        setShowDetails(true);
    };

    const handleClosePopup = () => {
        setSelectedHotel(null);
        setShowDetails(false);
    };

    const handleBookClick = () => {
        navigate('/payment-checkout');
    };

    return (
        <div className={styles.container}>
            <Header hideTabs={false} />
            <div className={styles.content}>
                <div className={styles.whiteBox}>
                    <h1 className={styles.heading}>Hotel Rentals</h1>
                    <div className={styles.tableContainer}>
                        <table className={styles.hotelTable}>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Location</th>
                                    <th>Price/Night</th>
                                    <th>Rating</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hotels.map((hotel) => (
                                    <tr key={hotel.id}>
                                        <td>
                                            {hotel.imageUrl && (
                                                <img
                                                    src={hotel.imageUrl}
                                                    alt={hotel.name}
                                                    className={styles.thumbnail}
                                                />
                                            )}
                                        </td>
                                        <td>{hotel.hotelName}</td>
                                        <td>{hotel.location}</td>
                                        <td>${hotel.price}</td>
                                        <td>{hotel.rating ?? 'N/A'} / 5</td>
                                        <td>
                                            <button
                                                className={styles.detailsButton}
                                                onClick={() => handleDetailsClick(hotel)}
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {showDetails && selectedHotel && (
                        <div className={styles.popup}>
                            <div className={styles.popupContent}>
                                <h2>{selectedHotel.name}</h2>
                                {selectedHotel.imageUrl && (
                                    <img
                                        src={selectedHotel.imageUrl}
                                        alt={selectedHotel.name}
                                        className={styles.hotelImage}
                                    />
                                )}
                                <p><strong>Location:</strong> {selectedHotel.location}</p>
                                <p><strong>Price per Night:</strong> ${selectedHotel.price}</p>
                                <p><strong>Rating:</strong> {selectedHotel.rating ?? 'N/A'} / 5</p>
                                <p><strong>Amenities:</strong> {selectedHotel.amenities ?? 'Not listed'}</p>
                                <div className={styles.buttonContainer}>
                                    <button className={styles.bookButton} onClick={handleBookClick}>
                                        Book Now
                                    </button>
                                    <button className={styles.cancelButton} onClick={handleClosePopup}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HotelRentalPage;
