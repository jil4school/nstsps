// StudentGradeRecords.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AdminRegistrationProvider,
  useAdminRegistrationContext,
} from "@/context/admin-registration-context";
import React, { useEffect, useState } from "react";
import { useMasterFile } from "./context/master-file-context";
import { useNavigate, useParams } from "react-router-dom";
import HeaderAdmin from "./header-admin";
import { useProgram } from "@/context/miscellaneous-context";
import { toast } from "sonner";
import { useLogin } from "./context/login-context";
import { IoArrowBackSharp } from "react-icons/io5";
// ✅ Wrapper component like StudentRegistrations
export function StudentGradeRecords() {
  const { combinedId } = useParams<{ combinedId: string }>();
  const [student_id, user_id] = combinedId ? combinedId.split("-") : ["", ""];

  return (
    <AdminRegistrationProvider userId={user_id}>
      <StudentGradeRecordsContent student_id={student_id} user_id={user_id} />
    </AdminRegistrationProvider>
  );
}

// ✅ Main Content Component
export default function StudentGradeRecordsContent({
  student_id,
  user_id,
}: {
  student_id: string;
  user_id: string;
}) {
  const { programCourses, fetchProgramCourses } = useProgram();
  const {
    registrations, // still using registrations from context
    loading,
    error,
    getCoursesByRegistration,
    insertGrades,
  } = useAdminRegistrationContext();
  if (!registrations.length) return null;
  const { fetchStudentInfo } = useMasterFile();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [courseData, setCourseData] = useState<
    Record<
      number,
      {
        grades: any;
        reg_courses_id: any;
        codes?: string[];
        descriptions?: string[];
        units?: number[];
      }
    >
  >({});

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  useEffect(() => {
    if (user_id) {
      fetchStudentInfo(user_id);
    }
  }, [user_id]);

  const toggleRow = async (
    index: number,
    registration_id: string,
    master_file_id: string,
    user_id: string,
    program_id: string
  ) => {
    if (expandedRow === index) {
      setExpandedRow(null);
      return;
    }

    if (!courseData[index]) {
      const courses = await getCoursesByRegistration(
        registration_id,
        master_file_id,
        user_id
      );

      if (Array.isArray(courses)) {
        setCourseData((prev) => ({
          ...prev,
          [index]: {
            reg_courses_id: courses.map((c: any) => c.reg_courses_id),
            codes: courses.map((c: any) => c.course_code),
            descriptions: courses.map((c: any) => c.course_description),
            units: courses.map((c: any) => c.unit),
            grades: courses.map((c: any) => c.grade ?? ""), // ✅ include grade
          },
        }));
      }
    }

    await fetchProgramCourses(program_id);
    setExpandedRow(index);
  };

  const totalUnits = (courseData[expandedRow ?? -1]?.units ?? []).reduce(
    (sum, unit) => sum + (typeof unit === "number" ? unit : 0),
    0
  );
  const { user } = useLogin();
  const navigate = useNavigate();

  const goBack = () => {
    if (user) {
      navigate(`/nstsps/${user.role.toLowerCase()}-home`);
    }
  };
  return (
    <div className="flex flex-row h-screen w-screen bg-white">
      <div className="flex flex-col w-full">
        <HeaderAdmin />

        <div className="flex flex-col pl-10 pr-10 mt-25">
          <div className="flex justify-end pb-4">
            <button
              onClick={goBack}
              className="flex items-center text-blue-600 hover:underline text-sm font-medium"
            >
              <IoArrowBackSharp size={18} className="mr-1" />
              <span>Back</span>
            </button>
          </div>
          <Table>
            <TableHeader className="bg-[#919090] text-white">
              <TableRow>
                <TableHead>S/ID.</TableHead>
                <TableHead>STUDENT NAME</TableHead>
                <TableHead>REG DATE</TableHead>
                <TableHead>SCHOOL YEAR</TableHead>
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
                        studentt.user_id,
                        studentt.program_id
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
                    <TableCell>{studentt.school_year}</TableCell>
                    <TableCell>{studentt.sem}</TableCell>
                    <TableCell>{studentt.program_name}</TableCell>
                  </TableRow>

                  {expandedRow === index && (
                    <TableRow>
                      <TableCell colSpan={6} className="p-0">
                        <div className="bg-white p-4 shadow-inner">
                          <div className="flex justify-center mb-3">
                            <span className="text-lg font-semibold">
                              GRADES
                            </span>
                          </div>

                          {/* ✅ Inner table for courses */}
                          {/* ✅ Inner table for courses */}
                          <Table className="border table-fixed w-full">
                            <TableHeader className="bg-gray-200">
                              <TableRow>
                                <TableHead className="w-1/4 text-center">
                                  Course Code
                                </TableHead>
                                <TableHead className="w-1/4 text-center">
                                  Description
                                </TableHead>
                                <TableHead className="w-1/4 text-center">
                                  Units
                                </TableHead>
                                <TableHead className="w-1/4 text-center">
                                  Grades
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {courseData[index]?.codes?.map((code, i) => (
                                <TableRow key={i}>
                                  <TableCell className="text-center">
                                    {code}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {
                                      courseData[index].descriptions?.[
                                        Number(i)
                                      ]
                                    }
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {courseData[index].units?.[i]}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <input
                                      type="text"
                                      value={
                                        courseData[index].grades?.[i] || ""
                                      }
                                      onChange={(e) => {
                                        const newGrade = e.target.value;
                                        setCourseData((prev) => {
                                          const updated = { ...prev };
                                          if (!updated[index].grades)
                                            updated[index].grades = [];
                                          updated[index].grades[i] = newGrade;
                                          return { ...updated };
                                        });
                                      }}
                                      className="bg-transparent outline-none w-full text-center"
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>

                          {/* Total units + GWA + save button (GWA beside Save) */}
                          <div className="flex justify-between items-center mt-3 w-full">
                            {/* Left side: Total Units */}
                            <span className="font-semibold">
                              Total Units:{" "}
                              {(courseData[index]?.units ?? []).reduce(
                                (sum, unit) =>
                                  sum + (typeof unit === "number" ? unit : 0),
                                0
                              )}
                            </span>

                            {/* Right side: GWA + Save */}
                            <div className="flex items-center gap-15">
                              <span className="font-semibold">
                                GWA:{" "}
                                {(() => {
                                  const grades =
                                    courseData[index]?.grades || [];
                                  const units = courseData[index]?.units || [];

                                  let totalWeighted = 0;
                                  let totalUnits = 0;

                                  grades.forEach((g, i) => {
                                    const numericGrade = parseFloat(g);
                                    const unit = Number(units[i]);
                                    if (!isNaN(numericGrade) && !isNaN(unit)) {
                                      totalWeighted += numericGrade * unit;
                                      totalUnits += unit;
                                    }
                                  });

                                  return totalUnits > 0
                                    ? (totalWeighted / totalUnits).toFixed(2)
                                    : "N/A";
                                })()}
                              </span>

                              <button
                                onClick={async () => {
                                  if (!courseData[index]) return;

                                  const gradesPayload = (
                                    courseData[index].grades || []
                                  ).map((grade: any, i: number) => ({
                                    course_id: Number(
                                      programCourses.find(
                                        (c) =>
                                          c.course_description ===
                                          courseData[index].descriptions?.[i]
                                      )?.course_id ?? 0
                                    ),
                                    grade: grade || "", // can be "" if empty
                                  }));

                                  const success = await insertGrades(
                                    registrations[index].user_id,
                                    registrations[index].master_file_id,
                                    registrations[index].registration_id,
                                    gradesPayload
                                  );

                                  if (success) {
                                    toast.success("Grades saved!");
                                  } else {
                                    toast.error("Failed to save grades");
                                  }
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
