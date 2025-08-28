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
import { useParams } from "react-router-dom";
import HeaderAdmin from "./header-admin";
import { useProgram } from "@/context/miscellaneous-context";
import { toast } from "sonner";

// StudentRegistrations.tsx

export function StudentRegistrations() {
  const { combinedId } = useParams<{ combinedId: string }>();
  const [student_id, user_id] = combinedId ? combinedId.split("-") : ["", ""];

  return (
    <AdminRegistrationProvider userId={user_id}>
      <StudentRegistrationsContent student_id={student_id} user_id={user_id} />
    </AdminRegistrationProvider>
  );
}

export default function StudentRegistrationsContent({
  student_id,
  user_id,
}: {
  student_id: string;
  user_id: string;
}) {
  console.log("Student ID:", student_id);
  console.log("User ID:", user_id);

  const { programCourses, fetchProgramCourses } = useProgram();
  const {
    registrations,
    loading,
    error,
    getRegistrationById,
    updateRegistration,
  } = useAdminRegistrationContext();
  const { student, fetchStudentInfo } = useMasterFile();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [courseData, setCourseData] = useState<
    Record<
      number,
      {
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
      const regDetails = await getRegistrationById(
        registration_id,
        master_file_id,
        user_id
      );

      if (regDetails) {
        // regDetails should now include reg_courses_id array from backend
        setCourseData((prev) => ({
          ...prev,
          [index]: {
            codes: regDetails.course_codes ?? [],
            descriptions: regDetails.course_descriptions ?? [],
            units: regDetails.units ?? [],
            reg_courses_id: regDetails.reg_courses_id ?? [], // ✅ add this
          },
        }));
      }
    }

    // Fetch program courses
    await fetchProgramCourses(program_id);

    setExpandedRow(index);
  };

  const totalUnits = (courseData[expandedRow ?? -1]?.units ?? []).reduce(
    (sum, unit) => sum + (typeof unit === "number" ? unit : 0),
    0
  );
  return (
    <div className="flex flex-row h-screen w-screen bg-white">
      <div className="flex flex-col w-full">
        <HeaderAdmin />

        <div className="flex pl-10 pr-10 mt-25">
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
                              {(courseData[index]?.codes || []).map(
                                (code, i) => (
                                  <TableRow key={i}>
                                    {/* CODE (non-editable) */}
                                    <TableCell className="w-1/3">
                                      <input
                                        type="text"
                                        value={
                                          courseData[index]?.codes?.[i] || ""
                                        }
                                        disabled
                                        className="w-full p-1 text-gray-600 cursor-not-allowed"
                                      />
                                    </TableCell>

                                    {/* COURSE DESCRIPTION (editable dropdown) */}
                                    <TableCell className="w-1/3">
                                      <select
                                        value={
                                          courseData[index]?.descriptions?.[
                                            i
                                          ] || ""
                                        }
                                        onChange={(e) => {
                                          const selectedDescription =
                                            e.target.value;
                                          const selectedCourse =
                                            programCourses.find(
                                              (course) =>
                                                course.course_description ===
                                                selectedDescription
                                            );

                                          setCourseData((prev) => ({
                                            ...prev,
                                            [index]: {
                                              ...prev[index],
                                              descriptions: prev[
                                                index
                                              ]?.descriptions?.map((d, di) =>
                                                di === i
                                                  ? selectedDescription
                                                  : d
                                              ),
                                              codes: prev[index]?.codes?.map(
                                                (c, ci) =>
                                                  ci === i
                                                    ? selectedCourse?.course_code ||
                                                      ""
                                                    : c
                                              ),
                                              units: prev[index]?.units?.map(
                                                (u, ui) =>
                                                  ui === i
                                                    ? selectedCourse?.unit || 0
                                                    : u
                                              ),
                                            },
                                          }));
                                        }}
                                        className="w-full p-1 focus:outline-none"
                                      >
                                        <option value="">
                                          -- Select Course --
                                        </option>
                                        {programCourses.map((course) => (
                                          <option
                                            key={course.course_id}
                                            value={course.course_description}
                                          >
                                            {course.course_description}
                                          </option>
                                        ))}
                                      </select>
                                    </TableCell>

                                    {/* UNITS (non-editable) */}
                                    <TableCell className="w-1/3">
                                      <input
                                        type="number"
                                        value={
                                          courseData[index]?.units?.[i] || ""
                                        }
                                        disabled
                                        className="w-full p-1 text-gray-600 cursor-not-allowed"
                                      />
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                          <div className="flex justify-between items-center mt-3">
                            <span className="font-semibold">
                              Total No. of Units: {totalUnits}
                            </span>
                            <button
                              onClick={async () => {
                                if (!courseData[index]) return;

                                // Prepare payload for backend
                                const payload = (
                                  courseData[index].codes || []
                                ).map((_, i) => ({
                                  reg_courses_id: Number(
                                    courseData[index].reg_courses_id?.[i]
                                  ), // ✅ backend ID
                                  course_id: Number(
                                    programCourses.find(
                                      (c) =>
                                        c.course_description ===
                                        courseData[index].descriptions?.[i]
                                    )?.course_id ?? 0
                                  ),
                                }));

                                // Call updateRegistration from context
                                const success = await updateRegistration(
                                  registrations[index].registration_id,
                                  registrations[index].master_file_id,
                                  user_id,
                                  payload
                                );

                                if (success) {
                                  toast.success("Registration updated!");
                                }
                              }}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                            >
                              Save
                            </button>
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
