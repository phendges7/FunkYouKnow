import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./Header/Header";
import Main from "../pages/Main/Main";
import Footer from "./Footer/Footer";

import RequestSong from "../pages/RequestSong/RequestSong";
import Events from "../pages/Events/Events";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/request-song" element={<RequestSong />} />
        <Route path="/events" element={<Events />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
