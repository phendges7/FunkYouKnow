import { useState, useEffect, useRef } from "react";
import "./UserEventCard.css";
import { formatLink } from "../../../../../utils/helpers";

const EventCard = ({ event }) => {
  const { name, thumbnail_url, description, slug, date } = event;
  console.log(event);
  console.log(event.name);

  const [isExpanded, setIsExpanded] = useState(false);
  const [needsReadMore, setNeedsReadMore] = useState(false);

  const descRef = useRef(null);

  const eventLink = `/events/${slug || event.id}`;

  const eventDescription =
    typeof description === "object"
      ? description.text || ""
      : description || "";

  const formattedDate = date
    ? new Date(date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  const isPastEvent = (() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const eventDate = new Date(date).setHours(0, 0, 0, 0);
    console.log(event.date);

    return eventDate < today;
  })();

  const buttonText = isPastEvent ? "SEE EVENT" : "BUY TICKETS";

  const toggleExpand = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  // DETECTA overflow real
  useEffect(() => {
    if (!descRef.current) return;

    if (isExpanded) {
      setNeedsReadMore(true);
      return;
    }

    const el = descRef.current;

    const visibleHeight = el.clientHeight;
    const realHeight = el.scrollHeight;

    setNeedsReadMore(realHeight > visibleHeight);
  }, [eventDescription, isExpanded]);

  return (
    <a href={formatLink(eventLink)} className="event-card__link">
      <div className="event-card">
        <img
          src={thumbnail_url || "https://placehold.co/600x400?text=Sem+Imagem"}
          alt={name}
          className="event-card__image"
          loading="lazy"
        />

        <div className="event-card__body">
          <div className="event-card__info">
            <h3 className="event-card__title">{name}</h3>
            {formattedDate && (
              <p className="event-card__date">{formattedDate}</p>
            )}

            {eventDescription && (
              <>
                <p
                  ref={descRef}
                  className={
                    "event-card__description " +
                    (isExpanded ? "event-card__description--expanded" : "")
                  }
                >
                  {eventDescription}
                </p>

                {needsReadMore && (
                  <button
                    className="event-card__readmore"
                    onClick={toggleExpand}
                  >
                    {isExpanded ? "Mostrar menos" : "Ler mais"}
                  </button>
                )}
              </>
            )}
          </div>

          <button className="event-card__button" onClick={handleButtonClick}>
            {buttonText}
          </button>
        </div>
      </div>
    </a>
  );
};

export default EventCard;
