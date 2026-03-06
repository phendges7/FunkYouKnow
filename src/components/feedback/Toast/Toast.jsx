const Toast = ({ message, type = "success", visible }) => {
  if (!visible) return null;

  return (
    <div className={`toast toast--${type}`}>
      <p className="toast__message">{message}</p>
    </div>
  );
};

export default Toast;
