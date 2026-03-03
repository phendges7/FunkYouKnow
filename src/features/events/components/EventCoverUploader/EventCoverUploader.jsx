import "./EventCoverUploader.css";

const EventCoverUploader = ({
  previewUrl = null,
  onSelect,
  disabled = false,
}) => {
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onSelect(file);
    e.target.value = "";
  };

  return (
    <div className="event-cover-uploader">
      <label className="event-cover-uploader__label">
        Event Thumbnail
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={disabled}
          className="event-cover-uploader__input"
        />
      </label>

      {previewUrl && (
        <div className="event-cover-uploader__preview">
          <img
            src={previewUrl}
            alt="Thumbnail preview"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
    </div>
  );
};

export default EventCoverUploader;
