import GradesDisplayTable from "./grades-display-table";
import Header from "./header";
import SideBar from "./side-bar";
import { useMasterFile } from "./context/master-file-context";
import { useEffect } from "react";
import { useLogin } from "./context/login-context";

function GradesDisplay() {
  const { fetchStudentInfo } = useMasterFile();
  const { user } = useLogin();

  useEffect(() => {
  if (user?.user_id) {
    fetchStudentInfo(String(user.user_id));
  }
}, [user]);
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
