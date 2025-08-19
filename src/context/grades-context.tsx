import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

type Grade = {
  grade_id: string;
  master_file_id: string;
  registration_id: string;
  course_id: string;
  course_description: string;
  course_code?: string;
  grade: string;
  unit: string;
};

type GradesContextType = {
  grades: Grade[];
  loading: boolean;
  error: string | null;
  fetchGrades: (masterFileId: string, registrationId: string) => Promise<void>;
};

const GradesContext = createContext<GradesContextType>({
  grades: [],
  loading: false,
  error: null,
  fetchGrades: async () => {},
});

export const GradesProvider = ({ children }: { children: React.ReactNode }) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGrades = async (masterFileId: string, registrationId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost/NSTSPS_API/controller/GradesController.php?master_file_id=${masterFileId}&registration_id=${registrationId}`
      );

      if (!Array.isArray(response.data)) {
        
        setGrades([]);
        setError("No grade records found.");
        return;
      }

      const formattedGrades = response.data.map((item: any) => ({
        grade_id: item.grade_id,
        master_file_id: item.master_file_id,
        registration_id: item.registration_id,
        course_id: item.course_id,
        course_description: item.course_description,
        course_code: item.course_code,
        grade: item.grade,
        unit: item.unit,
      }));

      setGrades(formattedGrades);
    } catch (err) {
      
      setGrades([]);
      setError("Failed to fetch grades.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradesContext.Provider value={{ grades, loading, error, fetchGrades }}>
      {children}
    </GradesContext.Provider>
  );
};

export const useGradesContext = () => useContext(GradesContext);
