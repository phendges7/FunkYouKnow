import { useState, useCallback } from "react";
import { ToastContext } from "../../context/ToastContext";

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    visible: false,
  });

  const showToast = useCallback((message, type = "error", duration = 2500) => {
    setToast({ message, type, visible: true });

    setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
    </ToastContext.Provider>
  );
};
