import eventsData from "../../utils/data/events.json";
import usePageFade from "../../utils/usePageFade";
import EventCard from "../EventCard/EventCard";
import "./Events.css";

const Events = () => {
  usePageFade();
  const { events } = eventsData;

  return (
    <main className="events-content">
      <h1>Events</h1>
      <div className="events-grid">
        {events.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </div>
    </main>
  );
};

export default Events;
