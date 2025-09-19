"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useRegistrationContext } from "@/context/registration-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useMasterFile } from "@/context/master-file-context";
import { useRequest } from "./context/request-context";
import { Link } from "react-router-dom";
import { useProgram } from "./context/miscellaneous-context";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { SelectContent } from "@radix-ui/react-select";

export type StudentInfo = {
  user_id: string;
  master_file_id: string;
  student_id: string;
  program_id: string;
  program_name: string;
  surname: string;
  first_name: string;
  middle_name?: string;
  request?: string;
  request_remarks?: string;
  request_purpose?: string;
  mode_of_payment?: string;
  receipt?: string;
  status?: string;
  gender?: string;
  nationality?: string;
  civil_status?: string;
  religion?: string;
  birthday?: string;
  birthplace?: string;
  street?: string;
  barangay?: string;
  region?: string;
  municipality?: string;
  mobile_number?: string;
  guardian_surname?: string;
  guardian_first_name?: string;
  relation_with_the_student?: string;
  guardian_mobile_number?: string;
  email: string;
  guardian_email?: string;
  year_level?: string;
  request_id: string;
};

export const baseColumns: ColumnDef<StudentInfo>[] = [
  {
    accessorKey: "student_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="justify-start"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Student ID <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("student_id")}</div>
    ),
  },
  {
    id: "full_name",
    header: () => <div className="text-left">Name</div>,
    cell: ({ row }) => {
      const { surname, first_name, middle_name } = row.original;
      return (
        <div className="text-left">
          {surname}, {first_name} {middle_name ?? ""}
        </div>
      );
    },
    sortingFn: (a, b) => {
      const aName = `${a.original.surname} ${a.original.first_name} ${
        a.original.middle_name ?? ""
      }`;
      const bName = `${b.original.surname} ${b.original.first_name} ${
        b.original.middle_name ?? ""
      }`;
      return aName.localeCompare(bName);
    },
  },
  {
    accessorKey: "program_name",
    header: () => <div className="text-left">Program</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("program_name")}</div>
    ),
  },
];

const actionsColumn = (activeTab: string): ColumnDef<StudentInfo> => ({
  id: "actions",
  enableHiding: false,
  cell: ({ row }) => {
    const student = row.original;
    const { updateRequestStatus } = useRequest();

    if (activeTab === "pending requests") {
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={(e) => {
              e.stopPropagation(); // <-- prevent dialog from opening
              updateRequestStatus(student.request_id, "Processing");
            }}
          >
            Process
          </Button>

          <Button
            size="sm"
            variant="destructive"
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={(e) => {
              e.stopPropagation(); // <-- prevent dialog from opening
              updateRequestStatus(student.request_id, "Declined");
            }}
          >
            Decline
          </Button>
        </div>
      );
    }

    if (activeTab === "processing requests") {
      return (
        <Button
          size="sm"
          className="bg-green-600 text-white hover:bg-green-700"
          onClick={(e) => {
            e.stopPropagation();
            updateRequestStatus(student.request_id, "Processed");
          }}
        >
          Processed
        </Button>
      );
    }

    if (activeTab === "archive requests") {
      return (
        <Button
          size="sm"
          variant="destructive"
          className="bg-red-600 text-white hover:bg-red-700"
          onClick={(e) => {
            e.stopPropagation();
            updateRequestStatus(student.request_id, "Deleted");
          }}
        >
          Delete
        </Button>
      );
    }

    // default for students tab
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(student.student_id);
            }}
          >
            Copy Student ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
            Edit Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
});

const extraColumns: ColumnDef<StudentInfo>[] = [
  {
    accessorKey: "year_level",
    header: () => <div className="text-left">Year Level</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("year_level")}</div>
    ),
  },
  {
    accessorKey: "request",
    header: () => <div className="text-left">Request</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("request")}</div>
    ),
  },
];

