import "./EventGalleryPreview.css";

const EventGalleryPreview = ({ items = [], onDelete, deletingId = null }) => {
  if (!items.length) return null;

  return (
    <div className="event-gallery-preview">
      <h4 className="event-gallery-preview__title">Photos already uploaded</h4>

      <div className="event-gallery-preview__grid">
        {items.map((item) => (
          <div key={item.id} className="event-gallery-preview__item">
            <img
              src={item.thumb_url ?? item.public_url}
              alt={item.alt ?? "Event photo"}
              loading="lazy"
              decoding="async"
            />

            <button
              type="button"
              className="event-gallery-preview__delete"
              onClick={() => onDelete(item)}
              disabled={deletingId === item.id}
              aria-label="Remove photo"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventGalleryPreview;
