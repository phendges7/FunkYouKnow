// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import { AuthProvider } from "./app/providers/AuthProvider.jsx";
import { BackgroundVideoProvider } from "./context/BackgroundVideoContext.jsx";
import GlobalBackgroundVideo from "./components/media/GlobalBackgroundVideo/GlobalBackgroundVideo.jsx";
import App from "./app/App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BackgroundVideoProvider>
        <GlobalBackgroundVideo />
        <App />
      </BackgroundVideoProvider>
    </AuthProvider>
  </StrictMode>
);

// Clear session storage item on page unload
window.addEventListener("beforeunload", () => {
  sessionStorage.removeItem("fyk_visited");
});
