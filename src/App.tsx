import { Route, Routes } from "react-router-dom";
import LandingPage from "./landing-page";
import StudentHome from "./student-home";
import MasterFile from "./master-file";
import RegistrationDetails from "./registration-details";
import RequestForm from "./request-form";

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
    element: <RegistrationDetails />,
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
    path: "/nststs/utilities/change-password",
    element: <StudentHome />,
  },
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
