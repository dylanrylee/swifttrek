import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './adminUI/AuthContext';
import PrivateRoute from './adminUI/PrivateRoute';

// Guest Components
import SelectAccountType from './guestUI/SelectAccountType';
import GuestLogin from './guestUI/GuestLogin';
import GuestHomePage from './guestUI/GuestHomePage';
import PaymentCheckout from './guestUI/PaymentCheckout';
import WriteReviewPage from './guestUI/WriteReviewPage';
import CarRentalPage from './guestUI/CarRentalPage';

// Admin Components
import AdminLogin from './adminUI/AdminLogin';
import AdminDashboard from './adminUI/AdminDashboard';
import AdminUsers from './adminUI/AdminUsers';

// Business Listings Components
import BusinessListings from './adminUI/BusinessListings'; // Selection page for business listings
import BusinessCars from './adminUI/BusinessCars';
import BusinessHotels from './adminUI/BusinessHotels';
import BusinessFlights from './adminUI/BusinessFlights';

// Customer Listings Components
import CustomerListings from './adminUI/CustomerListings'; // Selection page for customer listings
import CustomerCars from './adminUI/CustomerCars';
import CustomerHotels from './adminUI/CustomerHotels';
import CustomerFlights from './adminUI/CustomerFlights';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Guest Routes */}
            <Route path="/" element={<SelectAccountType />} />
            <Route path="/guest-login" element={<GuestLogin />} />
            <Route path="/guest-home" element={<GuestHomePage />} />
            <Route path="/payment-checkout" element={<PaymentCheckout />} />
            <Route path="/write-review" element={<WriteReviewPage />} />
            <Route path="/car-rental" element={<CarRentalPage />} />

            {/* Admin Public Route */}
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />


              {/* Business Listings Routes */}
              <Route path="/admin/business" element={<BusinessListings />} />
              <Route path="/admin/business/cars" element={<BusinessCars />} />
              <Route path="/admin/business/hotels" element={<BusinessHotels />} />
              <Route path="/admin/business/flights" element={<BusinessFlights />} />

              {/* Customer Listings Routes */}
              <Route path="/admin/customer" element={<CustomerListings />} />
              <Route path="/admin/customer/cars" element={<CustomerCars />} />
              <Route path="/admin/customer/hotels" element={<CustomerHotels />} />
              <Route path="/admin/customer/flights" element={<CustomerFlights />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/admin-dashboard" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
