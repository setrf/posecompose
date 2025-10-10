import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { logEvent, logError } from "./lib/logger";

logEvent("app_boot", { stage: "initializing" });

const rootElement = document.getElementById("root");

if (!rootElement) {
  logError("app_boot_failed", new Error("Root element not found"));
  throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />);
logEvent("app_rendered", { stage: "ready" });
