import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useMasterFile } from "./master-file-context";

type Registration = {
  userId: string;
  registration_id: string;
  studentId: string;
  studentName: string;
  registration_date: string;
  sem: string;
  program_id: string;
  program_name?: string;
  year_level?: string;
  school_year?: string;
  course_code?: string;
  course_description?: string;
  course_codes?: string[];
  course_descriptions?: string[];
  units?: number[];
};

type RegistrationContextType = {
  registrations: Registration[];
  loading: boolean;
  error: string | null;
  getRegistrationById: (registrationId: string, userId: string, studentId: string) => Promise<Registration | null>;
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
  const { fetchStudentInfo } = useMasterFile();

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
        userId: item.user_id,
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
  registrationId: string,
  studentId: string, // now expecting student_id
  userId: string
): Promise<Registration | null> => {
  try {
    const response = await axios.get(
    `http://localhost/NSTSPS_API/controller/RegistrationController.php`,
    {
      params: {
        registration_id: registrationId,
        student_id: studentId,
        user_id: userId
      }
      }
    );

    const item = response.data;

    if (!item || item.error) {
      toast.error(`No registration found for ID: ${registrationId}`);
      return null;
    }

    return {
      userId: item.user_id,
      studentId: item.student_id,
      studentName: `${item.first_name} ${item.middle_name} ${item.last_name}`,
      registration_date: item.registration_date,
      sem: item.sem,
      program_id: item.program_id,
      registration_id: item.registration_id,
      program_name: item.program_name,
      school_year: item.school_year,
      year_level: item.year_level,
      course_codes: item.course_codes || [],
      course_descriptions: item.course_descriptions || [],
      units: item.units || []
    };
  } catch (err) {
    toast.error(
      `Error fetching registration by ID: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
    return null;
  }
};


  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      fetchRegistrationData(userId);
      fetchStudentInfo(userId);
      
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