// Table column type
export type CourseInfo = {
  sem: string;
  year_level: string;
  course_id: string;
  course_code: string;
  course_description: string;
  unit: number;
};

const courseColumns: ColumnDef<CourseInfo>[] = [
  {
    id: "course_code",
    header: () => <div className="text-left">Course Code</div>,
    accessorFn: (row) => row.course_code,
    cell: (info) => <div className="text-left">{String(info.getValue())}</div>,
  },
  {
    id: "course_description",
    header: () => <div className="text-left">Description</div>,
    accessorFn: (row) => row.course_description,
    cell: (info) => <div className="text-left">{String(info.getValue())}</div>,
  },
  {
    id: "units",
    header: () => <div className="text-left">Units</div>,
    accessorFn: (row) => row.unit,
    cell: (info) => <div className="text-left">{String(info.getValue())}</div>,
  },
];

export function StudentTableRegistrar() {
  const {
    programs,
    programCourses,
    fetchPrograms,
    fetchGroupedProgramCourses,
  } = useProgram();
  const [selectedProgram, setSelectedProgram] = React.useState<string>("");
  const { fetchAllStudents } = useMasterFile();
  const { getRequestByRegistrationId } = useRegistrationContext();
  const { getAllRequests } = useRequest();
  const [students, setStudents] = React.useState<StudentInfo[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [selectedStudent, setSelectedStudent] =
    React.useState<StudentInfo | null>(null);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Inside StudentTableRegistrar component

  const [receiptDialogOpen, setReceiptDialogOpen] = React.useState(false);
  const [receiptUrl, setReceiptUrl] = React.useState<string | null>(null);
  const [courses, setCourses] = React.useState<CourseInfo[]>([]);

  const API_BASE = "http://localhost/NSTSPS_API"; // adjust to your backend base

  const handleViewReceipt = (receipt: string) => {
    if (receipt) {
      const url = `${API_BASE}/uploads/${receipt}`;
      setReceiptUrl(url);
      setSelectedStudent(null); // close student/request dialog
      setReceiptDialogOpen(true);
    }
  };

  React.useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      const data = await fetchAllStudents();

      if (data) {
        // Fetch request info for each student
        const withRequests = await Promise.all(
          data.map(async (student: any) => {
            const request = await getRequestByRegistrationId(
              student.registration_id
            );
            return { ...student, request: request ?? "—" }; // add request field
          })
        );
        setStudents(withRequests);
      }

      setLoading(false);
    };

    loadStudents();
  }, []);

  const [activeTab, setActiveTab] = React.useState<
    | "students"
    | "courses"
    | "pending requests"
    | "processing requests"
    | "archive requests"
  >("students");

  const columns = React.useMemo(() => {
    if (activeTab === "students") {
      return [...baseColumns];
    }
    if (activeTab === "courses") {
      return courseColumns;
    }

    return [...baseColumns, ...extraColumns, actionsColumn(activeTab)];
  }, [activeTab]);

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      if (activeTab === "students") {
        const data = await fetchAllStudents();
        setStudents(data || []);
      } else if (activeTab === "courses") {
        fetchPrograms(); // fetch programs from context if not already loaded
        if (selectedProgram) {
          fetchGroupedProgramCourses(selectedProgram); // populate programCourses
        }
      } else {
        const requests = await getAllRequests();

        let withStudentData: StudentInfo[] = requests.map((req: any) => ({
          user_id: req.user_id,
          master_file_id: req.master_file_id ?? "",
          student_id: req.student_id ?? "",
          surname: req.last_name ?? "",
          first_name: req.first_name ?? "",
          middle_name: req.middle_name ?? "",
          program_id: req.program_id ?? "",
          program_name: req.program_name ?? "",
          // request-specific fields
          request_id: req.request_id ?? "",
          year_level: req.year_level ?? "",
          request: req.request ?? "",
          request_remarks: req.request_remarks ?? "",
          request_purpose: req.request_purpose ?? "",
          mode_of_payment: req.mode_of_payment ?? "",
          receipt: req.receipt ?? "",
          status: req.status ?? "",
        }));

        if (activeTab === "pending requests") {
          withStudentData = withStudentData.filter(
            (r) => r.status === "Pending"
          );
        } else if (activeTab === "processing requests") {
          withStudentData = withStudentData.filter(
            (r) => r.status === "Processing"
          );
        } else if (activeTab === "archive requests") {
          withStudentData = withStudentData.filter(
            (r) => r.status === "Processed" || r.status === "Declined"
          );
        }

        setStudents(withStudentData);
      }

      setLoading(false);
    };

    loadData();
  }, [activeTab, fetchAllStudents, getAllRequests]);

  const table = useReactTable({
    data: students,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    globalFilterFn: (row, filterValue) => {
      const student = row.original as StudentInfo;

      const haystackParts = [
        student.student_id,
        student.surname,
        student.first_name,
        student.middle_name ?? "",
        student.program_name,
        (row.getValue("email") as string) ?? "",
      ];

      const fullName1 = `${student.surname}, ${[
        student.first_name,
        student.middle_name,
      ]
        .filter(Boolean)
        .join(" ")}`;
      const fullName2 = [
        student.first_name,
        student.middle_name,
        student.surname,
      ]
        .filter(Boolean)
        .join(" ");

      const haystack = [...haystackParts, fullName1, fullName2]
        .join(" ")
        .replace(/\s+/g, " ")
        .toLowerCase();

      return haystack.includes(filterValue.toLowerCase().trim());
    },
  });

  const courseGroups = [
    { year: "1st Year", sem: "First Sem" },
    { year: "1st Year", sem: "Second Sem" },
    { year: "2nd Year", sem: "First Sem" },
    { year: "2nd Year", sem: "Second Sem" },
    { year: "3rd Year", sem: "First Sem" },
    { year: "3rd Year", sem: "Second Sem" },
    { year: "4th Year", sem: "First Sem" },
    { year: "4th Year", sem: "Second Sem" },
  ];

  React.useEffect(() => {
    if (activeTab === "courses" && selectedProgram) {
      fetchGroupedProgramCourses(selectedProgram);
    }
  }, [activeTab, selectedProgram]);

  React.useEffect(() => {
    if (selectedProgram) {
      fetchGroupedProgramCourses(selectedProgram); // just call it
    }
  }, [selectedProgram]);
  // Inside StudentTableRegistrar
  React.useEffect(() => {
    if (activeTab === "courses" && programs.length > 0 && !selectedProgram) {
      setSelectedProgram(programs[0].program_id);
    }
  }, [activeTab, programs]);

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex space-x-4 mb-4 text-sm font-medium">
        {[
          { label: "Students", value: "students" },
          { label: "Courses", value: "courses" },
          { label: "Pending Requests", value: "pending requests" },
          { label: "Processing Requests", value: "processing requests" },
          { label: "Archive Requests", value: "archive requests" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value as any)}
            className={`pb-2 ${
              activeTab === tab.value
                ? "border-b-2 border-black"
                : "text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="flex items-center justify-between py-4 w-full">
        {activeTab === "courses" ? (
          <Select
            value={selectedProgram}
            onValueChange={(value) => setSelectedProgram(value)}
          >
            <SelectTrigger className="min-w-[150px] px-4 py-2 rounded-md shadow-sm border bg-white text-gray-700 hover:border-primary focus:ring-2 focus:ring-primary transition-all duration-200 w-auto">
              <SelectValue placeholder="Select Program" />
            </SelectTrigger>

            <SelectContent className="rounded-sm shadow-lg bg-white max-h-[250px] overflow-y-auto">
              {programs.map((program) => (
                <SelectItem
                  key={program.program_id}
                  value={program.program_id}
                  className="py-2 px-4 cursor-pointer hover:bg-primary/10 rounded-lg transition-colors duration-150"
                >
                  {program.program_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        )}

        {activeTab === "students" && (
          <Link to="/nstsps/registrar/student-registration">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              Upload Registrations
            </Button>
          </Link>
        )}
      </div>
      {activeTab === "courses" ? (
        <div className="space-y-8 mb-5">
          {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((year) => (
            <div key={year}>
              <h2 className="text-lg font-semibold">{year}</h2>
              <hr className="my-2 border-gray-300" />

              <div className="grid grid-cols-2 gap-8">
                {["First Semester", "Second Semester"].map((sem) => {
                  const groupCourses: CourseInfo[] = programCourses
                    .filter((c) => c.year_level === year && c.sem === sem)
                    .map((c) => ({
                      course_id: c.course_id,
                      course_code: c.course_code,
                      course_description: c.course_description,
                      year_level: c.year_level,
                      sem: c.sem,
                      unit: c.unit,
                    }));

                  return (
                    <div key={sem}>
                      <h3 className="font-medium mb-2">{sem}</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {courseColumns.map((col) => {
                              const key =
                                "id" in col
                                  ? col.id
                                  : "accessorKey" in col
                                  ? col.accessorKey
                                  : String(col.header);
                              return (
                                <TableHead key={key}>
                                  {flexRender(col.header, {
                                    column: col,
                                  } as any)}
                                </TableHead>
                              );
                            })}
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {groupCourses.length ? (
                            <>
                              {groupCourses.map((course) => (
                                <TableRow key={course.course_id}>
                                  <TableCell>
                                    {course.course_code ?? "—"}
                                  </TableCell>
                                  <TableCell>
                                    {course.course_description ?? "—"}
                                  </TableCell>
                                  <TableCell>{course.unit ?? "—"}</TableCell>
                                </TableRow>
                              ))}

                              {/* Total row */}
                              <TableRow className="font-semibold bg-gray-100">
                                <TableCell
                                  colSpan={2}
                                  className="text-right pr-4"
                                >
                                  Total Units
                                </TableCell>
                                <TableCell>
                                  {groupCourses.reduce(
                                    (sum, c) => sum + (c.unit || 0),
                                    0
                                  )}
                                </TableCell>
                              </TableRow>
                            </>
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={3}
                                className="text-center text-gray-500"
                              >
                                No courses
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-md">
            <Table
              className={`${
                activeTab === "students" ? "table-fixed" : "table-auto"
              } w-full`}
            >
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={
                        activeTab !== "students"
                          ? () => setSelectedStudent(row.original)
                          : undefined
                      }
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {activeTab === "students" ? (
                            <Link
                              to={`/nstsps/registrar/student-registrations/${row.original.student_id}-${row.original.user_id}`}
                              key={row.id}
                              state={{ user_id: row.original.user_id }}
                              onClick={(e) => e.stopPropagation()} // prevent dialog open
                              className="block w-full h-full"
                            >
                              {flexRender(cell.column.columnDef.cell, {
                                ...cell.getContext(),
                              })}
                            </Link>
                          ) : (
                            flexRender(cell.column.columnDef.cell, {
                              ...cell.getContext(),
                              rowClickHandler: (e: React.MouseEvent) =>
                                e.stopPropagation(),
                            })
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Student / Request Details Dialog */}
          <Dialog
            open={!!selectedStudent}
            onOpenChange={() => setSelectedStudent(null)}
          >
            <DialogContent className="max-w-lg bg-white">
              <DialogHeader>
                <DialogTitle className="text-center">
                  {activeTab === "students"
                    ? "Student Details"
                    : "Request Details"}
                </DialogTitle>
              </DialogHeader>

              {/* Student Profile Tab */}
              {selectedStudent && activeTab === "students" && (
                <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
                  <p>
                    <strong>Student ID:</strong> {selectedStudent.student_id}
                  </p>
                  <p>
                    <strong>Surname:</strong> {selectedStudent.surname}
                  </p>
                  <p>
                    <strong>First Name:</strong> {selectedStudent.first_name}
                  </p>
                  <p>
                    <strong>Middle Name:</strong>{" "}
                    {selectedStudent.middle_name ?? "—"}
                  </p>
                  <p>
                    <strong>Gender:</strong> {selectedStudent.gender}
                  </p>
                  <p>
                    <strong>Nationality:</strong> {selectedStudent.nationality}
                  </p>
                  <p>
                    <strong>Civil Status:</strong>{" "}
                    {selectedStudent.civil_status}
                  </p>
                  <p>
                    <strong>Religion:</strong> {selectedStudent.religion}
                  </p>
                  <p>
                    <strong>Birthday:</strong> {selectedStudent.birthday}
                  </p>
                  <p>
                    <strong>Birthplace:</strong> {selectedStudent.birthplace}
                  </p>
                  <p>
                    <strong>Street:</strong> {selectedStudent.street}
                  </p>
                  <p>
                    <strong>Barangay:</strong> {selectedStudent.barangay}
                  </p>
                  <p>
                    <strong>Region:</strong> {selectedStudent.region}
                  </p>
                  <p>
                    <strong>Municipality:</strong>{" "}
                    {selectedStudent.municipality}
                  </p>
                  <p>
                    <strong>Mobile Number:</strong>{" "}
                    {selectedStudent.mobile_number}
                  </p>
                  <p>
                    <strong>Guardian Surname:</strong>{" "}
                    {selectedStudent.guardian_surname}
                  </p>
                  <p>
                    <strong>Guardian First Name:</strong>{" "}
                    {selectedStudent.guardian_first_name}
                  </p>
                  <p>
                    <strong>Relation with Student:</strong>{" "}
                    {selectedStudent.relation_with_the_student}
                  </p>
                  <p>
                    <strong>Guardian Mobile Number:</strong>{" "}
                    {selectedStudent.guardian_mobile_number}
                  </p>
                  <p>
                    <strong>Guardian Email:</strong>{" "}
                    {selectedStudent.guardian_email}
                  </p>
                </div>
              )}

              {/* Request Details Tab */}
              {selectedStudent && activeTab !== "students" && (
                <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
                  <p>
                    <strong>Student ID:</strong> {selectedStudent.student_id}
                  </p>
                  <p>
                    <strong>Student Name:</strong>{" "}
                    {`${selectedStudent.first_name} ${
                      selectedStudent.middle_name ?? ""
                    } ${selectedStudent.surname}`}
                  </p>
                  <p>
                    <strong>Program:</strong> {selectedStudent.program_name}
                  </p>
                  <p>
                    <strong>Year Level:</strong> {selectedStudent.year_level}
                  </p>
                  <p>
                    <strong>Request:</strong> {selectedStudent.request}
                  </p>
                  <p>
                    <strong>Remarks:</strong>{" "}
                    {selectedStudent.request_remarks ?? "—"}
                  </p>
                  <p>
                    <strong>Purpose:</strong>{" "}
                    {selectedStudent.request_purpose ?? "—"}
                  </p>
                  <p>
                    <strong>Mode of Payment:</strong>{" "}
                    {selectedStudent.mode_of_payment ?? "—"}
                  </p>
                  <p>
                    <strong>Receipt:</strong>{" "}
                    {selectedStudent.receipt ? (
                      <Button
                        variant="link"
                        className="text-blue-600 underline"
                        onClick={() =>
                          handleViewReceipt(selectedStudent.receipt!)
                        }
                      >
                        View Receipt
                      </Button>
                    ) : (
                      "—"
                    )}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedStudent.status}
                  </p>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Receipt Preview Dialog (separate) */}
          <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
            <DialogContent className="max-w-5xl p-0 bg-black">
              <img
                src={receiptUrl || ""}
                alt="Receipt"
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
