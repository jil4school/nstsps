import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

type Registration = {
  registration_id: string;
  studentId: string;
  studentName: string;
  registration_date: string;
  sem: string;
  program_id: string;
  program_name?: string;
  year_level?: string;
  school_year?: string;
};

type RegistrationContextType = {
  registrations: Registration[];
  loading: boolean;
  error: string | null;
  getRegistrationById: (registrationId: string) => Promise<Registration | null>;
};

const RegistrationContext = createContext<RegistrationContextType>({
  registrations: [],
  loading: false,
  error: null,
  getRegistrationById: async () => null,
});

export const RegistrationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistrationData = async (userId: string) => {
    try {
      const response = await axios.get(
        `http://localhost/NSTSPS_API/controller/RegistrationController.php?user_id=${userId}`
      );

      if (!Array.isArray(response.data)) {
        toast.error("No student data found", response.data);
        setError("No student data found.");
        setRegistrations([]);
        return;
      }

      const formatted = response.data.map((item: any) => ({
        studentId: item.student_id,
        studentName: `${item.first_name} ${item.middle_name} ${item.last_name}`,
        registration_date: item.registration_date,
        sem: item.sem,
        program_id: item.program_id,
        registration_id: item.registration_id,
        program_name: item.program_name,
        school_year: item.school_year,
      }));

      setRegistrations(formatted);
    } catch (err) {
      toast.error(
        `API fetch error: ${err instanceof Error ? err.message : String(err)}`
      );
      setError("Something went wrong while fetching.");
      setRegistrations([]);
    }
  };

  const getRegistrationById = async (
    registrationId: string
  ): Promise<Registration | null> => {
    try {
      const response = await axios.get(
        `http://localhost/NSTSPS_API/controller/RegistrationController.php?registration_id=${registrationId}`
      );

      const item = response.data;

      if (!item || item.error) {
        toast.error(`No registration found for ID: ${registrationId}`);
        return null;
      }

      return {
        studentId: item.student_id,
        studentName: `${item.first_name} ${item.middle_name} ${item.last_name}`,
        registration_date: item.registration_date,
        sem: item.sem,
        program_id: item.program_id,
        registration_id: item.registration_id,
        program_name: item.program_name,
        school_year: item.school_year,
        year_level: item.year_level,
      };
    } catch (err) {
      toast.error(
        `Error fetching registration by ID: ${err instanceof Error ? err.message : String(err)}`
      );
      return null;
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      fetchRegistrationData(userId);
    } else {
      setError("No user_id found in localStorage.");
      toast.error("No user_id found in localStorage.");
    }
  }, []);

  return (
    <RegistrationContext.Provider
      value={{ registrations, loading, error, getRegistrationById }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistrationContext = () => useContext(RegistrationContext);
