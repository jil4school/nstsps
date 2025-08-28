import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { LoginProvider } from "./context/login-context.tsx";
import { MasterFileProvider } from "./context/master-file-context.tsx";
import { ProgramProvider } from "./context/miscellaneous-context.tsx";
import { StudentRegistrationProvider } from "./context/registration-context.tsx";
import { GradesProvider } from "./context/grades-context.tsx";
import { RequestProvider } from "./context/request-context.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { AccountingProvider } from "./context/accounting-context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LoginProvider>
        <ProgramProvider>
          <MasterFileProvider>
              <StudentRegistrationProvider>
                <GradesProvider>
                  <RequestProvider>
                    <AccountingProvider>
                      <Toaster />
                      <App />
                    </AccountingProvider>
                  </RequestProvider>
                </GradesProvider>
              </StudentRegistrationProvider>
          </MasterFileProvider>
        </ProgramProvider>
      </LoginProvider>
    </BrowserRouter>
  </StrictMode>
);
