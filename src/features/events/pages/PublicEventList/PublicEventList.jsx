import usePageFade from "../../../../hooks/usePageFade";
import EventCard from "../../components/EventCard/User/UserEventCard";
import { usePublishedEvents } from "../../../../hooks/queries/usePublishedEvents";
import "./PublicEventList.css";

const PublicEventList = () => {
  usePageFade();

  const {
    data: events = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = usePublishedEvents();

  if (isLoading) {
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

  if (isError) {
    return (
      <main className="events-content">
        <h1>Events</h1>
        <p className="events__error">
          {error?.message || "Could not load events. Try again."}
        </p>

        <button
          type="button"
          className="events__retry"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? "Retrying..." : "Retry"}
        </button>
      </main>
    );
  }

  return (
    <main className="events-content">
      <h1>Events</h1>

      {events.length === 0 ? (
        <p className="events__empty">No events published yet.</p>
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

export default PublicEventList;
