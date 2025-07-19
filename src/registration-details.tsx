import Header from "./header";
import RegistrationDetailsTable from "./registration-details-table";
import SideBar from "./side-bar";

function RegistrationDetails() {
  return (
    <div className="flex flex-row h-screen w-screen bg-white">
      <SideBar />
      <Header />
      <div className="w-[70%] ml-90 mt-36">
      <RegistrationDetailsTable />
      </div>
    </div>
  );
}
export default RegistrationDetails;
