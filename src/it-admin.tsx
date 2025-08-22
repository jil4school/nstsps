
import HeaderAdmin from "./header-admin";
import { StudentTableIT } from "./student-table-it";

function ITHome() {
  return (
    <div className="flex flex-row h-screen w-screen bg-white">
      <div className="flex flex-col w-full">
        <HeaderAdmin />

        <div className="flex pl-10 pr-10 mt-25">
          <StudentTableIT />
        </div>
      </div>
    </div>
  );
}

export default ITHome;
