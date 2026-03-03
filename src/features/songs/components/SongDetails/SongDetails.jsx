import "./SongDetails.css";
import SongLinkModal from "../SongLinkModal/SongLinkModal";
import { useState } from "react";

const SongDetails = ({ song, onRemove, removing = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (!song) return null;

  const { title, artist, link, like_count } = song;

  const handleOpenModal = () => {
    if (!link) return;
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <article className="song-details">
        <header className="song-details__header">
          <div className="song-details__info">
            <h2 className="song-details__title">{title}</h2>
            {artist && <p className="song-details__artist">{artist}</p>}
          </div>
          <div className="song-details__likes">
            <span className="song-card__like-count">{like_count}</span>
            {/* SVG inline controlado por classe */}
            <svg
              className={"song-details__like-icon"}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-label="Like this song"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 
              5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 
              1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
          </div>
        </header>

        <div className="song-details__body">
          {link ? (
            <>
              <button
                type="button"
                className="song-details__link"
                onClick={handleOpenModal}
              >
                Open Song Link
              </button>
              {onRemove && (
                <button
                  type="button"
                  className="song-details__remove"
                  onClick={onRemove}
                  disabled={removing}
                >
                  {removing ? "Removing..." : "Remove Song"}
                </button>
              )}
            </>
          ) : (
            <p className="song-details__no-link">
              No link available for this song.
            </p>
          )}
        </div>
      </article>
      <SongLinkModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        songTitle={title}
        songArtist={artist}
        songLink={link}
      />
    </>
  );
};

export default SongDetails;
