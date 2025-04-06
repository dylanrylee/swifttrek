import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SelectAccountType from './guestUI/SelectAccountType';
import GuestLogin from './guestUI/GuestLogin';
import GuestHomePage from './guestUI/GuestHomePage';
import PaymentCheckout from './guestUI/PaymentCheckout';
import WriteReviewPage from './guestUI/WriteReviewPage';
import CarRentalPage from './guestUI/CarRentalPage';
import AdminLogin from './adminUI/AdminLogin';
import AdminDashboard from './adminUI/AdminDashboard';
import AdminApprovals from './adminUI/AdminApprovals';
import AdminUsers from './adminUI/AdminUsers';
import ContentModeration from './adminUI/ContentModeration';
import AdminChatbox from './adminUI/AdminChatbox'; // Corrected import name

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Guest Routes */}
                    <Route path="/" element={<SelectAccountType />} />
                    <Route path="/guest-login" element={<GuestLogin />} />
                    <Route path="/guest-home" element={<GuestHomePage />} />
                    <Route path="/payment-checkout" element={<PaymentCheckout />} />
                    <Route path="/write-review" element={<WriteReviewPage />} />
                    <Route path="/car-rental" element={<CarRentalPage />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/approvals" element={<AdminApprovals />} />
                    <Route path="/admin/moderation" element={<ContentModeration />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/chatbox" element={<AdminChatbox />} /> {/* Corrected route */}
                    
                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;