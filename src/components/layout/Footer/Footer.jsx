import "./Footer.css";
import instagramLogo from "../../../assets/icons/instagram-icon.svg";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer__content">
        {/* LOGO / TITLE */}
        <h2 className="footer__title">F . U . K</h2>

        {/* MIDDLE TEXT */}
        <div className="footer__mid">
          <p className="footer__phrase">TUDO NOSSO, NADA DELES</p>
          <p className="footer__rights">© 2025 — All rights reserved.</p>
        </div>

        {/* SOCIAL */}
        <div className="footer__social">
          <p className="footer__social-label">FOLLOW US</p>
          <img
            src={instagramLogo}
            alt="Instagram"
            className="footer__social-icon"
            onClick={() =>
              window.open("https://www.instagram.com/funk.you.know", "_blank")
            }
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
