import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventsService } from "../../../services/eventsService";
import EventCard from "../../../components/EventCard/Admin/AdminEventCard";
import PopupDeleteConfirmation from "../../../components/Modals/DeleteConfirmation/DeleteConfirmation";
import { supabase } from "../../../../../lib/supabase/supabaseClient";
import "./AdminEventList.css";

const AdminEventsList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Carrega eventos
  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventsService.getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error("Erro ao carregar eventos:", err.message);
      setError("Could not load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openDeleteModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedEvent) return;

    try {
      setError(null);

      // 🔐 Pega usuário logado no Supabase
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user?.id) throw new Error("User not authenticated.");

      const userId = user.id;

      if (!userId) {
        throw new Error("User not authenticated.");
      }

      // 🔥 Soft delete com ID real do admin
      await eventsService.softDeleteEvent(selectedEvent.id, userId);

      setShowModal(false);
      setSelectedEvent(null);
      await loadEvents();
    } catch (err) {
      console.error("Erro ao deletar evento:", err.message);
      setError("Could not delete the event.");
      setShowModal(false);
      setSelectedEvent(null);
    }
  };

  if (loading) {
    return <div className="admin-events__loading">Loading events...</div>;
  }

  if (error) {
    return <div className="admin-events__error">{error}</div>;
  }

  return (
    <section className="admin-events">
      <div className="admin-events__header">
        <h1 className="admin-events__title">Events</h1>
        <button
          className="admin-events__create-btn"
          onClick={() => navigate("/admin/events/create")}
        >
          + Create Event
        </button>
      </div>

      {events.length === 0 ? (
        <p className="admin-events__empty">No events created yet.</p>
      ) : (
        <div className="admin-events__grid">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={() => navigate(`/admin/events/${event.id}/edit`)}
              onDelete={() => openDeleteModal(event)}
            />
          ))}
        </div>
      )}

      <PopupDeleteConfirmation
        visible={showModal}
        title="Delete Event"
        message={
          selectedEvent
            ? `Are you sure you want to delete the event "${selectedEvent.name}"?`
            : ""
        }
        onCancel={() => {
          setShowModal(false);
          setSelectedEvent(null);
        }}
        onConfirm={confirmDelete}
      />
    </section>
  );
};

export default AdminEventsList;
