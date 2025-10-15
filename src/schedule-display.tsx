import Header from "./header";
import SideBar from "./side-bar";
import { useMasterFile } from "./context/master-file-context";
import { useAccounting } from "./context/accounting-context";
import { useEffect } from "react";
import { useLogin } from "./context/login-context";
import StudentSchedulePage from "./schedule-display-table";

function ScheduleDisplay() {
  const { fetchStudentInfo } = useMasterFile();
  const { user } = useLogin();
  const { fetchAccounting } = useAccounting(); // ✅ we can still fetch accounting if needed

  useEffect(() => {
    if (user?.user_id) {
      fetchStudentInfo(String(user.user_id));
      fetchAccounting(user.user_id);
    }
  }, [user]);

  // ✅ Always show the schedule, no restriction anymore
  return (
    <div className="flex flex-row h-screen w-screen bg-white">
      <SideBar />
      <Header />
      <div className="flex flex-col w-[70%] ml-90 mt-36 mb-10 overflow-y-auto pb-1">
        <StudentSchedulePage />
      </div>
    </div>
  );
}

export default ScheduleDisplay;
