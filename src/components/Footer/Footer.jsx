import "./Footer.css";
import instagramLogo from "../../assets/logos/instagram-icon.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__grid-info">
          <h2>F . U . K</h2>
        </div>
        <div className="footer__grid-links">
          <a href="" className="footer__grid-link">
            WHAT IS F.U.K
          </a>
          <a href="" className="footer__grid-link">
            REQUEST A SONG
          </a>
          <a href="" className="footer__grid-link">
            CONTACT US
          </a>
        </div>
        <div className="footer__grid-social">
          FOLLOW US
          <img
            src={instagramLogo}
            alt="Instagram Logo"
            className="footer__grid-social-icon"
            onClick={() =>
              window.open("https://www.instagram.com/funk.you.know", "_blank")
            }
          />
        </div>
      </div>
      <div className="footer__bottom">
        <p>© 2025 F.U.K - All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
