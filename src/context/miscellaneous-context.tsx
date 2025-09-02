import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

interface Program {
  program_id: string;
  program_name: string;
}

type Course = {
  course_id: string;
  course_description: string;
  course_code: string;
  unit: number;
  year_level: string; // add this
  sem: string; // add this
};

interface ProgramContextType {
  programs: Program[];
  programCourses: Course[];
  fetchPrograms: () => Promise<void>;
  fetchProgramCourses: (programId: string) => Promise<void>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  fetchGroupedProgramCourses: (programId: string) => Promise<void>; // ✅ new
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export const ProgramProvider = ({ children }: { children: ReactNode }) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programCourses, setProgramCourses] = useState<Course[]>([]); // ✅ Added state
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = async (): Promise<void> => {
    try {
      const response = await axios.get(
        "http://localhost/NSTSPS_API/controller/ProgramController.php"
      );

      if (Array.isArray(response.data)) {
        setPrograms(response.data);
        setError(null);
      } else {
        setPrograms([]);
        setError("Failed to fetch programs.");
        toast.error("Failed to fetch programs.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? err.message ?? "Program request failed";
      setError(message);
      setPrograms([]);
    }
  };

  // ✅ Fixed function
  const fetchProgramCourses = async (programId: string): Promise<void> => {
    try {
      const response = await axios.get(
        `http://localhost/NSTSPS_API/controller/ProgramCoursesController.php?program_id=${programId}`
      );

      if (Array.isArray(response.data)) {
        setProgramCourses(response.data);
        setError(null);
      } else {
        setProgramCourses([]);
        toast.error("Failed to fetch courses.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? err.message ?? "Course request failed";
      setError(message);
      setProgramCourses([]);
      toast.error(message);
    }
  };

  // inside ProgramProvider
  const fetchGroupedProgramCourses = async (
    programId: string
  ): Promise<void> => {
    try {
      const response = await axios.get(
        `http://localhost/NSTSPS_API/controller/ProgramCoursessController.php?program_id=${programId}`
      );

      if (Array.isArray(response.data)) {
        setProgramCourses(response.data); // this will now contain the joined course info
        setError(null);
        console.log("Fetched grouped courses:", response.data);
      } else {
        setProgramCourses([]);
        toast.error("Failed to fetch grouped program courses.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ??
        err.message ??
        "Grouped courses request failed";
      setError(message);
      setProgramCourses([]);
      toast.error(message);
    }
  };

  const value: ProgramContextType = {
    programs,
    programCourses, // ✅ Expose it
    fetchPrograms,
    fetchProgramCourses,
    error,
    setError,
    fetchGroupedProgramCourses,
  };

  return (
    <ProgramContext.Provider value={value}>{children}</ProgramContext.Provider>
  );
};

export const useProgram = () => {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error("useProgram must be used within a ProgramProvider");
  }
  return context;
};
