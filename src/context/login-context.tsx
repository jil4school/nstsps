import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

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
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

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

        setUser({ user_id: userId, email, role });
        localStorage.setItem("user_id", String(userId));
        localStorage.setItem("role", role);

        setError(null);
        toast.success("Login successful");
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

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    const storedEmail = localStorage.getItem("user_email"); // works now
    const storedRole = localStorage.getItem("role");
    if (storedUserId && storedEmail && storedRole) {
      setUser({
        user_id: parseInt(storedUserId, 10),
        email: storedEmail,
        role: storedRole,
      });
    }
  }, []);

  const logout = async () => {
    try {
      // optional: notify backend
      await axios.post(
        "http://localhost/NSTSPS_API/Logout.php",
        { user_id: user?.user_id }, // if your API expects it
        { headers: { "Content-Type": "application/json" } }
      );

      // clear local data
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_email");
      localStorage.removeItem("role");

      setUser(null);
      toast.success("Logged out successfully");

      // redirect to login page
      window.location.href = "http://localhost:5173/nstsps/";
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? err.message ?? "Logout failed";
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
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        return true;
      }

      setError(response.data.error || "Failed to change password");
      return false;
    } catch (err: any) {
      const message =
        err.response?.data?.error ??
        err.message ??
        "Password change request failed";
      setError(message);
      return false;
    }
  };

  const value: LoginContextType = {
    user,
    login,
    logout,
    changePassword, // add here
    error,
    setError,
    setUser,
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
