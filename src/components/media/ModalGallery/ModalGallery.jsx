import { useEffect, useMemo, useRef, useState } from "react";
import "./ModalGallery.css";

const normalizeMediaItem = (item, i) => {
  // legacy string URL
  if (typeof item === "string") {
    return {
      id: `legacy-${i}`,
      public_url: item,
      thumb_url: item,
      alt: `Photo ${i + 1}`,
    };
  }

  // event_media object
  return {
    id: item?.id ?? `media-${i}`,
    public_url: item?.public_url ?? "",
    thumb_url: item?.thumb_url ?? item?.public_url ?? "",
    alt: item?.alt ?? `Thumbnail ${i + 1}`,
  };
};

const ModalGallery = ({ photos, index = 0, onClose, onNavigate }) => {
  const [direction, setDirection] = useState("right");
  const [scale, setScale] = useState(1);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const touchStartX = useRef(null);

  const media = useMemo(() => {
    if (!Array.isArray(photos) || photos.length === 0) return [];
    return photos
      .map((item, i) => normalizeMediaItem(item, i))
      .filter((m) => !!m.public_url);
  }, [photos]);

  const [currentIndex, setCurrentIndex] = useState(index);
  const thumbnailsRef = useRef(null);

  // sync local index with parent index
  useEffect(() => {
    setCurrentIndex(index);
  }, [index]);

  const resetZoom = () => {
    setScale(1);
    setDrag({ x: 0, y: 0 });
  };

  const handleNavigate = (step) => {
    setDirection(step > 0 ? "right" : "left");
    resetZoom();
    onNavigate?.(step);
  };

  /* =============================== */
  /*   ESC + KEYBOARD NAVIGATION     */
  /* =============================== */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowRight") handleNavigate(1);
      if (e.key === "ArrowLeft") handleNavigate(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =============================== */
  /*         MOBILE SWIPE            */
  /* =============================== */
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;

    if (deltaX > 60) handleNavigate(-1);
    if (deltaX < -60) handleNavigate(1);

    touchStartX.current = null;
  };

  /* =============================== */
  /*        ACTIVE THUMBNAIL         */
  /* =============================== */
  useEffect(() => {
    const activeThumb = thumbnailsRef.current?.children?.[currentIndex];
    activeThumb?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [currentIndex]);

  /* =============================== */
  /*          THUMBNAILS             */
  /* =============================== */
  const handleThumbnailClick = (i) => {
    setDirection(i > currentIndex ? "right" : "left");
    resetZoom();

    // local highlight
    setCurrentIndex(i);

    // parent navigation (source of truth)
    const step = i - index;
    if (step !== 0) onNavigate?.(step);
  };

  if (!media.length) return null;

  const active = media[currentIndex] ?? media[0];

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
            key={active.id}
            src={active.public_url}
            alt={active.alt || "Picture"}
            className={`gallery-modal__image slide-${direction}`}
            style={{
              transform: `scale(${scale}) translate(${drag.x / scale}px, ${drag.y / scale}px)`,
            }}
          />
        </div>

        {/* CLOSE */}
        <button
          className="gallery-modal__close"
          onClick={onClose}
          type="button"
        >
          ✕
        </button>

        {/* THUMBNAILS */}
        <div className="gallery-modal__thumbnails-carousel" ref={thumbnailsRef}>
          {media.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={`gallery-modal__thumbnail ${
                i === currentIndex ? "gallery-modal__thumbnail--active" : ""
              }`}
              onClick={() => handleThumbnailClick(i)}
              aria-label={`Open image ${i + 1}`}
            >
              <img
                src={item.thumb_url || item.public_url}
                alt={item.alt || `Thumbnail ${i + 1}`}
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalGallery;
