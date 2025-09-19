import axios from "axios";
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

interface StudentInfo {
  street: string | undefined;
  barangay: string | undefined;
  region: string | undefined;
  municipality: string | undefined;
  mobile_number: string | undefined;
  guardian_surname: string | undefined;
  guardian_first_name: string | undefined;
  relation_with_the_student: string | undefined;
  guardian_mobile_number: string | undefined;
  guardian_email: string | undefined;
  birthplace: string | undefined;
  birthday: string | undefined;
  religion: string | undefined;
  civil_status: string | undefined;
  nationality: string | undefined;
  gender: string | undefined;
  middle_name: string | undefined;
  program_id: string | undefined;
  master_file_id: any;
  student_id: any;
  user_id: string;
  first_name: string;
  surname: string;
  program_name: string;
  email: string;
}

interface AdminMasterFileContextType {
  student: StudentInfo | null;
  fetchStudentById: (user_id: string) => Promise<StudentInfo | null>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  updateAdminStudentInfo: (data: Partial<StudentInfo>) => Promise<void>;
}

const AdminMasterFileContext = createContext<
  AdminMasterFileContextType | undefined
>(undefined);

export const AdminMasterFileProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentById = async (
    user_id: string
  ): Promise<StudentInfo | null> => {
    try {
      const response = await axios.get(
        `http://localhost/NSTSPS_API/controller/MasterFileController.php?user_id=${user_id}`
      );
      if (response.data && !response.data.error) {
        setStudent(response.data);
        setError(null);
        return response.data;
      } else {
        setStudent(null);
        setError(response.data.error || "Failed to fetch student");
        return null;
      }
    } catch (err: any) {
      setStudent(null);
      setError(err.response?.data?.error ?? err.message ?? "Request failed");
      return null;
    }
  };
  // Admin-only update function
  const updateAdminStudentInfo = async (data: Partial<StudentInfo>) => {
    try {
      const response = await axios.post(
        "http://localhost/NSTSPS_API/controller/MasterFileController.php",
        data
      );

      if (response.data && !response.data.error) {
        toast.success("Admin update successful!");
        if (data.user_id) {
          await fetchStudentById(data.user_id); // Refresh local data
        }
      } else {
        setError(response.data.error || "Failed to update student info");
        toast.error("Admin update failed");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? err.message ?? "Update failed";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <AdminMasterFileContext.Provider
      value={{ student, fetchStudentById, error, setError, updateAdminStudentInfo }}
    >
      {children}
    </AdminMasterFileContext.Provider>
  );
};

export const useAdminMasterFile = () => {
  const context = useContext(AdminMasterFileContext);
  if (!context)
    throw new Error(
      "useAdminMasterFile must be used within AdminMasterFileProvider"
    );
  return context;
};
