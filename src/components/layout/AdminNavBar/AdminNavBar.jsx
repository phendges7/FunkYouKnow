import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase/supabaseClient";
import "./AdminNavBar.css";

const AdminNavBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="admin-nav">
      <Link to="/admin" className="admin-nav__item">
        Dashboard
      </Link>
      <Link to="/admin/events" className="admin-nav__item">
        Events
      </Link>
      {/* <Link to="/admin/requests" className="admin-nav__item">
        Requests
      </Link> */}
      <Link to="/admin/new-users" className="admin-nav__item">
        New Admins
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
