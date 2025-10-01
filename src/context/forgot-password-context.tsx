import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { toast } from "sonner";

interface ForgotPasswordContextType {
  showModal: boolean;
  openModal: () => void;
  closeModal: () => void;
  step: "email" | "verify" | "changePassword";
  email: string;
  setEmail: (email: string) => void;
  verificationCode: string;
  generateCode: () => string;
  sendVerification: () => Promise<void>;
  verifyCode: (code: string) => Promise<boolean>;
  countdown: number;
  resendCode: () => Promise<void>;
  changePassword: (
    newPassword: string,
    confirmPassword: string
  ) => Promise<void>;
}

const ForgotPasswordContext = createContext<
  ForgotPasswordContextType | undefined
>(undefined);

export const ForgotPasswordProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<ForgotPasswordContextType["step"]>("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [countdown, setCountdown] = useState(60);

  const API_URL = "http://localhost/NSTSPS_API/ForgotPassword.php";

  const openModal = () => {
    setStep("email");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const generateCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
    setVerificationCode(code);
    return code;
  };

  const sendVerification = async () => {
    try {
      // Check if user exists
      const res = await axios.post(API_URL, { type: "checkUser", email });
      if (!res.data.exists) {
        toast.error("User does not exist");
        return;
      }

      const code = generateCode();

      // Send verification code
      const sendRes = await axios.post(API_URL, {
        type: "sendCode",
        email,
        code,
      });
      if (!sendRes.data.success) {
        toast.error(sendRes.data.error || "Failed to send code");
        return;
      }

      toast.success("Verification code sent!");
      setStep("verify");

      // Start countdown
      setCountdown(60);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || "Error sending verification code"
      );
    }
  };

  const verifyCode = async (code: string) => {
    try {
      const res = await axios.post(API_URL, {
        type: "verifyCode",
        email,
        code,
      });
      if (res.data.success) {
        setStep("changePassword");
        return true;
      } else {
        toast.error("Verification code incorrect");
        return false;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Error verifying code");
      return false;
    }
  };

  const resendCode = async () => {
    await sendVerification();
  };

  const changePassword = async (
    newPassword: string,
    confirmPassword: string
  ) => {
    // 1. Check if passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // 2. Check min length
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    // 3. Check if it contains at least one letter and one number
    const hasLetter = /[A-Za-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasLetter || !hasNumber) {
      toast.error("Password must contain at least one letter and one number");
      return;
    }

    // 4. Proceed with API call
    try {
      const res = await axios.post(API_URL, {
        type: "changePassword",
        email,
        new_password: newPassword,
      });

      if (res.data.success) {
        toast.success("Password changed successfully");
        closeModal();
      } else {
        toast.error(res.data.error || "Failed to change password");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Error changing password");
    }
  };

  return (
    <ForgotPasswordContext.Provider
      value={{
        showModal,
        openModal,
        closeModal,
        step,
        email,
        setEmail,
        verificationCode,
        generateCode,
        sendVerification,
        verifyCode,
        countdown,
        resendCode,
        changePassword,
      }}
    >
      {children}
    </ForgotPasswordContext.Provider>
  );
};

export const useForgotPassword = () => {
  const context = useContext(ForgotPasswordContext);
  if (!context)
    throw new Error(
      "useForgotPassword must be used within ForgotPasswordProvider"
    );
  return context;
};
