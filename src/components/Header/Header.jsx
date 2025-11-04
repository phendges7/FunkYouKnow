import "./Header.css";
import { useNavigate } from "react-router-dom";

import Navbar from "../NavBar/NavBar";
import Logo from "../../assets/logos/NoBGLogo.png";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="header">
      <img
        className="header__logo"
        src={Logo}
        alt="Funk You Know Logo"
        onClick={() => navigate("/")}
      />
      <Navbar />
    </header>
  );
};
export default Header;
