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
import { Trash2, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";

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
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    index: number | null;
    courseIndex: number | null;
  }>({ open: false, index: null, courseIndex: null });

  const [removedRegCourseIds, setRemovedRegCourseIds] = useState<number[]>([]);

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
                                <TableHead className="w-1/4">Code</TableHead>
                                <TableHead className="w-1/2">Course</TableHead>
                                <TableHead className="w-1/6">Unit</TableHead>
                                <TableHead className="w-1/12"></TableHead>
                              </TableRow>
                            </TableHeader>

                            <TableBody>
                              {(courseData[index]?.codes || []).map(
                                (code, i) => (
                                  <TableRow key={i}>
                                    {/* CODE */}
                                    <TableCell className="w-1/4">
                                      <input
                                        type="text"
                                        value={
                                          courseData[index]?.codes?.[i] || ""
                                        }
                                        disabled
                                        className="w-full p-1 text-gray-600 cursor-not-allowed"
                                      />
                                    </TableCell>

                                    {/* DESCRIPTION */}
                                    <TableCell className="w-1/2">
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

                                    {/* UNITS */}
                                    <TableCell className="w-1/6">
                                      <input
                                        type="number"
                                        value={
                                          courseData[index]?.units?.[i] || ""
                                        }
                                        disabled
                                        className="w-full p-1 text-gray-600 cursor-not-allowed"
                                      />
                                    </TableCell>

                                    {/* REMOVE BUTTON */}
                                    <TableCell className="w-1/12">
                                      <button
                                        onClick={() =>
                                          setDeleteDialog({
                                            open: true,
                                            index,
                                            courseIndex: i,
                                          })
                                        }
                                        className="text-red-600 hover:text-red-800 p-1"
                                        title="Remove Course"
                                      >
                                        <Trash2 size={18} />
                                      </button>
                                      <Dialog
                                        open={deleteDialog.open}
                                        onOpenChange={(open) =>
                                          setDeleteDialog({
                                            open,
                                            index: null,
                                            courseIndex: null,
                                          })
                                        }
                                      >
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>
                                              Remove Course
                                            </DialogTitle>
                                            <DialogDescription>
                                              Are you sure you want to remove
                                              this course? This action cannot be
                                              undone.
                                            </DialogDescription>
                                          </DialogHeader>
                                          <DialogFooter>
                                            <button
                                              className="px-4 py-2 bg-gray-300 rounded"
                                              onClick={() =>
                                                setDeleteDialog({
                                                  open: false,
                                                  index: null,
                                                  courseIndex: null,
                                                })
                                              }
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                              onClick={() => {
                                                if (
                                                  deleteDialog.index !== null &&
                                                  deleteDialog.courseIndex !==
                                                    null
                                                ) {
                                                  const regIdToRemove =
                                                    courseData[
                                                      deleteDialog.index
                                                    ]?.reg_courses_id?.[
                                                      deleteDialog.courseIndex
                                                    ];

                                                  if (regIdToRemove) {
                                                    setRemovedRegCourseIds(
                                                      (prev) => [
                                                        ...prev,
                                                        regIdToRemove,
                                                      ]
                                                    );
                                                  }

                                                  setCourseData((prev) => {
                                                    if (
                                                      deleteDialog.index ===
                                                      null
                                                    ) {
                                                      return prev;
                                                    }
                                                    const newCodes = [
                                                      ...(prev[
                                                        deleteDialog.index
                                                      ]?.codes || []),
                                                    ];
                                                    const newDescriptions = [
                                                      ...(prev[
                                                        deleteDialog.index
                                                      ]?.descriptions || []),
                                                    ];
                                                    const newUnits = [
                                                      ...(prev[
                                                        deleteDialog.index
                                                      ]?.units || []),
                                                    ];
                                                    const newRegIds = [
                                                      ...(prev[
                                                        deleteDialog.index
                                                      ]?.reg_courses_id || []),
                                                    ];

                                                    newCodes.splice(
                                                      deleteDialog.courseIndex!,
                                                      1
                                                    );
                                                    newDescriptions.splice(
                                                      deleteDialog.courseIndex!,
                                                      1
                                                    );
                                                    newUnits.splice(
                                                      deleteDialog.courseIndex!,
                                                      1
                                                    );
                                                    newRegIds.splice(
                                                      deleteDialog.courseIndex!,
                                                      1
                                                    );

                                                    return {
                                                      ...prev,
                                                      [deleteDialog.index]: {
                                                        ...prev[
                                                          deleteDialog.index
                                                        ],
                                                        codes: newCodes,
                                                        descriptions:
                                                          newDescriptions,
                                                        units: newUnits,
                                                        reg_courses_id:
                                                          newRegIds,
                                                      },
                                                    };
                                                  });

                                                  setDeleteDialog({
                                                    open: false,
                                                    index: null,
                                                    courseIndex: null,
                                                  });
                                                }
                                              }}
                                            >
                                              Remove
                                            </button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                              {/* ✅ Add row at the bottom */}
                              <TableRow className="bg-gray-50 hover:bg-gray-100">
                                <TableCell colSpan={4} className="p-2">
                                  <div className="flex items-center justify-center">
                                    <button
                                      onClick={() => {
                                        setCourseData((prev) => ({
                                          ...prev,
                                          [index]: {
                                            codes: [
                                              ...(prev[index]?.codes || []),
                                              "",
                                            ],
                                            descriptions: [
                                              ...(prev[index]?.descriptions ||
                                                []),
                                              "",
                                            ],
                                            units: [
                                              ...(prev[index]?.units || []),
                                              0,
                                            ],
                                            reg_courses_id: [
                                              ...(prev[index]?.reg_courses_id ||
                                                []),
                                              null,
                                            ],
                                          },
                                        }));
                                      }}
                                      className="flex items-center gap-1 text-green-600 hover:text-green-800 font-medium"
                                    >
                                      <Plus size={18} />
                                      <span>Add</span>
                                    </button>
                                  </div>
                                </TableCell>
                              </TableRow>
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
                                  ),
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
                                  payload,
                                  removedRegCourseIds // 🔴 send deleted IDs
                                );

                                if (success) {
                                  toast.success("Registration updated!");
                                  setRemovedRegCourseIds([]); // reset after save
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
