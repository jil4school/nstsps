import axios from "axios";
import { createContext, useContext, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

interface RequestData {
  user_id: number;
  student_id: number;
  request: string;
  request_remarks: string;
  request_purpose: string;
  mode_of_payment: string;
  receipt?: File;
}

interface RequestContextType {
  createRequest: (data: RequestData) => Promise<void>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  loading: boolean;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const RequestProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const createRequest = async (data: RequestData): Promise<void> => {
    setLoading(true);
    try {
      const formData = new FormData();
      for (const key in data) {
        const value = data[key as keyof RequestData];
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      }

      const response = await axios.post(
        "http://localhost/NSTSPS_API/controller/RequestController.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.error) {
        console.error("Request submission error:", response.data.error);
        setError(response.data.error);
      } else {
        setError(null);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? err.message ?? "Request submission failed";
      console.error("Axios error (request):", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const value: RequestContextType = {
    createRequest,
    error,
    setError,
    loading,
  };

  return (
    <RequestContext.Provider value={value}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequest = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error("useRequest must be used within a RequestProvider");
  }
  return context;
};
