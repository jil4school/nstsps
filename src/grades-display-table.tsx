import { Fragment, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRegistrationContext } from "@/context/registration-context";
import logo from "./assets/logoo.png";
import { useMasterFile } from "./context/master-file-context";
import { useGradesContext } from "@/context/grades-context";

function GradesDisplayTable() {
  const [selectedRegistration, setSelectedRegistration] = useState<any | null>(
    null
  );
  const { grades, fetchGrades } = useGradesContext();

  const { registrations, loading, error, getRegistrationById } =
    useRegistrationContext();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const { student, fetchStudentInfo } = useMasterFile();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      fetchStudentInfo(userId);
    }
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleRowClick = async (registrationId: string) => {
    if (expandedRow === registrationId) {
      setExpandedRow(null);
      setSelectedRegistration(null);
    } else {
      setExpandedRow(registrationId);
      const userId = localStorage.getItem("user_id") || "";
      const reg = await getRegistrationById(
        registrationId,
        String(student?.student_id),
        userId
      );
      setSelectedRegistration(reg);

      if (reg?.studentId && reg?.registration_id) {
        await fetchGrades(reg.studentId, reg.registration_id);
      }
    }
  };
  const totalUnits = grades.reduce((sum, grade) => {
    const unit = parseFloat(grade.unit);
    return sum + (isNaN(unit) ? 0 : unit);
  }, 0);

  const gwa = () => {
    if (grades.length === 0) return 0;

    let totalWeightedGrades = 0;
    let totalUnits = 0;

    grades.forEach((subject) => {
      const grade = parseFloat(subject.grade);
      const units = parseFloat(subject.unit);

      if (!isNaN(grade) && !isNaN(units)) {
        totalWeightedGrades += grade * units;
        totalUnits += units;
      }
    });

    const gwa = totalUnits === 0 ? 0 : totalWeightedGrades / totalUnits;
    return gwa.toFixed(2);
  };

  return (
    <Table>
      <TableHeader className="bg-[#919090] text-white">
        <TableRow>
          <TableHead>S/ID.</TableHead>
          <TableHead>STUDENT NAME</TableHead>
          <TableHead>S.Y.</TableHead>
          <TableHead>SEMESTER</TableHead>
          <TableHead>PROGRAM</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registrations.map((studentReg, index) => (
          <Fragment key={studentReg.registration_id}>
            <TableRow
              onClick={() => handleRowClick(studentReg.registration_id)}
              className={`cursor-pointer ${
                index % 2 === 0 ? "bg-white" : "bg-[#1BB2EF] text-white"
              } hover:bg-gray-200`}
            >
              <TableCell className="font-medium">
                {studentReg.studentId}
              </TableCell>
              <TableCell>{studentReg.studentName}</TableCell>
              <TableCell>{studentReg.registration_date}</TableCell>
              <TableCell>{studentReg.sem}</TableCell>
              <TableCell>{studentReg.program_name}</TableCell>
            </TableRow>

            {expandedRow === studentReg.registration_id && (
              <TableRow className="bg-white">
                <TableCell colSpan={5}>
                  <div className="h-fit w-full bg-white p-2">
                    <img src={logo} alt="Logo" className="w-40 h-10" />
                    <div className="flex justify-center">
                      <span className="FLEX text-lg font-semibold justify-self-center">
                        SUMMARY OF GRADES
                      </span>
                    </div>
                    <div className="flex flex-row gap-2 text-[13px]">
                      <div className="flex flex-col mt-5 ml-8">
                        <span>Name of Student: </span>
                        <span>School Year:</span>
                        <span>Semester:</span>
                      </div>
                      <div className="flex flex-col mt-5">
                        <span>
                          {student?.surname || "LN"},{" "}
                          {student?.first_name || "FN"}{" "}
                          {student?.middle_name
                            ? `${student.middle_name.charAt(0)}.`
                            : "M."}
                        </span>
                        <span>
                          {selectedRegistration?.school_year || "N/A"}
                        </span>
                        <span>{selectedRegistration?.sem || "N/A"}</span>
                      </div>
                      <div className="flex flex-col mt-5 ml-70">
                        <span>Program:</span>
                        <span>Year:</span>
                      </div>
                      <div className="flex flex-col mt-5">
                        <span>{student?.program_name}</span>
                        <span>{selectedRegistration?.year_level}</span>
                      </div>
                    </div>
                    <div className=" flex flex-col mt-5 ml-10 mr-10">
                      <table
                        cellPadding={8}
                        cellSpacing={0}
                        style={{
                          width: "100%",
                          fontSize: "14px",
                          borderCollapse: "collapse",
                          border: "1px solid #000000",
                        }}
                      >
                        <thead>
                          <tr>
                            <th
                              style={{
                                border: "1px solid #000000",
                                textAlign: "center",
                              }}
                            >
                              Code
                            </th>
                            <th style={{ border: "1px solid #000000" }}>
                              Courses
                            </th>
                            <th style={{ border: "1px solid #000000" }}>
                              Unit
                            </th>
                            <th style={{ border: "1px solid #000000" }}>
                              Grade
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {grades.map((grade, idx) => (
                            <tr key={`${grade.grade_id ?? "grade"}-${idx}`}>
                              <td
                                style={{
                                  border: "1px solid #000000",
                                  textAlign: "center",
                                }}
                              >
                                {grade.course_code?.toUpperCase() || "N/A"}
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000000",
                                  textAlign: "center",
                                }}
                              >
                                {grade.course_description || "N/A"}
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000000",
                                  textAlign: "center",
                                }}
                              >
                                {grade.unit || "N/A"}
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000000",
                                  textAlign: "center",
                                }}
                              >
                                {grade.grade || "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="flex flex-row mt-3 justify-between text-[13px]">
                        <span>Total No. of Units: {totalUnits}</span>
                        <span>GWA: {gwa()}</span>
                      </div>
                      <div className="mt-2 text-[13px]">
                        <span>Legend:</span>{" "}
                      </div>
                      <div className="flex flex-row mt-2 text-[13px] justify-between">
                        <span>98-100 = 1.00 </span>
                        <span>95-97 = 1.25</span>
                        <span>92-94 = 1.50</span>
                        <span>89-91 = 1.75</span>
                        <span>86-88 = 2.00</span>
                      </div>
                      <div className="flex flex-row mt-2 text-[13px] justify-between ">
                        <span>83-85 = 2.25</span>
                        <span>80-82 = 2.50</span>
                        <span>77-79 = 2.75</span>
                        <span>76-75 = 3.00</span>
                        <span>Below 75 = 5.00</span>
                      </div>
                      <div className="flex flex-row mt-2 text-[13px] justify-between">
                        <span>INC = Incomplete</span>
                        <span>DRP = Officially Dropped</span>
                        <span>NFE = No Final Exam</span>
                      </div>
                    </div>
                    <div className="flex justify-center text-[13px] mt-5 text-center">
                      <div className="flex flex-col justify-center w-fit">
                        <span className="flex font-semibold justify-self-center underline">
                          Norma P. Blanco, Ed.D.
                        </span>
                        <span className="flex text-[12px] justify-center">
                          Director for Academics
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}

export default GradesDisplayTable;
