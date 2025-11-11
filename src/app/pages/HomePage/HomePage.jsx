import { useNavigate } from "react-router-dom";

import SongList from "../../../features/songs/components/SongList/SongList";
import usePageFade from "../../../utils/usePageFade";

import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  usePageFade();

  return (
    <main className="home">
      <div className="home__content">
        <h1 className="home__title">FUNK YOU KNOW</h1>
        <h3 className="home__subtitle">
          Discover the ultimate music experience
        </h3>
        <p className="home__description">
          Join us on a journey through sound and rhythm.
        </p>

        <div className="home__buttons">
          <button className="home__button button" onClick={() => navigate("/")}>
            BUY TICKETS
          </button>
          <button
            className="home__button button"
            onClick={() => navigate("/request-song")}
          >
            REQUEST A SONG
          </button>
        </div>
      </div>

      <SongList />
    </main>
  );
};

export default HomePage;
