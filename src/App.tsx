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
import NewStudentSingle from "./new-student-form-single";
import NewStudentBatch from "./new-student-form-batch";
import ITHome from "./it-admin";
import EmailBatch from "./email-batch";
import RegistrarHome from "./registrar-admin";
import StudentRegistrationsContent, {
  StudentRegistrations,
} from "./student-registrations";
import StudentRegistrationBatch from "./student-registration-batch";
import { AdminRegistrationProvider } from "./context/admin-registration-context";
import AccountingHome from "./accounting-admin";
import AcademicHome from "./academic-admin";
import { StudentGradeRecords } from "./student-grades";

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
  {
    path: "/nstsps/admission/new-student-single",
    element: <NewStudentSingle />,
  },
  { path: "/nstsps/admission/new-student-batch", element: <NewStudentBatch /> },
  { path: "/nstsps/IT-home", element: <ITHome /> },
  { path: "/nstsps/IT/email-batch", element: <EmailBatch /> },
  { path: "/nstsps/registrar-home", element: <RegistrarHome /> },
  {
    path: "/nstsps/registrar/student-registrations/:combinedId",
    element: <StudentRegistrations />, //
  },
  {
    path: "/nstsps/registrar/student-registration",
    element: (
      <AdminRegistrationProvider userId="">
        <StudentRegistrationBatch />
      </AdminRegistrationProvider>
    ),
  },
  { path: "/nstsps/accounting-home", element: <AccountingHome /> },
  { path: "/nstsps/academics-home", element: <AcademicHome /> },
  {
    path: "/nstsps/academics/student-grade-records/:combinedId",
    element: (
      <AdminRegistrationProvider userId="">
        <StudentGradeRecords />
      </AdminRegistrationProvider>
    ),
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
