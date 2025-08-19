import HeaderAdmin from "./header-admin";
import { DataTableDemo } from "./table-for-admin";

function AdmissionHome() {
 
  return (
    <div className="flex flex-row h-screen w-screen bg-white">
      <div className="flex flex-col w-full">
       <HeaderAdmin />
        
        <div className="flex mt-20 p-10"><DataTableDemo /></div>
      </div>
    </div>
  );
}

export default AdmissionHome;