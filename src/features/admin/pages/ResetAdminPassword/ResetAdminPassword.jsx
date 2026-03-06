import AdminPasswordResetForm from "../../components/AdminPasswordResetForm/AdminPasswordResetForm";
import "./ResetAdminPassword.css";

const ResetAdminPassword = () => {
  return (
    <section className="reset-admin-password">
      <h1 className="reset-admin-password__title">Reset Admin Password</h1>
      <AdminPasswordResetForm />
    </section>
  );
};

export default ResetAdminPassword;
