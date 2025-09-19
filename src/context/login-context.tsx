import axios from "axios";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface User {
  user_id: number;
  email: string;
  role: string;
}

interface LoginContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (
    user_id: number,
    old_password: string,
    new_password: string,
    confirm_password: string
  ) => Promise<boolean>;
  changeFirstLoginPassword: (
    user_id: number,
    new_password: string
  ) => Promise<boolean>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  setUser: Dispatch<SetStateAction<User | null>>;
  isForgotPasswordOpen: boolean; // ✅ add this
  setIsForgotPasswordOpen: Dispatch<SetStateAction<boolean>>; // ✅ add this
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUserId = localStorage.getItem("user_id");
    const storedEmail = localStorage.getItem("user_email");
    const storedRole = localStorage.getItem("role");

    return storedUserId && storedEmail && storedRole
      ? {
          user_id: parseInt(storedUserId, 10),
          email: storedEmail,
          role: storedRole,
        }
      : null;
  });
  const navigate = useNavigate();
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 👇 ADD THIS
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Skip logout if Forgot Password modal is open
    if (isForgotPasswordOpen) return;

    timeoutRef.current = setTimeout(() => {
      toast.error("You have been logged out due to inactivity.");

      setTimeout(async () => {
        await logout();
        navigate("/nstsps");
      }, 5000);
    }, 15 * 1000); // 15 seconds for testing
  };

  useEffect(() => {
    // only track inactivity if user is logged in
    if (user) {
      const events = ["mousemove", "keydown", "mousedown", "touchstart"];

      events.forEach((event) => window.addEventListener(event, resetTimeout));

      resetTimeout(); // start timer when logged in

      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        events.forEach((event) =>
          window.removeEventListener(event, resetTimeout)
        );
      };
    }
  }, [user]);
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(
        "http://localhost/NSTSPS_API/Login.php",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (
        response.data &&
        (response.data.success === true || response.data.success === "true")
      ) {
        const userId = response.data.user_id;
        const role = response.data.role;
        const isFirstLogin = response.data.is_first_login;

        const newUser: User = { user_id: userId, email, role };
        setUser(newUser);

        // persist
        localStorage.setItem("user_id", String(userId));
        localStorage.setItem("user_email", email);
        localStorage.setItem("role", role);
        localStorage.setItem("is_first_login", String(isFirstLogin));

        setError(null);

        if (isFirstLogin === 1 || isFirstLogin === "1") {
          toast.info("Please change your password first.");
          // Always go to student's home for first login
          window.location.href = "/nstsps/student-home";
        } else {
          toast.success("Login successful");

          // Redirect based on role
          const roleLower = role.toLowerCase(); // make it lowercase
          window.location.href = `/nstsps/${roleLower}-home`;
        }

        return true;
      }

      setError("Login failed: Invalid credentials");
      toast.error("Login failed: Invalid credentials");
      return false;
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? err.message ?? "Login request failed";
      setError(message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost/NSTSPS_API/Logout.php",
        { user_id: user?.user_id },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.removeItem("user_id");
      localStorage.removeItem("user_email");
      localStorage.removeItem("role");
      localStorage.removeItem("is_first_login"); // 👈 clear it too

      setUser(null);
      toast.success("Logged out successfully");
      window.location.href = "/nstsps/"; // 👈 leading slash
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? err.message ?? "Logout failed";
      setError(message);
    }
  };

  const changePassword = async (
    user_id: number,
    old_password: string,
    new_password: string,
    confirm_password: string
  ): Promise<boolean> => {
    try {
      const response = await axios.post(
        "http://localhost/NSTSPS_API/ChangePassword.php",
        {
          user_id,
          old_password,
          new_password,
          confirm_password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data && response.data.success) {
        toast.success(response.data.message);

        // clear first_login flag since user changed password

        // setTimeout(() => {
        //   window.location.href = "/nstsps/student-home"; // 👈 keep consistent
        // }, 1500);

        return true;
      }

      // 🚀 Show backend error in toast
      const errorMsg = response.data.error || "Failed to change password";
      toast.error(errorMsg);
      setError(errorMsg);
      return false;
    } catch (err: any) {
      const message =
        err.response?.data?.error ??
        err.message ??
        "Password change request failed";
      setError(message);
      toast.error(message); // 🚀 Also show toast here
      return false;
    }
  };

  const changeFirstLoginPassword = async (
    user_id: number,
    new_password: string
  ): Promise<boolean> => {
    try {
      const response = await axios.post(
        "http://localhost/NSTSPS_API/controller/FirstLoginPasswordController.php", // 👈 correct endpoint
        {
          user_id,
          new_password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data && response.data.success) {
        toast.success(response.data.message);

        // ✅ clear the first login flag
        localStorage.setItem("is_first_login", "0");

        // Optionally redirect after success
        // window.location.href = "/nstsps/student-home";

        return true;
      }

      const errorMsg = response.data.error || "Failed to change password";
      toast.error(errorMsg);
      setError(errorMsg);
      return false;
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? err.message ?? "Password change failed";
      setError(message);
      toast.error(message);
      return false;
    }
  };

  const value: LoginContextType = {
    user,
    login,
    logout,
    changePassword,
    changeFirstLoginPassword,
    error,
    setError,
    setUser,
    isForgotPasswordOpen,
    setIsForgotPasswordOpen, // ✅ expose it here
  };

  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
};

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
};
