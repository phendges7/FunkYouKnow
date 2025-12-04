import { useEffect, useState } from "react";
import { eventsService } from "../../services/eventsService";
import usePageFade from "../../../../utils/usePageFade";
import EventCard from "../../components/EventCard/User/UserEventCard";
import "./PublicEventList.css";

const Events = () => {
  usePageFade();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsService.getAllEvents();
        const published = data.filter(
          (e) => e.status === "published" && e.deleted_at === null
        );
        setEvents(published);
      } catch (err) {
        console.error("Error loading events: ", err.message);
        setError("Not possible loading events!");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <main className="events-content">
        <h1>Events</h1>
        <div className="events-grid">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="event-skeleton" />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="events-content">
        <h1>Events</h1>
        <p className="events__error">{error}</p>
      </main>
    );
  }
  return (
    <main className="events-content">
      <h1>Events</h1>
      {events.length === 0 ? (
        <p className="events__empty">Nenhum evento publicado ainda.</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Events;
