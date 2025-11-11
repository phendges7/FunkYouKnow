import { Routes, Route } from "react-router-dom";

import LayoutDefault from "./layout/LayoutDefault";
import LayoutAdmin from "./layout/LayoutAdmin/LayoutAdmin";

import HomePage from "./pages/HomePage/HomePage";
import RequestSongPage from "../features/songs/pages/RequestSongPage";
import EventsPage from "../features/events/pages/EventsPage";

import About from "../features/about/pages/AboutPage";
import Contact from "../features/contact/pages/ContactPage";
import Login from "../features/auth/pages/LoginPage";
import AdminPage from "../features/admin/pages/AdminPage";
import RequireAuth from "../utils/RequireAuth";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Layout público */}
      <Route element={<LayoutDefault />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/request-song" element={<RequestSongPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Layout admin — protegido */}
      <Route element={<RequireAuth adminOnly />}>
        <Route element={<LayoutAdmin />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
