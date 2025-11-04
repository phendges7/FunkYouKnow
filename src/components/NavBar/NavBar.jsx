import { useNavigate } from "react-router-dom";
import "./NavBar.css";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="nav">
      <button className="nav__item" onClick={() => navigate("/events")}>
        EVENTS
      </button>
      <button className="nav__item" onClick={() => navigate("/request-song")}>
        REQUEST A SONG
      </button>
    </nav>
  );
};

export default Navbar;
