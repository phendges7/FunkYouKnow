import "./SongCard.css";
import { useState, useRef, useEffect } from "react";

const SongCard = ({ id, rank, title, artist, likes, onLike }) => {
  const titleRef = useRef(null);
  const artistRef = useRef(null);
  const [liked, setLiked] = useState(false);

  const handleLikeClick = () => {
    setLiked(!liked);
    onLike(id, likes);
  };

  useEffect(() => {
    const checkOverflow = (el) => el.scrollWidth > el.clientWidth;

    if (titleRef.current && checkOverflow(titleRef.current)) {
      titleRef.current.classList.add("scrolling-text");
    }

    if (artistRef.current && checkOverflow(artistRef.current)) {
      artistRef.current.classList.add("scrolling-text");
    }
  }, []);

  return (
    <div className="song-card">
      <div className="song-card__content">
        <div className="song-card__rank">#{rank}</div>

        <div className="song-card__info">
          <p className="song-card__name" ref={titleRef}>
            {title}
          </p>
          {artist && (
            <p className="song-card__artist" ref={artistRef}>
              {artist}
            </p>
          )}
        </div>

        <div className="song-card__likes">
          {/* SVG inline controlado por classe */}
          <svg
            className={`like-icon ${liked ? "like-icon--active" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            onClick={handleLikeClick}
            aria-label="Like this song"
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 
              5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 
              1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            />
          </svg>

          <span className="song-card__like-count">{likes}</span>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
