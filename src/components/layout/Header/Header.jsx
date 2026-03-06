import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import PublicNavBar from "../PublicNavBar/PublicNavBar";
import AdminNavBar from "../../../features/admin/components/AdminNavBar/AdminNavBar";
import Logo from "../../../assets/logos/NoBGLogo.png";

import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdmin = !!user?.isAdmin;

  const showAdminNav = isAdminRoute && isAdmin;

  const renderNav = () => {
    if (loading) {
      return (
        <div className="header__nav-skeleton">
          <div className="header__nav-skeleton-item"></div>
          <div className="header__nav-skeleton-item"></div>
          <div className="header__nav-skeleton-item"></div>
        </div>
      );
    }

    return showAdminNav ? <AdminNavBar /> : <PublicNavBar />;
  };

  return (
    <header className="header">
      <img
        className="header__logo neon-box"
        src={Logo}
        alt="Funk You Know Logo"
        onClick={() => navigate("/")}
      />

      <div className="header__nav-wrapper">
        {renderNav()}

        {/* ADMIN PILL — aparece mesmo fora do /admin */}
        {!loading && isAdmin && (
          <button
            className="header__admin-pill"
            onClick={() => navigate("/admin")}
          >
            ADMIN
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
