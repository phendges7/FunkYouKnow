const EventGallerySection = ({
  sentinelRef,
  shouldRender,
  status,
  items,
  onOpenModal,
}) => {
  return (
    <>
      {/* Sentinel triggers gallery load */}
      <div
        ref={sentinelRef}
        className="event-gallery__sentinel"
        aria-hidden="true"
      />

      {shouldRender && (
        <section className="event-gallery">
          <h2 className="event-gallery__title">Gallery</h2>

          {status === "loading" && (
            <div className="event-gallery__loading">Loading photos…</div>
          )}

          {status === "error" && (
            <div className="event-gallery__error">
              Couldn&apos;t load the gallery right now.
            </div>
          )}

          {status === "loaded" && items.length > 0 && (
            <div className="event-gallery__grid">
              {items.map((item, index) => (
                <img
                  key={item.full}
                  src={item.thumb}
                  alt={item.alt || `Photo ${index + 1}`}
                  className="event-gallery__img"
                  onClick={() => onOpenModal(index)}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
          )}

          {status === "loaded" && items.length === 0 && (
            <div className="event-gallery__empty">No photos yet.</div>
          )}
        </section>
      )}
    </>
  );
};

export default EventGallerySection;
