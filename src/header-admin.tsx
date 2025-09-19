import { useState, useRef, useEffect } from "react";
import { useLogin } from "./context/login-context";
import logo from "./assets/logoo.png";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate

function HeaderAdmin() {
  const { user, logout } = useLogin();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // ✅ init navigate

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
  };

  const goToChangePassword = () => {
    // Navigate to admin change password page
    navigate("/nstsps/admin/change-password");
  };
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-0 w-full flex items-center justify-between px-6 z-50 bg-white h-20 shadow-md">
      {/* Left: Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-12 w-auto" />
      </div>

      {/* Center: Title */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <span className="text-6xl font-bold" style={{ color: "#00ACED" }}>
          STUDENT PORTAL
        </span>
      </div>

      {/* Right: User Icon */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center focus:outline-none"
        >
          <FaUserCircle
            size={40}
            className="text-gray-600 hover:text-[#00ACED]"
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
            <button
              onClick={goToChangePassword} // ✅ navigate to change password
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeaderAdmin;
