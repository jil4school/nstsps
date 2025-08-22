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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
  DialogDescription,
} from "@/components/ui/dialog";

import { useMasterFile } from "@/context/master-file-context";
import { Link } from "react-router-dom";

// 👇 Same StudentInfo interface
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

export function StudentTableIT() {
  const { fetchAllStudents } = useMasterFile();
  const [students, setStudents] = React.useState<StudentInfo[]>([]);
  const [loading, setLoading] = React.useState(true);

  // 👇 dialog state
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

  React.useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      const data = await fetchAllStudents();
      if (data) setStudents(data);
      setLoading(false);
    };
    loadStudents();
  }, [fetchAllStudents]);

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
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 w-full">
        {/* search input */}
        <Input
          placeholder="Search students..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />

        <div className="ml-auto">
          <Link to="/nstsps/admission/email-batch">
            <Button className="bg-[#00ACED] text-white">Add Student</Button>
          </Link>
        </div>
      </div>

      {/* table */}
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
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  // removed onClick + cursor-pointer
                  className="hover:bg-gray-50" // keep hover styling if you still want
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
    </div>
  );
}
