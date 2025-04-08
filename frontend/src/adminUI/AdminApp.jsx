import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './adminUI/AuthContext';
import PrivateRoute from './adminUI/PrivateRoute';
import AdminNavbar from './components/AdminNavbar';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './adminUI/AdminLogin';

// Guest Components
import SelectAccountType from './guestUI/SelectAccountType';
import GuestLogin from './guestUI/GuestLogin';
import GuestHomePage from './guestUI/GuestHomePage';
import PaymentCheckout from './guestUI/PaymentCheckout';
import WriteReviewPage from './guestUI/WriteReviewPage';
import CarRentalPage from './guestUI/CarRentalPage';

// Business Listings Components
import BusinessListings from './components/BusinessListings'; // Selection page for business listings
import BusinessCars from './components/BusinessCars';
import BusinessHotels from './components/BusinessHotels';
import BusinessFlights from './components/BusinessFlights';

// Customer Listings Components
import CustomerListings from './adminUI/CustomerListings'; // Selection page for customer listings
import CustomerCars from './adminUI/CustomerCars';
import CustomerHotels from './adminUI/CustomerHotels';
import CustomerFlights from './adminUI/CustomerFlights';

// Other admin pages
import AdminUsers from './components/AdminUsers';

import './admin.module.css';

const AdminApp = () => {
  return (
    <AuthProvider>
      <div className="admin-app">
        <AdminNavbar />
        <div className="admin-content">
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

              {/* User Management Route */}
              <Route path="/users" element={<AdminUsers />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/admin-dashboard" />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
};

export default AdminApp;
