import eventsData from "../../utils/data/events.json";
import "./Events.css";

const Events = () => {
  const { events } = eventsData;

  return (
    <div className="events-content">
      <h1>Events</h1>
      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <img
              src={event.image}
              alt={event.title}
              className="event-card__image"
            />
            <h3>{event.title}</h3>
            <p>
              {event.date} • {event.location}
            </p>
            <button> BUY TICKETS </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
