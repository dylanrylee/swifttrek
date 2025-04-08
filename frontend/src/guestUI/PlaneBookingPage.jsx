import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Header from './Header';
import Footer from './Footer';
import styles from './PlaneBookingPage.module.css';

const PlaneBookingPage = () => {
    const [planes, setPlanes] = useState([]);
    const [selectedPlane, setSelectedPlane] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showBookingPopup, setShowBookingPopup] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const navigate = useNavigate();

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchPlanes = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'planes'));
                const planeList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPlanes(planeList);
            } catch (error) {
                console.error('Error fetching planes:', error);
            }
        };
        fetchPlanes();
    }, []);

    const filteredPlanes = planes.filter((plane) => {
        const query = searchQuery.toLowerCase();
        const matchesText =
            plane.flightNumber.toLowerCase().includes(query) ||
            plane.departureLocation.toLowerCase().includes(query) ||
            plane.arrivalLocation.toLowerCase().includes(query);
        const price = parseFloat(plane.price);
        const matchesMin = minPrice ? price >= parseFloat(minPrice) : true;
        const matchesMax = maxPrice ? price <= parseFloat(maxPrice) : true;
        const isAvailable = plane.availability === 'Available';
        return matchesText && matchesMin && matchesMax && isAvailable;
    });

    const handleDetailsClick = (plane) => {
        setSelectedPlane(plane);
        setShowDetails(true);
    };

    const handleClosePopup = () => {
        setSelectedPlane(null);
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
                flightNumber: selectedPlane.flightNumber,
                seatNumber: selectedPlane.seatNumber,
                price: selectedPlane.price,
                availability: selectedPlane.availability,
                planeId: selectedPlane.id,
                fromDate,
                toDate,
                departure: selectedPlane.departureLocation,
                arrival: selectedPlane.arrivalLocation,
                companyID: selectedPlane.companyId
            }
        });
    };

    return (
        <div className={styles.container}>
            <Header hideTabs={false} />
            <div className={styles.content}>
                <div className={styles.whiteBox}>
                    <h1 className={styles.heading}>Plane Bookings</h1>

                    <div className={styles.searchBarContainer}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by flight number or location..."
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
                                    <th>Flight</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Price</th>
                                    <th>Availability</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPlanes.length > 0 ? (
                                    filteredPlanes.map((plane) => (
                                        <tr key={plane.id}>
                                            <td>
                                                {plane.imageUrl && (
                                                    <img
                                                        src={plane.imageUrl}
                                                        alt={plane.flightNumber}
                                                        className={styles.thumbnail}
                                                    />
                                                )}
                                            </td>
                                            <td>{plane.flightNumber}</td>
                                            <td>{plane.departureLocation}</td>
                                            <td>{plane.arrivalLocation}</td>
                                            <td>${plane.price}</td>
                                            <td>{plane.availability ?? 'N/A'}</td>
                                            <td>
                                                <button
                                                    className={styles.detailsButton}
                                                    onClick={() => handleDetailsClick(plane)}
                                                >
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center' }}>
                                            No flights match your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {showDetails && selectedPlane && (
                        <div className={styles.popup}>
                            <div className={styles.popupContent}>
                                <h2>{selectedPlane.flightNumber}</h2>
                                {selectedPlane.imageUrl && (
                                    <img
                                        src={selectedPlane.imageUrl}
                                        alt={selectedPlane.flightNumber}
                                        className={styles.hotelImage}
                                    />
                                )}
                                <p><strong>From:</strong> {selectedPlane.departureLocation}</p>
                                <p><strong>To:</strong> {selectedPlane.arrivalLocation}</p>
                                <p><strong>Price:</strong> ${selectedPlane.price}</p>
                                <p><strong>Availability:</strong> {selectedPlane.availability ?? 'N/A'}</p>

                                <div className={styles.buttonContainer}>
                                    <button className={styles.bookButtonGreen} onClick={handleBookClick}>
                                        Book
                                    </button>
                                    <button className={styles.cancelButton} onClick={handleClosePopup}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showBookingPopup && (
                        <div className={styles.popup}>
                            <div className={styles.popupContent}>
                                <h2>Booking Dates for {selectedPlane?.flightNumber}</h2>
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

export default PlaneBookingPage;
