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
import { cn } from "@/lib/utils";

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

import { useAccounting } from "@/context/accounting-context";

import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Label } from "./components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

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

export function ManageBalanceButton({ record }: { record: AccountingRecord }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const { updateBalance } = useAccounting();

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount))) {
      toast.error("Please enter a valid amount");
      return;
    }
    const amt = Number(amount);
    const success = await updateBalance(record.balance_id, amt);
    if (success) {
      toast.success("Payment recorded");
      // notify other components to refresh
      window.dispatchEvent(new Event("accountingUpdated"));
      setOpen(false);
      setAmount("");
    } else {
      toast.error("Failed to update balance");
    }
  };

  return (
    <>
      <Button
        size="sm"
        onClick={() => setOpen(true)}
        className="bg-[#1BB2EF] hover:bg-[#1599cc] text-white"
      >
        Manage Balance
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Update Balance — {record.student_id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Amount Paid</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount paid"
            />
            <div className="text-sm text-gray-600">
              Current paid: ₱{Number(record.amount_paid ?? 0).toLocaleString()}{" "}
              · Balance: ₱{Number(record.balance ?? 0).toLocaleString()}
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            {/* Cancel Button */}
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="bg-[#1BB2EF] hover:bg-[#1599cc] text-white"
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const columns: ColumnDef<AccountingRecord>[] = [
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
  },
  {
    accessorKey: "student_id",
    header: () => <div className="text-left">Student ID</div>,
  },
  {
    accessorKey: "program_name",
    header: () => <div className="text-left">Program</div>,
  },
  {
    accessorKey: "school_year",
    header: () => <div className="text-left">School Year</div>,
  },
  {
    accessorKey: "year_level",
    header: () => <div className="text-left">Year</div>,
  },
  {
    accessorKey: "sem",
    header: () => <div className="text-left">Semester</div>,
  },
  {
    accessorKey: "balance",
    header: () => <div className="text-right">Balance</div>,
    cell: ({ row }) => (
      <div className="text-right">
        ₱{Number(row.getValue("balance")).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-left">Status</div>,
    cell: ({ row }) => {
      const balance = Number(row.original.balance);

      const isFullyPaid = balance === 0;

      return (
        <span
          className={cn(
            "px-2 py-1 rounded-md text-xs font-medium",
            isFullyPaid
              ? "bg-[#3BF157] text-white" // Fully Paid
              : "bg-[#EEF391] text-gray-800" // Pending
          )}
        >
          {isFullyPaid ? "Fully Paid" : "Pending"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-left">Actions</div>,
    cell: ({ row }) => {
      const student = row.original;
      return <ManageBalanceButton record={student} />;
    },
  },
];

type TableProps = {
  data: AccountingRecord[];
  loading: boolean;
  globalFilter: string;
  setGlobalFilter: (val: string) => void;
};

export type AccountingRecord = {
  balance_id: number; // important — primary for updates
  tuition_id?: number;
  student_id: string;
  surname: string;
  first_name: string;
  middle_name?: string;
  program_name: string;
  year_level: string;
  school_year: string;
  sem: string;
  balance: number;
  amount_paid: number;
  status?: string; // blank
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

export function StudentTableAccounting() {
  const { fetchAllAccounting } = useAccounting();

  const [records, setRecords] = React.useState<AccountingRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"all" | "pending">("all");

  const load = React.useCallback(async () => {
    setLoading(true);
    const data = await fetchAllAccounting();
    setRecords(data);
    setLoading(false);
  }, [fetchAllAccounting]);

  React.useEffect(() => {
    load();

    const handler = () => load();
    window.addEventListener("accountingUpdated", handler);
    return () => window.removeEventListener("accountingUpdated", handler);
  }, [load]);

  // ✅ filter pending
  const pendingRecords = records.filter((rec) => Number(rec.balance) !== 0);

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex space-x-4 mb-4 text-sm font-medium">
        {["All", "Pending"].map((tab) => {
          const value = tab.toLowerCase() as "all" | "pending";
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(value)}
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

      <div className="flex items-center py-4 w-full">
        <Input
          placeholder={`Search ${
            activeTab === "all" ? "records" : "pending records"
          }...`}
          className="max-w-sm"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* Tab content */}
      {activeTab === "all" && (
        <StudentTableContent
          data={records}
          loading={loading}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      )}
      {activeTab === "pending" && (
        <StudentTableContent
          data={pendingRecords}
          loading={loading}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      )}
    </div>
  );
}
