import { useEffect } from "react";
import SideBar from "./side-bar";
import { useMasterFile } from "@/context/master-file-context"; 

function StudentHome() {
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
      <div className="flex flex-col w-full">
        <div className="flex justify-center">
          <span
            className="my-class text-white text-6xl mx-auto mt-8"
            style={{ color: "#00ACED" }}
          >
            STUDENT PORTAL
          </span>
        </div>
        <div className="ml-100  mt-10">
          <span className="text-5xl p-10" style={{ color: "#919090" }}>
            Hello, {student?.first_name || "Student"}!
          </span>
          <div
            className="ml-10 w-[840px] h-[42px] mt-3"
            style={{ background: "#919090" }}
          ></div>
          <div
            className="flex flex-row ml-10 w-[840px] h-[170px] bg-white rounded-md"
            style={{
              boxShadow: "-4px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="flex flex-col pt-2">
              <span className="text-xl pl-2 pb-2" style={{ color: "#919090" }}>
                Student ID:
              </span>
              <span className="text-xl pl-2 pb-2" style={{ color: "#919090" }}>
                Name:
              </span>
              <span className="text-xl pl-2 pb-2" style={{ color: "#919090" }}>
                Gender:
              </span>
              <span className="text-xl pl-2 pb-2" style={{ color: "#919090" }}>
                Latest Enrollment:
              </span>
            </div>
            <div className="flex flex-col pt-2 pl-12">
              <span className="text-xl pl-2 pb-2" style={{ color: "#919090" }}>
                {student?.student_id || "000000000"}
              </span>
              <span className="text-xl pl-2 pb-2" style={{ color: "#919090" }}>
                {student?.surname || "LN"}, {student?.first_name || "FN"} {student?.middle_name || "MN"}
              </span>
              <span className="text-xl pl-2 pb-2" style={{ color: "#919090" }}>
                {student?.gender || "N/A"}
              </span>
              <span className="text-xl pl-2 pb-2" style={{ color: "#919090" }}>
                1st Semester of SY 2025-2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentHome;
