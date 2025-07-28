import axios from "axios";
import { createContext, useContext, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

interface StudentInfo {
  user_id: string;
  first_name: string;
  surname: string;
  gender?: string;
  enrollment?: string;
  student_id?: string;
  middle_name?: string;
}

interface MasterFileContextType {
  student: StudentInfo | null;
  fetchStudentInfo: (user_id: string) => Promise<void>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
}

const MasterFileContext = createContext<MasterFileContextType | undefined>(undefined);

export const MasterFileProvider = ({ children }: { children: ReactNode }) => {
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentInfo = async (user_id: string): Promise<void> => {
    try {
      const response = await axios.get(
        `http://localhost/NSTSPS_API/controller/MasterFileController.php?user_id=${user_id}`
      );

      console.log("Student info response:", response.data.first_name);

      if (response.data && !response.data.error) {
        setStudent(response.data);
        setError(null);
      } else {
        setError(response.data.error || "Failed to fetch student info");
        setStudent(null);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? err.message ?? "Student info request failed";

      console.error("Axios error (student):", err);
      setError(message);
      setStudent(null);
    }
  };

  const value: MasterFileContextType = {
    student,
    fetchStudentInfo,
    error,
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
