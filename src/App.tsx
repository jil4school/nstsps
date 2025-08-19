import { Route, Routes } from "react-router-dom";
import LandingPage from "./landing-page";
import StudentHome from "./student-home";
import MasterFile from "./master-file";
import RegistrationDetails from "./registration-details";
import RequestForm from "./request-form";
import GradesDisplay from "./grades-display";
import Accounting from "./accounting";
import ChangePassword from "./change-password";
import AdmissionHome from "./admission-admin";

const routes = [
  { path: "/nstsps", element: <LandingPage /> },
  { path: "/nstsps/student-home", element: <StudentHome /> },
  { path: "/nstsps/student-info/master-file", element: <MasterFile /> },
  {
    path: "/nstsps/student-info/registration-details",
    element: <RegistrationDetails />,
  },
  {
    path: "/nstsps/student-info/grades-display",
    element: <GradesDisplay />,
  },
  {
    path: "/nststs/student-info/grades-display",
    element: <StudentHome />,
  },
  {
    path: "/nstsps/student-services/request-form",
    element: <RequestForm />,
  },
  {
    path: "/nstsps/student-services/accounting",
    element: <Accounting />,
  },
  {
    path: "/nstsps/utilities/change-password",
    element: <ChangePassword />,
  },
  { path: "/nstsps/admission-home", element: <AdmissionHome /> },
];

function App() {
  return (
    <>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </>
  );
}

export default App;
