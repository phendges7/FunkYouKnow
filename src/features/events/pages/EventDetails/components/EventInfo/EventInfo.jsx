const EventInfo = ({ formattedDate, location, description, ticketCta }) => {
  const locationText = location || "Location TBA";
  const descriptionText = description || "";

  return (
    <section className="event-info">
      <p className="event-info__date">DATE: {formattedDate}</p>
      <p className="event-info__location">{locationText}</p>
      <p className="event-info__description">{descriptionText}</p>

      {ticketCta.show && (
        <div className="event-info__actions">
          <button
            type="button"
            className={
              "event-info__ticket-btn " +
              (ticketCta.disabled ? "event-info__ticket-btn--disabled" : "")
            }
            onClick={ticketCta.onClick}
            disabled={ticketCta.disabled}
          >
            {ticketCta.label}
          </button>
        </div>
      )}
    </section>
  );
};

export default EventInfo;
