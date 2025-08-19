
import HeaderAdmin from "./header-admin";
import { StudentTable } from "./table-for-admin";

function AdmissionHome() {
  return (
    <div className="flex flex-row h-screen w-screen bg-white">
      <div className="flex flex-col w-full">
        <HeaderAdmin />

        <div className="flex pl-10 pr-10 mt-25">
          <StudentTable />
        </div>
      </div>
    </div>
  );
}

export default AdmissionHome;
