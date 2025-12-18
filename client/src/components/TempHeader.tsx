import './TempHeader.css';
// import { FaBell } from 'react-icons/fa'; 
import logoImage from '../assets/alu-logo.png'; 
import profileImage from '../assets/senku.jpg'; 

function Header() {
  return (
    <header className="header-canvas"> 
      <div className="header-container">
        <div className="logo-section">
          <img src={logoImage} alt="ALU-TUCP Medical Center Logo" className="logo-image" />
        </div>

        <div className="user-section">
          <div className="notification-icon">
        </div>
        <div className="profile-info">
          <span className="user-name">Dr. Senku Ishigami</span>
          <div className="user-details">
            <span className="user-id">40xxi</span>
            <span className="user-role">icoxxi</span>
          </div>
        </div>
        <div className="profile-pic-container">
            <img src={profileImage} alt="User Profile" className="profile-picture" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;