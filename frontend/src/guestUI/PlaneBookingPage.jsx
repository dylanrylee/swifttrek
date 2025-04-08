import React, { useEffect, useState } from 'react';
import styles from './PlaneBookingPage.module.css';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import Header from './Header';
import Footer from './Footer';

const PlaneBookingPage = () => {
    const [planes, setPlanes] = useState([]);
    const [selectedPlane, setSelectedPlane] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        const fetchPlanes = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'planes'));
                const planeData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPlanes(planeData);
            } catch (error) {
                console.error('Error fetching planes: ', error);
            }
        };
        fetchPlanes();
    }, []);

    const handleDetailsClick = (plane) => {
        setSelectedPlane(plane);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedPlane(null);
    };

    const filteredPlanes = planes.filter((plane) => {
        const matchesSearch = plane.flightNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              plane.departureLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              plane.arrivalLocation?.toLowerCase().includes(searchQuery.toLowerCase());

        const price = parseFloat(plane.price);
        const meetsMinPrice = minPrice === '' || price >= parseFloat(minPrice);
        const meetsMaxPrice = maxPrice === '' || price <= parseFloat(maxPrice);

        return matchesSearch && meetsMinPrice && meetsMaxPrice;
    });

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
                                placeholder="Search by flight number or location..."
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
                    </div>

                    {showPopup && selectedPlane && (
                        <div className={styles.popup}>
                            <div className={styles.popupContent}>
                                <img
                                    src={selectedPlane.imageUrl}
                                    alt={selectedPlane.flightNumber}
                                    className={styles.carImage}
                                />
                                <h2>{selectedPlane.flightNumber}</h2>
                                <p>From: {selectedPlane.departureLocation}</p>
                                <p>To: {selectedPlane.arrivalLocation}</p>
                                <p>Price: ${selectedPlane.price}</p>
                                <p>Availability: {selectedPlane.availability ?? 'N/A'}</p>
                                <div className={styles.buttonContainer}>
                                    <button className={styles.rentButton}>Book Now</button>
                                    <button className={styles.cancelButton} onClick={handleClosePopup}>Close</button>
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
