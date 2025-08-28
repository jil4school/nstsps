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
import { MoreHorizontal } from "lucide-react";

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

import { useMasterFile } from "@/context/master-file-context";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

export type StudentInfo = {
  user_id: string;
  master_file_id: string;
  student_id: string;
  program_id: string;
  program_name: string;
  surname: string;
  first_name: string;
  middle_name?: string;
};

const downloadPendingEmailsExcel = (pendingStudents: StudentInfo[]) => {
  if (!pendingStudents || pendingStudents.length === 0) {
    alert("No pending emails to download");
    return;
  }

  const ws = XLSX.utils.json_to_sheet(
    pendingStudents.map((s) => ({
      "Student ID": s.student_id,
      "Last Name": s.surname,
      "First Name": s.first_name,
      "Middle Name": s.middle_name ?? "",
      Program: s.program_name,
      Email: "",
      Password: "",
    }))
  );

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pending Emails");

  XLSX.writeFile(wb, "PendingEmails.xlsx");
};

export const columns: ColumnDef<StudentInfo>[] = [
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
    accessorKey: "email",
    header: () => <div className="text-left">Email</div>,
    cell: ({ row }) => <div className="text-left">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "program_name",
    header: () => <div className="text-left">Program</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("program_name")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const student = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(student.student_id)}
            >
              Copy Student ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Edit Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
type TableProps = {
  data: StudentInfo[];
  loading: boolean;
  globalFilter: string;
  setGlobalFilter: (val: string) => void;
};

export function StudentTableContent({
  data,
  loading,
  globalFilter,
  setGlobalFilter,
}: TableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
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
    globalFilterFn: (row, columnId, filterValue) => {
      const student = row.original;

      const haystackParts = [
        student.student_id,
        student.surname,
        student.first_name,
        student.middle_name ?? "",
        student.program_name,
        (row.getValue("email") as string) ?? "",
      ];

      const nameParts1 = [
        student.surname,
        student.first_name,
        student.middle_name,
      ].filter(Boolean);
      const fullName1 = `${student.surname}, ${[
        student.first_name,
        student.middle_name,
      ]
        .filter(Boolean)
        .join(" ")}`;
      const fullName2 = nameParts1.join(" ");

      const haystack = [...haystackParts, fullName1, fullName2]
        .join(" ")
        .replace(/\s+/g, " ")
        .toLowerCase();

      return haystack.includes(filterValue.toLowerCase().trim());
    },
  });
  return (
    <>
      <div className="overflow-hidden rounded-md">
        <Table>
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
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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

      {/* pagination */}
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
    </>
  );
}

export function StudentTableIT() {
  const { fetchAllStudents, fetchPendingEmails, fetchCreatedEmails } =
    useMasterFile();

  const [allStudents, setAllStudents] = React.useState<StudentInfo[]>([]);
  const [pendingStudents, setPendingStudents] = React.useState<StudentInfo[]>(
    []
  );
  const [createdStudents, setCreatedStudents] = React.useState<StudentInfo[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);

  const [activeTab, setActiveTab] = React.useState<
    "all" | "pending" | "created"
  >("all");

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [all, pending, created] = await Promise.all([
        fetchAllStudents(),
        fetchPendingEmails(),
        fetchCreatedEmails(),
      ]);
      if (all) setAllStudents(all);
      if (pending) setPendingStudents(pending);
      if (created) setCreatedStudents(created);
      setLoading(false);
    };
    load();
  }, [fetchAllStudents, fetchPendingEmails, fetchCreatedEmails]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex space-x-4 mb-4 text-sm font-medium">
        {["All", "Pending Emails", "Emails Created"].map((tab) => {
          const value =
            tab === "All"
              ? "all"
              : tab === "Pending Emails"
              ? "pending"
              : "created";
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(value as any)}
              className={`pb-2 ${
                activeTab === value
                  ? "border-b-2 border-black"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Search bar (always visible) */}
      <div className="flex items-center py-4 w-full">
        <Input
          placeholder="Search students..."
          className="max-w-sm"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        {activeTab === "pending" && (
          <div className="ml-auto flex gap-2">
            <Button
              className="bg-green-600 text-white"
              onClick={() => downloadPendingEmailsExcel(pendingStudents)}
            >
              Download Pending Emails
            </Button>
            <Link to="/nstsps/IT/email-batch">
              <Button className="bg-[#00ACED] text-white">Upload Emails</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Tab content */}
      {activeTab === "all" && (
        <StudentTableContent
          data={allStudents}
          loading={loading}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      )}
      {activeTab === "pending" && (
        <StudentTableContent
          data={pendingStudents}
          loading={loading}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      )}
      {activeTab === "created" && (
        <StudentTableContent
          data={createdStudents}
          loading={loading}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      )}
    </div>
  );
}
