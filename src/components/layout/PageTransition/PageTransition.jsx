import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children }) {
  const location = useLocation();

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("fyk_visited");
    const isFirstVisit = !hasVisited;

    // Primeira visita: app shell (evita fixed dentro de body com filter)
    // Depois: main (pra transições internas)
    const target = isFirstVisit
      ? document.querySelector(".app-shell")
      : document.querySelector("main");
    if (!target) return;

    target.classList.add("fade-enter");

    const t = window.setTimeout(() => {
      target.classList.add("fade-enter-active");
    }, 50);

    if (isFirstVisit) sessionStorage.setItem("fyk_visited", "true");

    return () => {
      window.clearTimeout(t);
      target.classList.remove("fade-enter", "fade-enter-active");
    };
  }, [location.pathname]);

  return children;
}
