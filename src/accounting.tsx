import Header from "./header";
import SideBar from "./side-bar";
import { useAccounting } from "./context/accounting-context";
import { useEffect } from "react";
import { useLogin } from "./context/login-context";

function Accounting() {
  const { accountingRecord, fetchAccounting } = useAccounting();
  const { user } = useLogin();
  useEffect(() => {
    if (user?.user_id) {
      fetchAccounting(user?.user_id);
    }
  }, [user]);

  const balance = accountingRecord ? Number(accountingRecord.balance) : 0;

  const formattedBalance = balance.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  });

  const statusLabel = balance === 0 ? "Fully Paid" : "Remaining Balance";
  const statusColor = balance === 0 ? "#3BF157" : "#FF0000";

  return (
    <>
      <div className="flex flex-row h-screen w-screen bg-white">
        <SideBar />
        <div className="flex flex-col w-full">
          <Header />
          <div className="bg-[#919090] ml-100 mt-50 w-230 h-fit justify-center items-center flex">
            <span className="my-class text-[#ffffff] text-3xl pt-2">
              ACCOUNT OVERVIEW
            </span>
          </div>
          <div
            className="relative bg-[#FCFDFD] ml-100 w-230 h-90 rounded-[5px] shadow-custom flex items-center justify-center"
            style={{
              boxShadow: "-4px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <span className="text-[#1BB2EF] ">
                {accountingRecord?.school_year} - {accountingRecord?.sem}
              </span>
              <span className="text-6xl font-semibold my-class text-[#1BB2EF]">
                BALANCE: {formattedBalance}
              </span>
              <span className="text-md" style={{ color: statusColor }}>
                {statusLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Accounting;
