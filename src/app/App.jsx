import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import PageTransition from "../components/layout/PageTransition/PageTransition";

import MainHome from "../features/home/pages/MainHome/Main";
import RequestSong from "../features/songs/pages/RequestSong/RequestSong";
import PublicEventList from "../features/events/pages/PublicEventList/PublicEventList";
import EventDetails from "../features/events/pages/EventDetails/EventDetails";
import About from "../components/sections/About/About";
import Contact from "../features/contact/pages/Contact/Contact";
import Login from "../components/sections/LoginForm/LoginForm";

import RequireAuth from "./routes/RequireAuth";
import AdminDashboard from "../features/admin/pages/AdminDashboard/AdminDashboard";
import AdminEventList from "../features/events/pages/admin/AdminEventList/AdminEventList";
import AdminEventCreate from "../features/events/pages/admin/AdminEventCreate/AdminEventCreate";
import AdminEventEdit from "../features/events/pages/admin/AdminEventEdit/AdminEventEdit";
import NewAdminPage from "../features/admin/pages/CreateNewAdmin/CreateNewAdmin";
import RequestedSongs from "../features/admin/pages/RequestedSongs/RequestedSongs";

function App() {
  const { bootReady, bootExiting } = useContext(AuthContext);

  return (
    <div
      className={`app-shell ${
        bootReady || bootExiting ? "app-shell--ready" : ""
      }`}
    >
      <Router>
        <PageTransition>
          <Header />

          <Routes>
            <Route path="/" element={<MainHome />} />
            <Route path="/request-song" element={<RequestSong />} />
            <Route path="/events" element={<PublicEventList />} />
            <Route path="/events/:slug" element={<EventDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/login" element={<Login />} />

            <Route element={<RequireAuth adminOnly />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/events" element={<AdminEventList />} />
              <Route
                path="/admin/events/create"
                element={<AdminEventCreate />}
              />
              <Route
                path="/admin/events/:id/edit"
                element={<AdminEventEdit />}
              />
              <Route path="/admin/new-admin" element={<NewAdminPage />} />
              <Route path="/admin/requests" element={<RequestedSongs />} />
            </Route>
          </Routes>

          <Analytics />
          <Footer />
        </PageTransition>
      </Router>
    </div>
  );
}

export default App;
