import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";

import "./styles/index.css";

import App from "./app/App.jsx";

import { queryClient } from "./lib/react-query/queryClient";

import { AuthProvider } from "./app/providers/AuthProvider.jsx";
import { BackgroundVideoProvider } from "./app/providers/BackgroundVideoProvider.jsx";
import { ToastProvider } from "./app/providers/ToastProvider.jsx";

import GlobalToast from "./components/feedback/Toast/GlobalToast/GlobalToast.jsx";
import GlobalBackgroundVideo from "./components/media/GlobalBackgroundVideo/GlobalBackgroundVideo.jsx";

// Clear session storage on unload
window.addEventListener("beforeunload", () => {
  sessionStorage.removeItem("fyk_visited");
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BackgroundVideoProvider>
          <ToastProvider>
            <GlobalBackgroundVideo />
            <App />
            <GlobalToast />
          </ToastProvider>
        </BackgroundVideoProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
