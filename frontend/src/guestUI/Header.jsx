import React from 'react';
import './Header.css'; 

const Header = () => {
    return (
        <header className="header">
            <h1 className="title">Travel Planner Website</h1>
            <nav className="nav">
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#profile">Profile</a></li>
                    <li><a href="#settings">Settings</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;