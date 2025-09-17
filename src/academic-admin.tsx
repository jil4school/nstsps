
import HeaderAdmin from "./header-admin";
import { StudentTableAcademic } from "./student-table-academic";

function AcademicHome() {
  return (
    <div className="flex flex-row h-screen w-screen bg-white">
      <div className="flex flex-col w-full">
        <HeaderAdmin />

        <div className="flex pl-10 pr-10 mt-25">
          <StudentTableAcademic />
        </div>
      </div>
    </div>
  );
}

export default AcademicHome;
