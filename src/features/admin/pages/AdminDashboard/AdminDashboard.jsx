import { useEffect } from "react";
import usePageFade from "../../utils/usePageFade";
import { supabase } from "../../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  usePageFade();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      const { data, error } = await supabase
        .from("users")
        .select("isAdmin")
        .eq("id", user.id)
        .single();

      if (error || !data.isAdmin) {
        navigate("/login");
      }
    };

    checkAdmin();
  }, [navigate]);

  return (
    <main className="admin">
      <h1 className="admin__title">ADMIN DASHBOARD</h1>
      <p className="admin__welcome">Welcome back NAME.</p>
      <p className="admin__message">Time to manage the events!</p>
    </main>
  );
};
export default Admin;
