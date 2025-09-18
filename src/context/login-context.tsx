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

        const newUser: User = { user_id: userId, email, role };
        setUser(newUser);

        // persist
        localStorage.setItem("user_id", String(userId));
        localStorage.setItem("user_email", email);
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

      setUser(null);
      toast.success("Logged out successfully");
      window.location.href = "http://localhost:5173/nstsps/";
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
        setTimeout(() => {
          window.location.reload();
        }, 1500);
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

  const value: LoginContextType = {
    user,
    login,
    logout,
    changePassword,
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
