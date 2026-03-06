// src/features/events/components/.../UserEventCard.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./UserEventCard.css";
import formatLink from "../../../../../lib/url/formatLink";

const EventCard = ({ event }) => {
  const { name, thumbnail_url, description, slug, date, ticket_url } = event;

  const [isExpanded, setIsExpanded] = useState(false);
  const [needsReadMore, setNeedsReadMore] = useState(false);

  const descRef = useRef(null);

  // Internal route: router handles this (no formatLink here)
  const eventLink = `/events/${slug || event.id}`;

  const eventDescription =
    typeof description === "object"
      ? description?.text || ""
      : description || "";

  const formattedDate = date
    ? new Date(date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  const isPastEvent = (() => {
    if (!date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(date);
    if (Number.isNaN(eventDate.getTime())) return false;

    eventDate.setHours(0, 0, 0, 0);
    return eventDate < today;
  })();

  const hasTickets = Boolean(ticket_url);

  const buttonText = isPastEvent
    ? "SEE EVENT"
    : hasTickets
      ? "BUY TICKETS"
      : "TICKETS SOON";

  const toggleExpand = (e) => {
    // prevent Link navigation when toggling description
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const handleButtonClick = (e) => {
    // Past event: let the parent <Link> navigate normally
    if (isPastEvent) return;

    // Future/active event: don't navigate to details when clicking button
    e.preventDefault();
    e.stopPropagation();

    // No ticket link yet: do nothing
    if (!hasTickets) return;

    // Ticket link: open in new tab (and normalize URL)
    window.open(formatLink(ticket_url), "_blank", "noopener,noreferrer");
  };

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
    <Link to={eventLink} className="event-card__link">
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
                    type="button"
                  >
                    {isExpanded ? "Show less" : "Read more"}
                  </button>
                )}
              </>
            )}
          </div>

          <button
            className={
              "event-card__button " +
              (!isPastEvent && !hasTickets
                ? "event-card__button--disabled"
                : "")
            }
            onClick={handleButtonClick}
            disabled={!isPastEvent && !hasTickets}
            type="button"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
