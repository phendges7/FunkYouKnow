const EventHero = ({
  name,
  coverSrc,
  backgroundVideoUrl,
  videoUrl,
  isMuted,
  onToggleMute,
}) => {
  const hasVideo = Boolean(backgroundVideoUrl);

  return (
    <>
      {/* Cover when no video */}
      {!hasVideo && (
        <section className="event-cover">
          <img
            src={coverSrc}
            alt={name}
            className="event-cover__img"
            loading="eager"
            fetchPriority="high"
          />
          <div className="event-cover__overlay" />
          <h1 className="event-cover__title">{name}</h1>
        </section>
      )}

      {/* Floating title when video exists */}
      {hasVideo && (
        <div className="event-hero-title">
          <h1 className="event-hero-title__text">{name}</h1>

          {videoUrl && (
            <button
              className="event-mute-btn"
              onClick={onToggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default EventHero;
