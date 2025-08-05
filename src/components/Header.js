import React from 'react';
import { WiCloudy } from 'react-icons/wi';
import { IoIosNotificationsOutline } from 'react-icons/io';
import './Header.css';

const avatarUrl = 'https://i.pravatar.cc/40';

const Header = () => {
  return (
    <header className="header-container">
      {/* 👇 Grup baru untuk menyatukan logo dan navigasi */}
      <div className="header-left">
        <div className="logo-container">
          <WiCloudy size={28} className="logo-icon" />
          <h1 className="logo-text">WeatherWise</h1>
        </div>

        <nav className="nav-links">
          <a href="#dashboard" className="nav-link">Dashboard</a>
          <a href="#history" className="nav-link">History</a>
          <a href="#settings" className="nav-link">Settings</a>
        </nav>
      </div>

      <div className="user-actions">
        <IoIosNotificationsOutline size={24} className="notification-icon" />
        <img src={avatarUrl} alt="User Avatar" className="user-avatar" />
      </div>
    </header>
  );
};

export default Header;