import GradesDisplayTable from "./grades-display-table";
import Header from "./header";
import SideBar from "./side-bar";
import { useMasterFile } from "./context/master-file-context";
import { useAccounting } from "./context/accounting-context"; // ✅ add this
import { useEffect } from "react";
import { useLogin } from "./context/login-context";

function GradesDisplay() {
  const { fetchStudentInfo } = useMasterFile();
  const { user } = useLogin();
  const { accountingRecord, fetchAccounting } = useAccounting(); // ✅ use accounting context

  useEffect(() => {
    if (user?.user_id) {
      fetchStudentInfo(String(user.user_id));
      fetchAccounting(user.user_id); // ✅ fetch accounting info
    }
  }, [user]);

  // 🧩 Lock the page if there’s still an unpaid balance
  if (accountingRecord && accountingRecord.balance > 0) {
    return (
      <div className="flex flex-row h-screen w-screen bg-white">
        <SideBar />
        <Header />

        {/* Restriction notice */}
        <div className="w-[50%] ml-130 flex flex-col items-center justify-center">
          <div className="bg-gray-100 p-14 rounded-2xl shadow-md text-center w-full">
            <div className="text-6xl mb-5 text-gray-600">🔒</div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-3">
              Access Restricted
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Your grades are currently locked because you have an outstanding
              balance.
              <br />
              Please settle your payment at the Accounting Office to regain
              access.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Normal display when there’s no balance
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
