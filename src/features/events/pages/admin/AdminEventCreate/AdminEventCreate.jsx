import { useNavigate } from "react-router-dom";
import EventForm from "../../../components/EventForm/EventForm";

const AdminEventCreate = () => {
  const navigate = useNavigate();

  return (
    <section>
      <EventForm onSubmitSuccess={() => navigate("/admin/events")} />
    </section>
  );
};

export default AdminEventCreate;
