import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";

import PublicNavBar from "../PublicNavBar/PublicNavBar";
import AdminNavBar from "../AdminNavBar/AdminNavBar";
import Logo from "../../assets/logos/NoBGLogo.png";

import "./Header.css";

const Header = () => {
  const navigate = useNavigate(); // <-- invocado corretamente
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (mounted) {
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }

        // Consulta na tabela correta: users_meta
        const { data, error } = await supabase
          .from("users")
          .select("isAdmin")
          .eq("id", user.id)
          .single();

        if (mounted) {
          setIsAdmin(!error && !!data?.isAdmin);
          setLoading(false);
        }
      } catch (_) {
        if (mounted) {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [location.pathname]); // atualiza ao trocar de rota
  // (se preferir, mova para um AuthContext depois)

  return (
    <header className="header">
      <img
        className="header__logo neon-box"
        src={Logo}
        alt="Funk You Know Logo"
        onClick={() => navigate("/")}
      />

      <div className="header__nav">
        {isAdminRoute && isAdmin ? <AdminNavBar /> : <PublicNavBar />}
      </div>
    </header>
  );
};

export default Header;
