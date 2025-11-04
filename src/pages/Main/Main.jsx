import { useNavigate } from "react-router-dom";

import RequestedSongs from "../../components/RequestedSongs/RequestedSongs";
import "./Main.css";

const Main = () => {
  const navigate = useNavigate();
  return (
    <div className="main">
      <div className="main__content">
        <h1 className="main__title">FUNK YOU KNOW</h1>
        <h3 className="main__subtitle">
          Discover the ultimate music experience
        </h3>
        <p className="main__description">
          Join us on a journey through sound and rhythm.
        </p>
        <div className="main__buttons">
          <button className="main__button" onClick={() => navigate("/")}>
            BUY TICKETS
          </button>
          <button
            className="main__button"
            onClick={() => navigate("/request-song")}
          >
            REQUEST A SONG
          </button>
        </div>
      </div>
      <RequestedSongs />
    </div>
  );
};

export default Main;
