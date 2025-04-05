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
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    const [minPrice, setMinPrice] = useState(''); // State for min price input
    const [maxPrice, setMaxPrice] = useState(''); // State for max price input
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

    // Filter hotels based on search query and price range
    const filteredHotels = hotels.filter((hotel) => {
        const lowerCaseSearchQuery = searchQuery.toLowerCase();

        // Check if the hotel matches the search query
        const matchesSearchQuery =
            hotel.hotelName.toLowerCase().includes(lowerCaseSearchQuery) ||
            hotel.location.toLowerCase().includes(lowerCaseSearchQuery) ||
            (hotel.amenities && hotel.amenities.toLowerCase().includes(lowerCaseSearchQuery));

        // Check if the hotel matches the price range
        const matchesPriceRange =
            (minPrice ? hotel.price >= parseFloat(minPrice) : true) &&
            (maxPrice ? hotel.price <= parseFloat(maxPrice) : true);

        return matchesSearchQuery && matchesPriceRange;
    });

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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); // Update the search query state
    };

    const handleMinPriceChange = (e) => {
        setMinPrice(e.target.value); // Update the min price state
    };

    const handleMaxPriceChange = (e) => {
        setMaxPrice(e.target.value); // Update the max price state
    };

    return (
        <div className={styles.container}>
            <Header hideTabs={false} />
            <div className={styles.content}>
                <div className={styles.whiteBox}>
                    <h1 className={styles.heading}>Hotel Rentals</h1>

                    {/* Search Bar */}
                    <div className={styles.searchBarContainer}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search by name, location, or amenities..."
                            className={styles.searchBar}
                        />
                    </div>

                    {/* Price Range Filter */}
                    <div className={styles.priceFilterContainer}>
                        <input
                            type="number"
                            value={minPrice}
                            onChange={handleMinPriceChange}
                            placeholder="Min Price"
                            className={styles.priceInput}
                        />
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={handleMaxPriceChange}
                            placeholder="Max Price"
                            className={styles.priceInput}
                        />
                    </div>

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
