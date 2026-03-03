import { createContext, useContext } from "react";

export const ToastContext = createContext({
  showToast: () => {},
  toast: { message: "", type: "success", visible: false },
});

export const useToast = () => useContext(ToastContext);
