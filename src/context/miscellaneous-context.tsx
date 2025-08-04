import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

interface Program {
  program_id: string;
  program_name: string;
}

interface ProgramContextType {
  programs: Program[];
  fetchPrograms: () => Promise<void>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export const ProgramProvider = ({ children }: { children: ReactNode }) => {
  const [programs, setPrograms] = useState<Program[]>([]);
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
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? err.message ?? "Program request failed";

      console.error("Axios error (program):", err);
      setError(message);
      setPrograms([]);
    }
  };

  // Optional: auto-fetch on mount
  useEffect(() => {
    fetchPrograms();
  }, []);

  const value: ProgramContextType = {
    programs,
    fetchPrograms,
    error,
    setError,
  };

  return (
    <ProgramContext.Provider value={value}>
      {children}
    </ProgramContext.Provider>
  );
};

export const useProgram = () => {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error("useProgram must be used within a ProgramProvider");
  }
  return context;
};
