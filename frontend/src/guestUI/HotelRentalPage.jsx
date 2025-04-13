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
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showBookingPopup, setShowBookingPopup] = useState(false); // Add state for booking popup
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const navigate = useNavigate();

    const today = new Date().toISOString().split('T')[0]; // Set minimum date to today

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

    const filteredHotels = hotels.filter((hotel) => {
        const query = searchQuery.toLowerCase();
        const matchesText =
            hotel.hotelName.toLowerCase().includes(query) ||
            hotel.location.toLowerCase().includes(query);
        const price = parseFloat(hotel.price);
        const matchesMin = minPrice ? price >= parseFloat(minPrice) : true;
        const matchesMax = maxPrice ? price <= parseFloat(maxPrice) : true;
        const isAvailable = hotel.availability === 'Available';
        return matchesText && matchesMin && matchesMax && isAvailable;
    });

    const handleDetailsClick = (hotel) => {
        setSelectedHotel(hotel);
        setShowDetails(true);
    };

    const handleClosePopup = () => {
        setSelectedHotel(null);
        setShowDetails(false);
        setShowBookingPopup(false);
        setFromDate('');
        setToDate('');
    };

    const handleBookClick = () => {
        setShowBookingPopup(true);
    };

    const handleConfirmBooking = () => {
        navigate('/payment-checkout', {
            state: {
                hotelName: selectedHotel.hotelName,
                roomNumber: selectedHotel.roomNumber,
                price: selectedHotel.price,
                availability: selectedHotel.availability,
                hotelId: selectedHotel.id, 
                fromDate,
                toDate,
                hotelLocation: selectedHotel.location,
                companyID: selectedHotel.companyId
            }
        });
    };
    
    const handleWriteReviewClick = () => {
        if (!selectedHotel) return;
        navigate('/write-review', {
            state: {
                hotelId: selectedHotel.id,
                hotelName: selectedHotel.hotelName,
                location: selectedHotel.location,
                roomType: selectedHotel.roomType // make sure this key exists in Firestore
            }
        });        
    };

    const handleViewReviewsClick = () => {
        if (!selectedHotel) return;
        navigate(`/view-hotel-reviews/${selectedHotel.id}`);
    };

    return (
        <div className={styles.container}>
            <Header hideTabs={false} />
            <div className={styles.content}>
                <div className={styles.whiteBox}>
                    <h1 className={styles.heading}>Hotel Rentals</h1>

                    <div className={styles.searchBarContainer}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or location..."
                            className={styles.searchInput}
                        />
                        <div className={styles.priceInputs}>
                            <input
                                type="number"
                                placeholder="Min Price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className={styles.priceInput}
                            />
                            <input
                                type="number"
                                placeholder="Max Price"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className={styles.priceInput}
                            />
                        </div>
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.carTable}>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Location</th>
                                    <th>Price/Night</th>
                                    <th>Availability</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHotels.length > 0 ? (
                                    filteredHotels.map((hotel) => (
                                        <tr key={hotel.id}>
                                            <td>
                                                {hotel.imageUrl && (
                                                    <img
                                                        src={hotel.imageUrl}
                                                        alt={hotel.hotelName}
                                                        className={styles.thumbnail}
                                                    />
                                                )}
                                            </td>
                                            <td>{hotel.hotelName}</td>
                                            <td>{hotel.location}</td>
                                            <td>${hotel.price}</td>
                                            <td>{hotel.availability ?? 'N/A'}</td>
                                            <td>
                                                <button
                                                    className={styles.detailsButton}
                                                    onClick={() => handleDetailsClick(hotel)}
                                                >
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>
                                            No hotels match your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {showDetails && selectedHotel && (
                        <div className={styles.popup}>
                            <div className={styles.popupContent}>
                                <h2>{selectedHotel.hotelName}</h2>
                                {selectedHotel.imageUrl && (
                                    <img
                                        src={selectedHotel.imageUrl}
                                        alt={selectedHotel.hotelName}
                                        className={styles.hotelImage}
                                    />
                                )}
                                <p><strong>Location:</strong> {selectedHotel.location}</p>
                                <p><strong>Price per Night:</strong> ${selectedHotel.price}</p>
                                <p><strong>Availability:</strong> {selectedHotel.availability ?? 'N/A'}</p>
                                
                                <div className={styles.buttonContainer}>
                                    <button className={styles.bookButtonGreen} onClick={handleBookClick}>
                                        Book
                                    </button>
                                    <button className={styles.cancelButton} onClick={handleClosePopup}>
                                        Cancel
                                    </button>
                                </div>

                                <div className={styles.reviewSection}>
                                    <button className={styles.yellowButton} onClick={handleWriteReviewClick}>
                                        Write Review
                                    </button>
                                    <button className={styles.yellowButton} onClick={handleViewReviewsClick}>
                                        View Reviews
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Booking Popup */}
                    {showBookingPopup && (
                        <div className={styles.popup}>
                            <div className={styles.popupContent}>
                                <h2>Booking Dates for {selectedHotel?.hotelName}</h2>
                                <label>
                                    From Date:
                                    <input
                                        type="date"
                                        min={today}
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                    />
                                </label>
                                <br />
                                <label>
                                    To Date:
                                    <input
                                        type="date"
                                        min={fromDate || today}
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                    />
                                </label>
                                <br />
                                <div className={styles.buttonContainer}>
                                    <button
                                        className={styles.confirmButton}
                                        onClick={handleConfirmBooking}
                                        disabled={!fromDate || !toDate}
                                    >
                                        Confirm Booking
                                    </button>
                                    <button
                                        className={styles.cancelButton1}
                                        onClick={() => setShowBookingPopup(false)}
                                    >
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
