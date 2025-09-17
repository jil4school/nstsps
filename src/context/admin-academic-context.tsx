// admin-academic-context.tsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useMasterFile } from "./master-file-context";

type GradeRecord = {
  grades_id: string;
  user_id: string;
  master_file_id: string;
  registration_id: string;
  course_id: string;
  course_code?: string;
  course_description?: string;
  grade: number | null;
};

type AdminAcademicContextType = {
  grades: GradeRecord[];
  loading: boolean;
  error: string | null;

  // fetch all grades for a given user/registration
  fetchGrades: (userId: string, registrationId: string) => Promise<void>;

  // fetch single grade record
  getGradeById: (gradesId: string) => Promise<GradeRecord | null>;

  // insert/update grade for a course
  upsertGrade: (
    registrationId: string,
    courseId: string,
    userId: string,
    masterFileId: string,
    grade: number
  ) => Promise<boolean>;

  // batch insert/update grades
  insertMultipleGrades: (grades: GradeRecord[]) => Promise<boolean>;
};

const AdminAcademicContext = createContext<AdminAcademicContextType>({
  grades: [],
  loading: false,
  error: null,
  fetchGrades: async () => {},
  getGradeById: async () => null,
  upsertGrade: async () => false,
  insertMultipleGrades: async () => false,
});

export const AdminAcademicProvider: React.FC<{
  children: React.ReactNode;
  userId: string;
  registrationId: string;
}> = ({ children, userId, registrationId }) => {
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchStudentInfo } = useMasterFile();

  const fetchGrades = async (userId: string, registrationId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost/NSTSPS_API/controller/GradeController.php`,
        { params: { user_id: userId, registration_id: registrationId } }
      );

      if (!Array.isArray(response.data)) {
        setGrades([]);
        toast.error("No grades found");
        return;
      }

      const formatted = response.data.map((item: any) => ({
        grades_id: item.grades_id,
        user_id: item.user_id,
        master_file_id: item.master_file_id,
        registration_id: item.registration_id,
        course_id: item.course_id,
        course_code: item.course_code,
        course_description: item.course_description,
        grade: item.grade ? Number(item.grade) : null,
      }));

      setGrades(formatted);
    } catch (err) {
      setError("Failed to fetch grades");
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  const getGradeById = async (gradesId: string): Promise<GradeRecord | null> => {
    try {
      const response = await axios.get(
        `http://localhost/NSTSPS_API/controller/GradeController.php`,
        { params: { grades_id: gradesId } }
      );

      if (!response.data || response.data.error) {
        toast.error(`No grade found for ID: ${gradesId}`);
        return null;
      }

      return response.data;
    } catch (err) {
      toast.error("Error fetching grade by ID");
      return null;
    }
  };

  const upsertGrade = async (
    registrationId: string,
    courseId: string,
    userId: string,
    masterFileId: string,
    grade: number
  ): Promise<boolean> => {
    try {
      const response = await axios.post(
        "http://localhost/NSTSPS_API/controller/GradeController.php",
        {
          action: "upsert",
          registration_id: registrationId,
          course_id: courseId,
          user_id: userId,
          master_file_id: masterFileId,
          grade,
        }
      );

      if (response.data.success) {
        toast.success("Grade saved successfully!");
        await fetchGrades(userId, registrationId);
        return true;
      } else {
        toast.error(response.data.error || "Failed to save grade");
        return false;
      }
    } catch (err) {
      toast.error("Error saving grade");
      return false;
    }
  };

  const insertMultipleGrades = async (grades: GradeRecord[]): Promise<boolean> => {
    try {
      const response = await axios.post(
        "http://localhost/NSTSPS_API/controller/GradeController.php",
        { action: "batch_insert", grades },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        toast.success("Grades uploaded successfully!");
        await fetchGrades(userId, registrationId);
        return true;
      } else {
        toast.error(response.data.error || "Failed to upload grades");
        return false;
      }
    } catch (err) {
      toast.error("Batch insert failed");
      return false;
    }
  };

  useEffect(() => {
    if (userId && registrationId) {
      fetchGrades(userId, registrationId);
      fetchStudentInfo(userId);
    }
  }, [userId, registrationId]);

  return (
    <AdminAcademicContext.Provider
      value={{
        grades,
        loading,
        error,
        fetchGrades,
        getGradeById,
        upsertGrade,
        insertMultipleGrades,
      }}
    >
      {children}
    </AdminAcademicContext.Provider>
  );
};

export const useAdminAcademicContext = () => useContext(AdminAcademicContext);
