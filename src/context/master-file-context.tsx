import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { useLogin } from "./login-context";

interface StudentInfo {
  user_id: string;
  master_file_id: string;
  student_id: string;
  program_id: string;
  program_name: string;
  surname: string;
  first_name: string;
  middle_name?: string;
  gender?: string;
  nationality?: string;
  civil_status?: string;
  religion?: string;
  birthday?: string;
  birthplace?: string;
  street?: string;
  barangay?: string;
  region?: string;
  municipality?: string;
  mobile_number?: string;
  guardian_surname?: string;
  guardian_first_name?: string;
  relation_with_the_student?: string;
  guardian_mobile_number?: string;
  email: string;
  guardian_email?: string;
  year_level?: string;
}

interface MasterFileContextType {
  student: StudentInfo | null;
  fetchStudentInfo: (user_id: string) => Promise<void>;
  updateStudentInfo: (data: Partial<StudentInfo>) => Promise<void>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  fetchAllStudents: () => Promise<StudentInfo[] | null>;
  insertStudent: (data: StudentInfo) => Promise<boolean>;
  insertMultipleStudents: (data: StudentInfo[]) => Promise<boolean>;
  downloadSPSEmail: () => Promise<void>;
  uploadSPSEmail: (file: File) => Promise<boolean>;
  fetchPendingEmails: () => Promise<StudentInfo[] | null>; // 👈 new
  fetchCreatedEmails: () => Promise<StudentInfo[] | null>; // 👈 new
}

const MasterFileContext = createContext<MasterFileContextType | undefined>(
  undefined
);

export const MasterFileProvider = ({ children }: { children: ReactNode }) => {
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useLogin();

  useEffect(() => {
    if (user?.user_id) {
      fetchStudentInfo(user.user_id.toString());
    }
  }, [user]);

  const fetchStudentInfo = async (user_id: string): Promise<void> => {
    try {
      const response = await axios.get(
        `http://localhost/NSTSPS_API/controller/MasterFileController.php?user_id=${user_id}`
      );

      if (response.data && !response.data.error) {
        setStudent(response.data);
        setError(null);
      } else {
        setError(response.data.error || "Failed to fetch student info");
        setStudent(null);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ??
        err.message ??
        "Student info request failed";

      setError(message);
      setStudent(null);
    }
  };
  // 🔹 New function: Insert Student
  const insertStudent = async (data: StudentInfo): Promise<boolean> => {
    try {
      const response = await axios.post(
        "http://localhost/NSTSPS_API/controller/MasterFileController.php",
        data
      );

      if (response.data && !response.data.error) {
        toast.success("Student inserted successfully!");
        return true;
      } else {
        setError(response.data.error || "Failed to insert student");
        toast.error("Insert failed");
        return false;
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? err.message ?? "Student insert failed";
      setError(message);
      toast.error(message);
      return false;
    }
  };

  const updateStudentInfo = async (
    data: Partial<StudentInfo>
  ): Promise<void> => {
    try {
      const response = await axios.post(
        "http://localhost/NSTSPS_API/controller/MasterFileController.php",
        data
      );

      if (response.data && !response.data.error) {
        if (data.user_id) {
          await fetchStudentInfo(data.user_id);
          toast.success("Updated Successfully");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } else {
        setError(response.data.error || "Failed to update student info");
        toast.error("Update error:");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? err.message ?? "Student update failed";

      setError(message);
    }
  };

  const fetchAllStudents = async (): Promise<StudentInfo[] | null> => {
    try {
      const response = await axios.get(
        "http://localhost/NSTSPS_API/controller/MasterFileController.php"
      );

      if (response.data && !response.data.error) {
        return response.data as StudentInfo[];
      } else {
        setError(response.data.error || "Failed to fetch all students");
        return null;
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ??
        err.message ??
        "Failed to fetch all students";
      setError(message);
      return null;
    }
  };

  const downloadSPSEmail = async (): Promise<void> => {
    try {
      const response = await axios.get(
        "http://localhost/NSTSPS_API/controller/SPSEmailUploadController.php",
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "text/csv;charset=utf-8" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "SPSEmail.csv"); // keep .csv
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("SPSEmail.csv downloaded successfully!");
    } catch (err: any) {
      toast.error("Failed to download SPSEmail.csv");
    }
  };

  const insertMultipleStudents = async (
    data: StudentInfo[]
  ): Promise<boolean> => {
    try {
      const response = await axios.post(
        "http://localhost/NSTSPS_API/controller/MasterFileController.php",
        { students: data } // PHP is already checking for this
      );

      if (response.data && !response.data.error) {
        toast.success("Students inserted successfully!");
        return true;
      } else {
        setError(response.data.error || "Failed to insert students");
        toast.error("Batch insert failed");
        return false;
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ??
        err.message ??
        "Batch student insert failed";
      setError(message);
      toast.error(message);
      return false;
    }
  };

  // 🔹 New function: Upload SPSEmail Excel
  const uploadSPSEmail = async (file: File): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost/NSTSPS_API/controller/SPSEmailUploadController.php", // 👈 FIXED path
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // keep if you need session/cookies
        }
      );

      if (response.data && !response.data.error) {
        toast.success(response.data.message || "Excel uploaded successfully!");
        return true;
      } else {
        setError(response.data.error || "Upload failed");
        toast.error("Upload failed");
        return false;
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? err.message ?? "Upload request failed";
      setError(message);
      toast.error(message);
      return false;
    }
  };

  // 🔹 Fetch pending emails (not yet using @nst.edu.ph / @my.nst.edu.ph)
  const fetchPendingEmails = async (): Promise<StudentInfo[] | null> => {
    try {
      const response = await axios.get(
        "http://localhost/NSTSPS_API/controller/MasterFileController.php?type=pending"
      );
      if (response.data && !response.data.error) {
        return response.data as StudentInfo[];
      } else {
        setError(response.data.error || "Failed to fetch pending emails");
        return null;
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ??
        err.message ??
        "Failed to fetch pending emails";
      setError(message);
      return null;
    }
  };

  // 🔹 Fetch created emails (students with @my.nst.edu.ph)
  const fetchCreatedEmails = async (): Promise<StudentInfo[] | null> => {
    try {
      const response = await axios.get(
        "http://localhost/NSTSPS_API/controller/MasterFileController.php?type=created"
      );
      if (response.data && !response.data.error) {
        return response.data as StudentInfo[];
      } else {
        setError(response.data.error || "Failed to fetch created emails");
        return null;
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ??
        err.message ??
        "Failed to fetch created emails";
      setError(message);
      return null;
    }
  };

  const value: MasterFileContextType = {
    student,
    fetchStudentInfo,
    error,
    updateStudentInfo,
    setError,
    fetchAllStudents,
    insertStudent,
    insertMultipleStudents,
    downloadSPSEmail,
    uploadSPSEmail,
    fetchPendingEmails, // 👈 added
    fetchCreatedEmails, // 👈 added
  };

  return (
    <MasterFileContext.Provider value={value}>
      {children}
    </MasterFileContext.Provider>
  );
};

export const useMasterFile = () => {
  const context = useContext(MasterFileContext);
  if (context === undefined) {
    throw new Error("useMasterFile must be used within a MasterFileProvider");
  }
  return context;
};
