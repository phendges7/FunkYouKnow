import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventsService } from "../../../services/eventsService";
import EventCard from "../../../components/EventCard/Admin/AdminEventCard";
import PopupDeleteConfirmation from "../../../components/Modals/DeleteConfirmation/DeleteConfirmation";
import { supabase } from "../../../../../utils/supabaseClient";
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
      setError("Não foi possível carregar os eventos.");
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
      if (!user?.id) throw new Error("Usuário não autenticado.");

      const userId = user.id;

      if (!userId) {
        throw new Error("Usuário não autenticado.");
      }

      // 🔥 Soft delete com ID real do admin
      await eventsService.softDeleteEvent(selectedEvent.id, userId);

      setShowModal(false);
      setSelectedEvent(null);
      await loadEvents();
    } catch (err) {
      console.error("Erro ao deletar evento:", err.message);
      setError("Não foi possível deletar o evento.");
      setShowModal(false);
      setSelectedEvent(null);
    }
  };

  if (loading) {
    return <div className="admin-events__loading">Carregando eventos...</div>;
  }

  if (error) {
    return <div className="admin-events__error">{error}</div>;
  }

  return (
    <section className="admin-events">
      <div className="admin-events__header">
        <h1 className="admin-events__title">Eventos</h1>
        <button
          className="admin-events__create-btn"
          onClick={() => navigate("/admin/events/create")}
        >
          + Criar Evento
        </button>
      </div>

      {events.length === 0 ? (
        <p className="admin-events__empty">Nenhum evento cadastrado.</p>
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
        title="Excluir Evento"
        message={
          selectedEvent
            ? `Tem certeza que deseja excluir o evento "${selectedEvent.name}"?`
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
