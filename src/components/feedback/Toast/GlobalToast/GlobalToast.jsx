import "./GlobalToast.css";
import Toast from "../Toast";
import { useToast } from "../../../../context/ToastContext";

const GlobalToast = () => {
  const { toast } = useToast();

  if (!toast.visible) return null;

  return (
    <Toast message={toast.message} type={toast.type} visible={toast.visible} />
  );
};

export default GlobalToast;
