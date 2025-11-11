import "./EventCard.css";
import { formatLink } from "../../utils/helpers";

const EventCard = ({ title, date, description, image, link }) => {
  const isPastEvent = (() => {
    if (!date) return false; // Se não tiver data, considera futuro
    const today = new Date();
    const eventDate = new Date(date);
    return eventDate < today.setHours(0, 0, 0, 0);
  })();

  const buttonText = isPastEvent ? "SEE EVENT" : "BUY TICKETS";

  return (
    <div className="event-card">
      <img
        src={image}
        alt={title}
        className="event-card__image"
        loading="lazy"
      />

      <h3 className="event-card__title">{title}</h3>
      {date && <p className="event-card__date">{date}</p>}
      <p className="event-card__description">{description}</p>

      {link && (
        <a href={formatLink(link)} target="_blank" rel="noreferrer">
          <button className="event-card__button">{buttonText}</button>
        </a>
      )}
    </div>
  );
};

export default EventCard;
