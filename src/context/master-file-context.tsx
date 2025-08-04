import axios from "axios";
import { createContext, useContext, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

interface StudentInfo {
  user_id: string;
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
  guardian_email?: string;
}
interface MasterFileContextType {
  student: StudentInfo | null;
  fetchStudentInfo: (user_id: string) => Promise<void>;
  updateStudentInfo: (data: Partial<StudentInfo>) => Promise<void>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
}

const MasterFileContext = createContext<MasterFileContextType | undefined>(
  undefined
);

export const MasterFileProvider = ({ children }: { children: ReactNode }) => {
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentInfo = async (user_id: string): Promise<void> => {
    try {
      const response = await axios.get(
        `http://localhost/NSTSPS_API/controller/MasterFileController.php?user_id=${user_id}`
      );

      if (response.data && !response.data.error) {
        setStudent(response.data);
        setError(null);
        console.log(response.data);
      } else {
        setError(response.data.error || "Failed to fetch student info");
        setStudent(null);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ??
        err.message ??
        "Student info request failed";

      console.error("Axios error (student):", err);
      setError(message);
      setStudent(null);
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
        console.log("Update successful");
        if (data.user_id) {
          await fetchStudentInfo(data.user_id); // still reload the data by user_id
        }
      } else {
        console.error("Update error:", response.data.error);
        setError(response.data.error || "Failed to update student info");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? err.message ?? "Student update failed";
      console.error("Axios error (update):", err);
      setError(message);
    }
  };

  const value: MasterFileContextType = {
    student,
    fetchStudentInfo,
    error,
    updateStudentInfo,
    setError,
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
