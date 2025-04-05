import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import styles from './PlaneBookingPage.module.css';
import Header from './Header';
import Footer from './Footer';

const BookFlightPage = () => {
    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'flights'));
                const flightList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFlights(flightList);
            } catch (error) {
                console.error('Error fetching flights:', error);
            }
        };

        fetchFlights();
    }, []);

    const filteredFlights = flights.filter((flight) => {
        const query = searchQuery.toLowerCase();

        const matchesSearch =
            flight.flightNumber.toLowerCase().includes(query) ||
            flight.departureCity.toLowerCase().includes(query) ||
            flight.arrivalCity.toLowerCase().includes(query) ||
            (flight.type && flight.type.toLowerCase().includes(query));

        const matchesPrice =
            (minPrice ? flight.ticketPrice >= parseFloat(minPrice) : true) &&
            (maxPrice ? flight.ticketPrice <= parseFloat(maxPrice) : true);

        return matchesSearch && matchesPrice;
    });

    const handleDetailsClick = (flight) => {
        setSelectedFlight(flight);
        setShowDetails(true);
    };

    const handleClosePopup = () => {
        setSelectedFlight(null);
        setShowDetails(false);
    };

    const handleBookClick = () => {
        navigate('/payment-checkout', { state: { flight: selectedFlight } });
    };

    const handleWriteReviewClick = () => {
        navigate('/write-review');
    };

    return (
        <div className={styles.container}>
            <Header hideTabs={false} />
            <div className={styles.content}>
                <div className={styles.whiteBox}>
                    <h1 className={styles.heading}>Book a Flight</h1>

                    <div className={styles.searchBarContainer}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by flight number, city, or type..."
                            className={styles.searchBar}
                        />
                    </div>

                    <div className={styles.priceFilterContainer}>
                        <label>Min Price: </label>
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="Min Price"
                            className={styles.priceInput}
                        />
                        <label>Max Price: </label>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Max Price"
                            className={styles.priceInput}
                        />
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.flightTable}>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Flight Number</th>
                                    <th>Type</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Departure</th>
                                    <th>Duration</th>
                                    <th>Seats</th>
                                    <th>Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFlights.length > 0 ? (
                                    filteredFlights.map((flight) => (
                                        <tr key={flight.id}>
                                            <td>
                                                {flight.imageUrl && (
                                                    <img
                                                        src={flight.imageUrl}
                                                        alt={`Flight ${flight.flightNumber}`}
                                                        className={styles.thumbnail}
                                                    />
                                                )}
                                            </td>
                                            <td>{flight.flightNumber}</td>
                                            <td>{flight.type}</td>
                                            <td>{flight.departureCity}</td>
                                            <td>{flight.arrivalCity}</td>
                                            <td>{flight.departureTime}</td>
                                            <td>{flight.duration}</td>
                                            <td>{flight.availableSeats}</td>
                                            <td>${flight.ticketPrice}</td>
                                            <td>
                                                <button
                                                    className={styles.detailsButton}
                                                    onClick={() => handleDetailsClick(flight)}
                                                >
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" style={{ textAlign: 'center' }}>
                                            No flights match your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {showDetails && selectedFlight && (
                        <div className={styles.popup}>
                            <div className={styles.popupContent}>
                                <h2>Flight {selectedFlight.flightNumber} Details</h2>
                                {selectedFlight.imageUrl && (
                                    <img
                                        src={selectedFlight.imageUrl}
                                        alt={`Flight ${selectedFlight.flightNumber}`}
                                        className={styles.carImage}
                                    />
                                )}
                                <p><strong>Company ID:</strong> {selectedFlight.companyId}</p>
                                <p><strong>Type:</strong> {selectedFlight.type}</p>
                                <p><strong>Departure City:</strong> {selectedFlight.departureCity}</p>
                                <p><strong>Departure Time:</strong> {selectedFlight.departureTime}</p>
                                <p><strong>Arrival City:</strong> {selectedFlight.arrivalCity}</p>
                                <p><strong>Arrival Time:</strong> {selectedFlight.arrivalTime}</p>
                                <p><strong>Duration:</strong> {selectedFlight.duration}</p>
                                <p><strong>Available Seats:</strong> {selectedFlight.availableSeats}</p>
                                <p><strong>Ticket Price:</strong> ${selectedFlight.ticketPrice}</p>
                                <div className={styles.buttonContainer}>
                                    <button
                                        className={styles.rentButton}
                                        onClick={handleBookClick}
                                        disabled={selectedFlight.availableSeats === 0}
                                    >
                                        {selectedFlight.availableSeats === 0 ? 'Sold Out' : 'Book'}
                                    </button>
                                    <button className={styles.cancelButton} onClick={handleClosePopup}>
                                        Cancel
                                    </button>
                                </div>
                                <h3>Reviews</h3>
                                <div className={styles.reviewsSection}>
                                    <p>No reviews yet.</p>
                                    <button className={styles.writeReviewButton} onClick={handleWriteReviewClick}>
                                        Write a Review
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

export default BookFlightPage;
