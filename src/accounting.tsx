import Header from "./header";
import SideBar from "./side-bar";

function Accounting() {
  return (
    <>
      <div className="flex flex-row h-screen w-screen bg-white">
        <SideBar />
        <div className="flex flex-col w-full">
          <Header />
          <div className="bg-[#919090] ml-100 mt-50 w-230 h-fit justify-center items-center flex">
            <span className="my-class text-[#ffffff] text-3xl pt-2">ACCOUNT OVERVIEW</span>
          </div>
          <div
            className="relative bg-[#FCFDFD] ml-100 w-230 h-90 rounded-[5px] shadow-custom flex items-center justify-center"
            style={{
              boxShadow: "-4px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            {/* School Year (Top Left) */}
            

            {/* Centered Content */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <span className="text-[#1BB2EF] ">
              School Year 2025–2026 - First Semester
            </span><span className="text-6xl font-semibold my-class text-[#1BB2EF]">BALANCE: P0.00</span>
              <span className="text-md text-[#3BF157]">Fully Paid</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Accounting;
