import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-sidebar__title">Dashboard</h2>
      <nav className="admin-sidebar__nav">
        <NavLink to="/admin" end>
          Home
        </NavLink>
        <NavLink to="/admin/songs">Songs</NavLink>
        <NavLink to="/admin/events">Events</NavLink>
        <NavLink to="/admin/users">Users</NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
