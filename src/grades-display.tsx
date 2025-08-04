import GradesDisplayTable from "./grades-display-table";
import Header from "./header";
import SideBar from "./side-bar";
import logo from "./assets/logoo.png";
import { useMasterFile } from "./context/master-file-context";
import { useEffect } from "react";

function GradesDisplay() {
  const { student, fetchStudentInfo } = useMasterFile();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      fetchStudentInfo(userId);
    }
  }, []);
  return (
    <div className="flex flex-row h-screen w-screen bg-white">

      <SideBar />
      <Header />
      <div className="w-[70%] ml-90 mt-36">
        <GradesDisplayTable />
      </div>
    </div>
  );
}
export default GradesDisplay;
