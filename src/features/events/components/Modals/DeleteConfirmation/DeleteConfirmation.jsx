import "./DeleteConfirmation.css";

const DeleteConfirmation = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!visible) return null;

  return (
    <div className="popup-confirm">
      <div className="popup-confirm__overlay" onClick={onCancel}></div>

      <div className="popup-confirm__box">
        <h2 className="popup-confirm__title">{title}</h2>
        <p className="popup-confirm__message">{message}</p>

        <div className="popup-confirm__actions">
          <button className="popup-confirm__cancel" onClick={onCancel}>
            Cancelar
          </button>

          <button className="popup-confirm__confirm" onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
