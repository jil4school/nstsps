"use client";

import { useState } from "react";
import HeaderAdmin from "./header-admin";
import { useLogin } from "./context/login-context";
import { toast } from "sonner";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function ChangePasswordAdmin() {
  const { user, changePassword } = useLogin();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string) => {
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const minLength = password.length >= 8;
    return hasLetter && hasNumber && minLength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!validatePassword(newPassword)) {
      toast.error(
        "Password must be at least 8 characters long and contain at least one letter and one number."
      );
      return;
    }

    setLoading(true);

    if (!user) {
      toast.error("User not found.");
      setLoading(false);
      return;
    }

    const success = await changePassword(
      user.user_id,
      oldPassword,
      newPassword,
      confirmPassword
    );

    if (success) {
      toast.success("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

    setLoading(false);
  };
  const navigate = useNavigate();
  const goBack = () => {
    if (user) {
      navigate(`/nstsps/${user.role.toLowerCase()}-home`);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      <HeaderAdmin />

      {/* Back button */}
      <div className="flex justify-end pr-6 pt-25">
        <button
          onClick={goBack}
          className="flex items-center text-blue-600 hover:underline text-sm font-medium"
        >
          <IoArrowBackSharp size={18} className="mr-1" />
          <span>Back</span>
        </button>
      </div>

      {/* Centered form */}
      <div className="flex flex-1 items-start justify-center px-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Change Password
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="border rounded px-3 py-2"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border rounded px-3 py-2"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border rounded px-3 py-2"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordAdmin;
