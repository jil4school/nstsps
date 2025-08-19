import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRegistrationContext } from "@/context/registration-context";
import React, { useEffect, useState } from "react";
import logo from "./assets/logoo.png";
import { useMasterFile } from "./context/master-file-context";
import { useLogin } from "./context/login-context";

// paste your getRegistrationById function here if it's not imported

function RegistrationDetailsTable() {
  const { user } = useLogin();
  const { registrations, loading, error, getRegistrationById } =
    useRegistrationContext();
  const { student, fetchStudentInfo } = useMasterFile();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [courseData, setCourseData] = useState<
    Record<
      number,
      { codes?: string[]; descriptions?: string[]; units?: number[] }
    >
  >({});

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  useEffect(() => {
    if (user?.user_id) {
      fetchStudentInfo(String(user.user_id));
      
    }
  }, [user]);

  const toggleRow = async (
    index: number,
    registration_id: string,
    master_file_id: string,
    user_id: string
  ) => {
    if (expandedRow === index) {
      setExpandedRow(null);
      return;
    }

    // Fetch course data only if not already loaded
    if (!courseData[index]) {
      const regDetails = await getRegistrationById(
        registration_id,
        master_file_id,
        user_id
      );
      if (regDetails) {
        setCourseData((prev) => ({
          ...prev,
          [index]: {
            codes: regDetails.course_codes ?? [],
            descriptions: regDetails.course_descriptions ?? [],
            units: regDetails.units ?? [],
          },
        }));
      }
    }

    setExpandedRow(index);
  };
  const totalUnits = (courseData[expandedRow ?? -1]?.units ?? []).reduce(
    (sum, unit) => sum + (typeof unit === "number" ? unit : 0),
    0
  );
  return (
    <Table>
      <TableHeader className="bg-[#919090] text-white">
        <TableRow>
          <TableHead>S/ID.</TableHead>
          <TableHead>STUDENT NAME</TableHead>
          <TableHead>REG DATE</TableHead>
          <TableHead>SEMESTER</TableHead>
          <TableHead>PROGRAM</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registrations.map((studentt, index) => (
            <React.Fragment
              key={`${studentt.registration_id}-${studentt.user_id}-${studentt.master_file_id}`}
            >
              <TableRow
                key={studentt.master_file_id}
                onClick={() =>
                  toggleRow(
                    index,
                    studentt.registration_id,
                    studentt.master_file_id,
                    studentt.user_id
                  )
                }
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-[#1BB2EF] text-white"
                } cursor-pointer`}
              >
                <TableCell className="font-medium">
                  {studentt.student_id}
                </TableCell>
                <TableCell>{studentt.studentName}</TableCell>
                <TableCell>{studentt.registration_date}</TableCell>
                <TableCell>{studentt.sem}</TableCell>
                <TableCell>{studentt.program_name}</TableCell>
              </TableRow>

              {expandedRow === index && (
                <TableRow>
                  <TableCell colSpan={5} className="p-0">
                    <div className="bg-white p-4 shadow-inner">
                      <img src={logo} alt="Logo" className="w-40 h-10" />
                      <div className="flex justify-center mb-3">
                        <span className="FLEX text-lg font-semibold justify-self-center">
                          COURSES
                        </span>
                      </div>
                      <Table className="w-full table-fixed mb-5">
                        <TableHeader>
                          <TableRow className="bg-gray-100">
                            <TableHead className="w-1/3">Code</TableHead>
                            <TableHead className="w-1/3">Course</TableHead>
                            <TableHead className="w-1/3">Unit</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(courseData[index]?.codes || []).map((code, i) => (
                            <TableRow key={i}>
                              <TableCell className="w-1/3">
                                {code.toUpperCase()}
                              </TableCell>
                              <TableCell className="w-1/3">
                                {(courseData[index]?.descriptions ?? [])[i]}
                              </TableCell>
                              <TableCell className="w-1/3">
                                {courseData[index]?.units
                                  ? courseData[index]?.units[i]
                                  : ""}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <span>
                        <span className="font-semibold">
                          Total No. of Units:
                        </span>{" "}
                        {totalUnits}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}

export default RegistrationDetailsTable;
