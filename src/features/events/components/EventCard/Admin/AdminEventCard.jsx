import "./AdminEventCard.css";

const AdminEventCard = ({ event, onEdit, onDelete }) => {
  const cover =
    event.thumbnail_url || "https://placehold.co/600x400?text=No+Image";

  const formatDate = (date) => {
    if (!date) return "No date";
    return new Date(date).toLocaleDateString("en-GB", {
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
          Created on: {formatDate(event.created_at)}
        </p>

        <div className="admin-event-card__actions">
          <button className="admin-event-card__edit-btn" onClick={onEdit}>
            ✏️ Edit
          </button>

          <button className="admin-event-card__delete-btn" onClick={onDelete}>
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEventCard;
