import axios from "axios";
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

interface StudentInfo {
  registration_id(
    registration_id: any,
    master_file_id: any,
    user_id: string
  ): unknown;
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
  insertSchedule: (data: {
    program_id: string;
    year_level: string;
    semester: string;
    school_year: string;
    schedules: {
      title: string;
      start: string;
      end: string;
      day: string;
    }[];
  }) => Promise<void>; // ✅ add this
  fetchSchedules: (
    programId: string,
    yearLevel: string,
    sem: string,
    schoolYear: string
  ) => Promise<any[]>;
  deleteSchedule: (scheduleId: number) => Promise<void>; // ✅ add this
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

  // Insert schedule data
  const insertSchedule = async (data: {
    program_id: string;
    year_level: string;
    semester: string;
    school_year: string;
    schedules: {
      title: string;
      start: string;
      end: string;
      day: string;
    }[];
  }) => {
    try {
      const payload = {
        action: "insert_schedule",
        ...data,
      };

      const response = await axios.post(
        "http://localhost/NSTSPS_API/controller/ScheduleController.php",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "Schedule inserted successfully!"
        );
      } else {
        toast.error(response.data.error || "Failed to insert schedule");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? err.message ?? "Schedule insertion failed";
      setError(message);
      toast.error(message);
    }
  };
  const fetchSchedules = async (
    programId: string,
    yearLevel: string,
    sem: string,
    schoolYear: string
  ): Promise<any[]> => {
    // ← return type is an array now
    try {
      const response = await axios.get(
        `http://localhost/NSTSPS_API/controller/ScheduleController.php`,
        {
          params: {
            program_id: programId,
            year_level: yearLevel,
            sem,
            school_year: schoolYear,
          },
        }
      );

      if (response.data.success) {
        return response.data.schedules; // ✅ return data
      } else {
       
        return []; 
      }
    } catch (err: any) {
      console.error("Failed to fetch schedules:", err.message);
      return []; // ✅ prevent crash
    }
  };
  const deleteSchedule = async (scheduleId: number) => {
    try {
      const response = await axios.delete(
        "http://localhost/NSTSPS_API/controller/ScheduleController.php",
        {
          data: { schedule_id: scheduleId },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "Schedule deleted successfully!"
        );
      } else {
        toast.error(response.data.error || "Failed to delete schedule");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? err.message ?? "Schedule deletion failed";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <AdminMasterFileContext.Provider
      value={{
        student,
        fetchStudentById,
        error,
        setError,
        updateAdminStudentInfo,
        insertSchedule, // ✅ add this
        fetchSchedules,
        deleteSchedule,
      }}
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
