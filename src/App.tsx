import sidebarlogo from "./assets/sidebarlogo.png";
import { Button } from "./components/ui/button";import { Icon } from "@iconify/react";

function App() {
  return (
    <div className="flex flex-row h-screen w-screen bg-gray-100">
      <div
        className="relative h-screen flex flex-col"
        style={{ background: "#1BB2EF" }}
      >
        <div className="mt-35 text-white flex flex-col justify-start pr-10 pl-4">
          <span className="my-class text-white text-2xl">
            Student Information
          </span>
          <div className="flex flex-col pl-10">
            <Button variant="link" className="text-white text-xl justify-start">
              Master File
            </Button>

            <Button variant="link" className="text-white text-xl justify-start">
              Registration Details
            </Button>
            <Button variant="link" className="text-white text-xl justify-start">
              Grades Display
            </Button>
          </div>
          <span className="my-class text-white text-2xl mt-10">
            Student Services
          </span>
          <div className="flex flex-col pl-10">
            <Button variant="link" className="text-white text-xl justify-start">
              Request Form
            </Button>
          </div>
          <span className="my-class text-white text-2xl mt-10">Utilities</span>
          <div className="flex flex-col pl-10">
            <Button variant="link" className="text-white text-xl justify-start">
              Change Own Password
            </Button>
          </div>
          <hr className="w-full h-2 mt-25"></hr>
          <div className="flex flex-row items-center mt-5">
            <Icon
            icon="mdi:logout"
            width="30"
            height="30"
            className=" text-white pr-0"
          />
            <Button variant="link" className="p-1 text-white text-xl justify-start">
              Logout
            </Button>
          </div>
        </div>
      </div>
      <img
        src={sidebarlogo}
        alt="Logo"
        className="absolute top-5 left-54 w-[436px] h-[85px] transform -translate-x-1/2"
      />
      <span className="my-class text-white text-6xl mx-auto mt-8" style={{ color: "#00ACED" }}>STUDENT PORTAL</span>
    </div>
  );
}

export default App;
