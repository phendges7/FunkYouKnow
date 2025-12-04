import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EventForm from "../../../components/EventForm/EventForm";
import { eventsService } from "../../../services/eventsService";

const AdminEventEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventsService.getEventById(id);
        setEvent(data);
      } catch (err) {
        console.error("Erro ao carregar evento:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <p>Carregando evento...</p>;
  if (!event) return <p>Evento não encontrado.</p>;

  return (
    <section>
      <EventForm
        event={event}
        onSubmitSuccess={() => navigate("/admin/events")}
      />
    </section>
  );
};

export default AdminEventEdit;
