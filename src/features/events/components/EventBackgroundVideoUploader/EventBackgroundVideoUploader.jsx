import "./EventBackgroundVideoUploader.css";

const EventBackgroundVideoUploader = ({
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
    <div className="event-bg-video-uploader">
      <label className="event-bg-video-uploader__label">
        Background Video (optional)
        <input
          type="file"
          accept="video/*"
          onChange={handleChange}
          disabled={disabled}
          className="event-bg-video-uploader__input"
        />
      </label>

      {previewUrl && (
        <div className="event-bg-video-uploader__preview">
          <video src={previewUrl} controls preload="metadata" />
        </div>
      )}
    </div>
  );
};

export default EventBackgroundVideoUploader;
