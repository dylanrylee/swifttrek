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

        const matchesText = `${flight.flightNumber} ${flight.departureCity} ${flight.arrivalCity} ${flight.type}`.toLowerCase().includes(query);
        const matchesMin = minPrice ? flight.ticketPrice >= parseFloat(minPrice) : true;
        const matchesMax = maxPrice ? flight.ticketPrice <= parseFloat(maxPrice) : true;
        const hasSeats = flight.availableSeats > 0;

        return matchesText && matchesMin && matchesMax && hasSeats;
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
        if (!selectedFlight) return;
        navigate('/payment-checkout', {
            state: {
                flight: selectedFlight,
                ticketPrice: selectedFlight.ticketPrice
            }
        });
    };

    const handleWriteReviewClick = () => {
        if (!selectedFlight) return;
        navigate('/write-review', {
            state: {
                flightId: selectedFlight.id,
                flightNumber: selectedFlight.flightNumber,
                type: selectedFlight.type,
                departureCity: selectedFlight.departureCity,
                arrivalCity: selectedFlight.arrivalCity
            }
        });
    };

    const handleViewReviewsClick = () => {
        if (!selectedFlight) return;
        navigate(`/reviews/${selectedFlight.id}`);
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
                            placeholder="Search by flight number, city, or type"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                        <table className={styles.flightTable}>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Flight No.</th>
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
                                {filteredFlights.map((flight) => (
                                    <tr key={flight.id}>
                                        <td>
                                            {flight.imageUrl && (
                                                <img
                                                    src={flight.imageUrl}
                                                    alt={flight.flightNumber}
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
                                ))}
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
                                        alt={selectedFlight.flightNumber}
                                        className={styles.carImage}
                                    />
                                )}
                                <p><strong>Type:</strong> {selectedFlight.type}</p>
                                <p><strong>From:</strong> {selectedFlight.departureCity}</p>
                                <p><strong>To:</strong> {selectedFlight.arrivalCity}</p>
                                <p><strong>Departure:</strong> {selectedFlight.departureTime}</p>
                                <p><strong>Arrival:</strong> {selectedFlight.arrivalTime}</p>
                                <p><strong>Duration:</strong> {selectedFlight.duration}</p>
                                <p><strong>Available Seats:</strong> {selectedFlight.availableSeats}</p>
                                <p><strong>Price:</strong> ${selectedFlight.ticketPrice}</p>
                                <div className={styles.buttonContainer}>
                                    <button className={styles.rentButton} onClick={handleBookClick}>
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
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BookFlightPage;
