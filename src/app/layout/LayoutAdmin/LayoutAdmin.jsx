import { Outlet } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";

import "./LayoutAdmin.css";

const LayoutAdmin = () => {
  return (
    <div className="layout-admin">
      <AdminSidebar />
      <main className="layout-admin__content">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutAdmin;
