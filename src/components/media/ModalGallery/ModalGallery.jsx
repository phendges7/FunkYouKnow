import { useEffect, useRef, useState } from "react";
import "./ModalGallery.css";

const ModalGallery = ({ photos, index, onClose, onNavigate }) => {
  const [direction, setDirection] = useState("right");
  const [scale, setScale] = useState(1);
  const [autoPlay, setAutoPlay] = useState(false);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const touchStartX = useRef(null);
  const dragStart = useRef(null);

  /* =============================== */
  /*          AUTO-PLAY             */
  /* =============================== */
  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => handleNavigate(1), 3500);
      return () => clearInterval(interval);
    }
  }, [autoPlay, index]);

  /* =============================== */
  /*   ESC + KEYBOARD NAVIGATION     */
  /* =============================== */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNavigate(1);
      if (e.key === "ArrowLeft") handleNavigate(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /* =============================== */
  /*          NAVIGATION             */
  /* =============================== */
  const handleNavigate = (step) => {
    setDirection(step > 0 ? "right" : "left");
    resetZoom();
    onNavigate(step);
  };

  /* =============================== */
  /*              ZOOM               */
  /* =============================== */
  const resetZoom = () => {
    setScale(1);
    setDrag({ x: 0, y: 0 });
  };

  /* =============================== */
  /*         MOBILE SWIPE            */
  /* =============================== */
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;

    if (deltaX > 60) handleNavigate(-1);
    if (deltaX < -60) handleNavigate(1);

    touchStartX.current = null;
  };

  /* =============================== */
  /*          THUMBNAILS             */
  /* =============================== */
  const handleThumbnailClick = (i) => {
    setDirection(i > index ? "right" : "left");
    resetZoom();
    onNavigate(i - index);
  };

  if (!photos?.length) return null;

  return (
    <div className="gallery-modal" onClick={onClose}>
      <div
        className="gallery-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="gallery-modal__img-wrapper"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            key={index}
            src={photos[index]}
            alt="Foto"
            className={`gallery-modal__image slide-${direction}`}
            style={{
              transform: `scale(${scale}) translate(${drag.x / scale}px, ${
                drag.y / scale
              }px)`,
            }}
          />
        </div>
        {/* CLOSE */}
        <button className="gallery-modal__close" onClick={onClose}>
          ✕
        </button>

        {/* THUMBNAILS */}
        <div className="gallery-modal__thumbnails">
          {photos.map((p, i) => (
            <img
              key={i}
              src={p}
              className={`gallery-modal__thumb ${i === index ? "active" : ""}`}
              onClick={() => handleThumbnailClick(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalGallery;
