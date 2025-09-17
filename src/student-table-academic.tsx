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
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useProgram } from "./context/miscellaneous-context";

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
  const navigate = useNavigate();

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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => {
              const student = row.original;
              const combinedId = `${student.student_id}-${student.user_id}`;

              return (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() =>
                    navigate(
                      `/nstsps/academics/student-grade-records/${combinedId}`,
                      {
                        state: { user_id: student.user_id },
                      }
                    )
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
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
  );
}

export function StudentTableAcademic() {
  const { fetchAllStudents } = useMasterFile();
  const { programs, fetchPrograms } = useProgram();

  const [allStudents, setAllStudents] = React.useState<StudentInfo[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<string>("all");

  // Fetch programs once
  React.useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  // Fetch students once
  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      const all = await fetchAllStudents();
      if (all) setAllStudents(all);
      setLoading(false);
    };
    load();
  }, [fetchAllStudents]);

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="flex items-center py-4 w-full">
        <Input
          placeholder="Search students..."
          className="max-w-sm"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* Custom Tabs */}
      <div className="flex space-x-4 mb-4 text-sm font-medium">
        {/* All tab */}
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-2 ${
            activeTab === "all" ? "border-b-2 border-black" : "text-gray-500"
          }`}
        >
          ALL
        </button>

        {/* Program tabs */}
        {programs.map((prog) => (
          <button
            key={prog.program_id}
            onClick={() => setActiveTab(prog.program_id)}
            className={`pb-2 ${
              activeTab === prog.program_id
                ? "border-b-2 border-black"
                : "text-gray-500"
            }`}
          >
            {prog.program_code.replace(/_/g, "").toUpperCase()}
          </button>
        ))}
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

      {programs.map((prog) =>
        activeTab === prog.program_id ? (
          <StudentTableContent
            key={prog.program_id}
            data={allStudents.filter((s) => s.program_id === prog.program_id)}
            loading={loading}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        ) : null
      )}
    </div>
  );
}
