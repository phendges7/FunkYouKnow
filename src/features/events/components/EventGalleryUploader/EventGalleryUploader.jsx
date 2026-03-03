import "./EventGalleryUploader.css";

const EventGalleryUploader = ({
  existingPhotos = [],
  newItems = [],
  onAddFiles,
  onRemoveNew,
  onRemoveExisting,
  inputRef,
  disabled = false,
}) => {
  const handleInputChange = (e) => {
    if (!e.target.files?.length) return;
    onAddFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <div className="event-gallery-uploader">
      <label className="event-gallery-uploader__label">
        Gallery Photos (max 10 at a time)
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={disabled}
          onChange={handleInputChange}
          className="event-gallery-uploader__input"
        />
      </label>

      <div className="event-gallery-uploader__grid">
        {/* Existing (DB) */}
        {existingPhotos.map((url, index) => (
          <div key={`existing-${url}`} className="event-gallery-uploader__item">
            <img
              src={url}
              alt={`Photo ${index + 1}`}
              loading="lazy"
              decoding="async"
            />
            <button
              type="button"
              className="event-gallery-uploader__remove"
              onClick={() => onRemoveExisting(url)}
              aria-label="Remove photo"
            >
              ✕
            </button>
          </div>
        ))}

        {/* New (local only) */}
        {newItems.map((item) => (
          <div
            key={item.id}
            className="event-gallery-uploader__item event-gallery-uploader__item--new"
          >
            <img
              src={item.previewUrl}
              alt="Preview"
              loading="lazy"
              decoding="async"
            />
            <button
              type="button"
              className="event-gallery-uploader__remove"
              onClick={() => onRemoveNew(item.id)}
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

export default EventGalleryUploader;
