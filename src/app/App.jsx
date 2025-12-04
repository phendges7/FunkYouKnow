// src/app/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// LAYOUT GLOBAL
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";

// PÁGINAS PÚBLICASe
import MainHome from "../features/home/pages/MainHome/Main";
import RequestSong from "../features/songs/pages/RequestSong/RequestSong";
import PublicEventList from "../features/events/pages/PublicEventList/PublicEventList";
import EventDetails from "../features/events/pages/EventDetails/EventDetails";

// SEÇÕES ESTÁTICAS / INSTITUCIONAIS
import About from "../components/sections/About/About";
import Contact from "../components/sections/Contact/Contact";

// LOGIN
import Login from "../components/sections/LoginForm/LoginForm";

// AUTH / ADMIN
import RequireAuth from "../utils/RequireAuth";
import AdminDashboard from "../features/admin/pages/AdminDashboard/AdminDashboard";
import AdminEventList from "../features/events/pages/admin/AdminEventList/AdminEventList";
import AdminEventCreate from "../features/events/pages/admin/AdminEventCreate/AdminEventCreate";
import AdminEventEdit from "../features/events/pages/admin/AdminEventEdit/AdminEventEdit";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<MainHome />} />
        <Route path="/request-song" element={<RequestSong />} />
        <Route path="/events" element={<PublicEventList />} />
        <Route path="/events/:slug" element={<EventDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route element={<RequireAuth adminOnly />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEventList />} />
          <Route path="/admin/events/create" element={<AdminEventCreate />} />
          <Route path="/admin/events/:id/edit" element={<AdminEventEdit />} />
        </Route>
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
