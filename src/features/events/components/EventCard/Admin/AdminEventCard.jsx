import "./AdminEventCard.css";

const AdminEventCard = ({ event, onEdit, onDelete }) => {
  const cover =
    event.thumbnail_url || "https://placehold.co/600x400?text=Sem+Imagem";

  const formatDate = (date) => {
    if (!date) return "Sem data";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="admin-event-card">
      <div className="admin-event-card__image">
        <img src={cover} alt={event.name} />
      </div>

      <div className="admin-event-card__body">
        <h3 className="admin-event-card__name">{event.name}</h3>

        <p className="admin-event-card__status">
          Status: <span>{event.status}</span>
        </p>

        <p className="admin-event-card__date">
          Criado em: {formatDate(event.created_at)}
        </p>

        <div className="admin-event-card__actions">
          <button className="admin-event-card__edit-btn" onClick={onEdit}>
            ✏️ Editar
          </button>

          <button className="admin-event-card__delete-btn" onClick={onDelete}>
            🗑️ Deletar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEventCard;
