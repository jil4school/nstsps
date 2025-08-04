import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { LoginProvider } from "./context/login-context.tsx";
import { MasterFileProvider } from "./context/master-file-context.tsx";
import { ProgramProvider } from "./context/miscellaneous-context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LoginProvider>
        <ProgramProvider>
          <MasterFileProvider>
            <App />
          </MasterFileProvider>
        </ProgramProvider>
      </LoginProvider>
    </BrowserRouter>
  </StrictMode>
);
