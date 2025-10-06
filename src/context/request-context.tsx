import axios from "axios";
import { createContext, useContext, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import { toast, Toaster } from "sonner";

interface RequestData {
  request_id: string;
  user_id: number;
  master_file_id: number;
  request: string;
  request_remarks: string;
  request_purpose: string;
  mode_of_payment: string;
  receipt?: File;
  status?: string;
}

interface RequestContextType {
  createRequest: (data: RequestData) => Promise<void>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  loading: boolean;
  getAllRequests: () => Promise<any[]>;
  getPendingRequests: () => Promise<any[]>;
  getProcessedOrDeclinedRequests: () => Promise<any[]>;
  updateRequestStatus: (
    requestId: string,
    status: string
  ) => Promise<any | null>;
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
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data?.error) {
        setError(response.data.error);
        toast.error(response.data.error || "Request submission failed");
      } else {
        setError(null);
        toast.success("Request successfully submitted", {
          id: Date.now().toString(), // unique per call
        });
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? err.message ?? "Request submission failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // in registration-context.tsx
  const getAllRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost/NSTSPS_API/controller/RequestController.php"
      );
      return response.data || [];
    } catch (err) {
      toast.error("Failed to fetch requests");
      return [];
    }
  };

  const getPendingRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost/NSTSPS_API/controller/RequestController.php"
      );
      const all = response.data || [];
      return all.filter((req: any) => req.status === "Pending");
    } catch (err) {
      toast.error("Failed to fetch pending requests");
      return [];
    }
  };

  // -------------------- GET PROCESSED & DECLINED REQUESTS --------------------
  const getProcessedOrDeclinedRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost/NSTSPS_API/controller/RequestController.php"
      );
      const all = response.data || [];
      return all.filter(
        (req: any) => req.status === "Processed" || req.status === "Declined"
      );
    } catch (err) {
      toast.error("Failed to fetch processed/declined requests");
      return [];
    }
  };

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      const response = await axios.put(
        "http://localhost/NSTSPS_API/controller/RequestController.php",
        {
          request_id: requestId,
          status,
        }
      );

      toast.success(`Request updated to ${status}`);

      setTimeout(() => {
        window.location.reload();
      }, 3000);

      return response.data;
    } catch (err) {
      toast.error("Failed to update request status");
      return null;
    }
  };

  const value: RequestContextType = {
    createRequest,
    error,
    setError,
    loading,
    getAllRequests,
    getPendingRequests,
    getProcessedOrDeclinedRequests,
    updateRequestStatus,
  };

  return (
    <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
  );
};

export const useRequest = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error("useRequest must be used within a RequestProvider");
  }
  return context;
};
