import React, { useEffect, useState } from 'react';
import styles from './PlaneBookingPage.module.css';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const PlaneBookingPage = () => {
    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
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
                console.error('Error fetching flights: ', error);
            }
        };
        fetchFlights();
    }, []);

    const filteredFlights = flights.filter((flight) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = flight.flightNumber?.toLowerCase().includes(query) ||
                              flight.departureCity?.toLowerCase().includes(query);
        const price = parseFloat(flight.ticketPrice);
        const matchesMinPrice = minPrice === '' || price >= parseFloat(minPrice);
        const matchesMaxPrice = maxPrice === '' || price <= parseFloat(maxPrice);
        const hasAvailableSeats = typeof flight.availableSeats === 'number' && flight.availableSeats > 0;

        return matchesSearch && matchesMinPrice && matchesMaxPrice && hasAvailableSeats;
    });

    const handleDetailsClick = (flight) => {
        setSelectedFlight(flight);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedFlight(null);
    };

    const handleBookClick = () => {
        if (!selectedFlight) return;
        navigate('/payment-checkout', {
            state: {
                selectedPlane: {
                    id: selectedFlight.id,
                    name: selectedFlight.flightNumber,
                    airline: selectedFlight.type || 'Economy',
                    seats: selectedFlight.availableSeats,
                    price: selectedFlight.ticketPrice,
                    companyId: selectedFlight.companyId,
                    departureCity: selectedFlight.departureCity,
                    arrivalCity: selectedFlight.arrivalCity,
                    departureTime: selectedFlight.departureTime,
                    arrivalTime: selectedFlight.arrivalTime,
                    duration: selectedFlight.duration
                },
                fromDate: selectedFlight.availableDate,
                toDate: selectedFlight.availableDate
            }
        });
    };

    const handleWriteReviewClick = () => {
        if (!selectedFlight) return;
        navigate('/write-review', {
            state: {
                flightId: selectedFlight.id,
                flightNumber: selectedFlight.flightNumber,
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
                    <h1 className={styles.heading}>Plane Bookings</h1>

                    <div className={styles.centeredContent}>
                        <div className={styles.searchBarContainer}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by flight number or departure city..."
                                className={styles.searchInput}
                            />
                            <div className={styles.priceFilterContainer}>
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
                                        <th>Flight</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Price</th>
                                        <th>Available Seats</th>
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
                                                            alt={flight.flightNumber}
                                                            className={styles.thumbnail}
                                                        />
                                                    )}
                                                </td>
                                                <td>{flight.flightNumber}</td>
                                                <td>{flight.departureCity}</td>
                                                <td>{flight.arrivalCity}</td>
                                                <td>${flight.ticketPrice}</td>
                                                <td>{flight.availableSeats}</td>
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
                                            <td colSpan="7" style={{ textAlign: 'center' }}>
                                                No flights match your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {showPopup && selectedFlight && (
                        <div className={styles.popup}>
                            <div className={styles.popupContent}>
                                <img
                                    src={selectedFlight.imageUrl}
                                    alt={selectedFlight.flightNumber}
                                    className={styles.carImage}
                                />
                                <h2>{selectedFlight.flightNumber}</h2>
                                <p>From: {selectedFlight.departureCity}</p>
                                <p>To: {selectedFlight.arrivalCity}</p>
                                <p>Departure Time: {selectedFlight.departureTime}</p>
                                <p>Arrival Time: {selectedFlight.arrivalTime}</p>
                                <p>Duration: {selectedFlight.duration}</p>
                                <p>Price: ${selectedFlight.ticketPrice}</p>
                                <p>Available Seats: {selectedFlight.availableSeats}</p>
                                <div className={styles.buttonContainer}>
                                    <button className={styles.rentButton} onClick={handleBookClick}>
                                        Book Now
                                    </button>
                                    <button className={styles.cancelButton} onClick={handleClosePopup}>
                                        Close
                                    </button>
                                </div>
                                <div className={styles.reviewSection}>
                                    <button className={styles.writeReviewButton} onClick={handleWriteReviewClick}>
                                        Write Review
                                    </button>
                                    <button className={styles.viewReviewButton} onClick={handleViewReviewsClick}>
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

export default PlaneBookingPage;
