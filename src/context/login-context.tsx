import axios from "axios";
import { createContext, useContext, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

interface User {
  user_id: number;
  email: string;
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
        setUser({ user_id: userId, email });
        localStorage.setItem("user_id", String(userId));
        setError(null);
        return true;
      }

      setError("Login failed: Invalid credentials");
      return false;
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? err.message ?? "Login request failed";

      console.error("Axios error:", err);
      setError(message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
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
      console.log(response.data.message); // "Password changed successfully"
      return true;
    }

    setError(response.data.error || "Failed to change password");
    return false;
  } catch (err: any) {
    const message =
      err.response?.data?.error ??
      err.message ??
      "Password change request failed";

    console.error("Axios error:", err);
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
