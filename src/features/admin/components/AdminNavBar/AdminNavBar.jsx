import { Link, useNavigate } from "react-router-dom";
import "./AdminNavBar.css";
import { useAuth } from "../../../../context/AuthContext";

const AdminNavBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <nav className="admin-nav">
      <Link to="/admin" className="admin-nav__item">
        Dashboard
      </Link>
      <Link to="/admin/events" className="admin-nav__item">
        Events
      </Link>
      <Link to="/admin/requests" className="admin-nav__item">
        Requested Songs
      </Link>
      <Link to="/admin/new-admin" className="admin-nav__item">
        New Admins
      </Link>
      <Link to="/admin/reset-password" className="admin-nav__item">
        Reset Passwords
      </Link>
      <button
        className="admin-nav__item admin-nav__item--cta"
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
  );
};

export default AdminNavBar;
