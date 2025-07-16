import { useLocation } from "react-router-dom";
import { Button } from "./components/ui/button";
import sidebarlogo from "./assets/sidebarlogo.png";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

function SideBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { label: "Master File", path: "/nstsps/student-info/master-file" },
    {
      label: "Registration Details",
      path: "/nstsps/student-info/registration-details",
    },
    { label: "Grades Display", path: "/nstsps/student-info/grades-display" },
    { label: "Request Form", path: "/nstsps/student-services/request-form" },
    { label: "Change Own Password", path: "/nstsps/utilities/change-password" },
  ];

  return (
    <>
      <div
        className="fixed top-0 left-0 h-screen flex flex-col w-[317px] z-50"
        style={{ background: "#1BB2EF" }}
      >
        <div className="mt-35 text-white flex flex-col justify-start pl-4">
          <span className="my-class text-white text-2xl">
            Student Information
          </span>
          <div className="flex flex-col pl-10">
            {menuItems.slice(0, 3).map((item) => (
              <Link key={item.label} to={item.path}>
                <Button
                  variant="link"
                  className={`
                    text-xl justify-start cursor-pointer w-full text-left
                    ${
                      currentPath === item.path
                        ? "rounded-none rounded-l-3xl bg-white"
                        : ""
                    }
                  `}
                  style={{
                    color: currentPath === item.path ? "#00ACED" : "#ffffff",
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
          <span className="my-class text-white text-2xl mt-10">
            Student Services
          </span>
          <div className="flex flex-col pl-10">
            <Link to={menuItems[3].path}>
              <Button
                variant="link"
                className={`
                  text-xl justify-start cursor-pointer w-full text-left
                  ${
                    currentPath === menuItems[3].path
                      ? "rounded-none rounded-l-3xl bg-white"
                      : ""
                  }
                `}
                style={{
                  color:
                    currentPath === menuItems[3].path ? "#00ACED" : "#ffffff",
                }}
              >
                {menuItems[3].label}
              </Button>
            </Link>
          </div>
          <span className="my-class text-white text-2xl mt-10">Utilities</span>
          <div className="flex flex-col pl-10">
            <Link to={menuItems[4].path}>
              <Button
                variant="link"
                className={`
                  text-xl justify-start cursor-pointer w-full text-left
                  ${
                    currentPath === menuItems[4].path
                      ? "rounded-none rounded-l-3xl bg-white"
                      : ""
                  }
                `}
                style={{
                  color:
                    currentPath === menuItems[4].path ? "#00ACED" : "#ffffff",
                }}
              >
                {menuItems[4].label}
              </Button>
            </Link>
          </div>
          <hr className="w-full h-2 mt-25"></hr>
          <div className="flex flex-row items-center mt-5">
            <Icon
              icon="mdi:logout"
              width="30"
              height="30"
              className="text-white pr-0"
            />
            <Link to={"/nstsps"}>
              <Button
                variant="link"
                className="p-1 text-white text-xl justify-start cursor-pointer"
              >
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <img
        src={sidebarlogo}
        alt="Logo"
        className="fixed top-5 left-54 w-[436px] h-[85px] transform -translate-x-1/2 z-50"
      />
      
    </>
  );
}

export default SideBar;
