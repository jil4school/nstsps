import { useEffect, useState } from "react";
import SideBar from "./side-bar";
import { useMasterFile } from "@/context/master-file-context";
import Header from "./header";
import { useLogin } from "./context/login-context";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

function StudentHome() {
  const { student, latestEnrollment, fetchStudentInfo, fetchLatestEnrollment } =
    useMasterFile();
  const { user, changeFirstLoginPassword } = useLogin();

  const [showDialog, setShowDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // check if first login
  useEffect(() => {
    if (user?.user_id) {
      const id = String(user.user_id);
      fetchStudentInfo(id);
      fetchLatestEnrollment(id);
    }

    const firstLoginFlag = localStorage.getItem("is_first_login");
    if (firstLoginFlag === "1") {
      setShowDialog(true);
    }
  }, [user]);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const success = await changeFirstLoginPassword(user?.user_id!, newPassword); // 👈 call new axios
    setLoading(false);

    if (success) {
      localStorage.setItem("is_first_login", "0"); // clear first login
      setShowDialog(false); // close modal
    }
  };

  return (
    <div className="flex flex-row h-screen w-screen bg-white">
      <SideBar />
      <div className="flex flex-col w-full">
        <Header />
        <div className="ml-100  mt-35">
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
                {student?.surname || "LN"}, {student?.first_name || "FN"}{" "}
                {student?.middle_name || "MN"}
              </span>
              <span className="text-xl pl-2 pb-2" style={{ color: "#919090" }}>
                {student?.gender || "N/A"}
              </span>
              <span className="text-xl pl-2 pb-2" style={{ color: "#919090" }}>
                {latestEnrollment
                  ? `${latestEnrollment.sem} of SY ${latestEnrollment.school_year} (${latestEnrollment.year_level})`
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* 🔒 Force Change Password Dialog */}
      <Dialog open={showDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md bg-white" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              onClick={handleChangePassword}
              disabled={loading}
              className="mt-2 bg-[#1BB2EF] text-white"
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentHome;
