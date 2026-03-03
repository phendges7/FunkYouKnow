import { useEffect } from "react";
import "./SongLinkModal.css";

const SongLinkModal = ({
  isOpen,
  onClose,
  songTitle,
  songArtist,
  songLink,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!songLink) return;
    window.open(songLink, "_blank", "noopener,noreferrer");
    onClose();
  };

  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("song-link-modal")) {
      onClose();
    }
  };

  // ESC fecha o modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="song-link-modal"
      role="dialog"
      aria-modal="true"
      onMouseDown={handleBackdropClick}
    >
      <div className="song-link-modal__content">
        <header className="song-link-modal__header">
          <h2 className="song-link-modal__title">Open song link?</h2>
          <button
            type="button"
            className="song-link-modal__close"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </header>

        <div className="song-link-modal__body">
          {songTitle && (
            <p className="song-link-modal__song">
              <span className="song-link-modal__label">Song:</span>{" "}
              <span className="song-link-modal__strong">{songTitle}</span>
            </p>
          )}

          {songArtist && (
            <p className="song-link-modal__song">
              <span className="song-link-modal__label">Artist:</span>{" "}
              <span className="song-link-modal__strong">{songArtist}</span>
            </p>
          )}

          <p className="song-link-modal__text">
            You are about to open the following link.
          </p>
          <p className="song-link-modal__text">
            Please confirm it looks trustworthy before proceeding:
          </p>

          <div className="song-link-modal__link-box">
            <span className="song-link-modal__link-url">{songLink}</span>
          </div>
        </div>

        <footer className="song-link-modal__footer">
          <button
            type="button"
            className="song-link-modal__button song-link-modal__button--secondary"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="song-link-modal__button song-link-modal__button--primary"
            onClick={handleConfirm}
          >
            Abrir em nova aba
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SongLinkModal;
