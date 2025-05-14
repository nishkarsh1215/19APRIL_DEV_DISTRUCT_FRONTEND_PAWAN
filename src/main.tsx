import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { TerminalContextProvider } from "react-terminal";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <TerminalContextProvider>
      <App />
    </TerminalContextProvider>
  </BrowserRouter>
);
