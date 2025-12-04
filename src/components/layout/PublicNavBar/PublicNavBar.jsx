import { Link } from "react-router-dom";
import "./PublicNavBar.css";

const Navbar = ({ onLoginClick, onNavigate }) => {
  return (
    <nav className="nav">
      <Link to="/" className="nav__item" onClick={onNavigate}>
        Home
      </Link>
      <Link to="/events" className="nav__item" onClick={onNavigate}>
        Events
      </Link>
      <Link to="/request-song" className="nav__item" onClick={onNavigate}>
        Request a Song
      </Link>
      <Link to="/about" className="nav__item" onClick={onNavigate}>
        About
      </Link>
      <Link to="/contact-us" className="nav__item" onClick={onNavigate}>
        Contact Us
      </Link>
    </nav>
  );
};

export default Navbar;
