import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "./lib/helmet";
import App from "./App";
import "./index.css";

hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
