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
import { cn } from "@/lib/utils";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProgram } from "@/context/miscellaneous-context"; // ✅ we’ll pull programs here

import { Button } from "@/components/ui/button";
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

// validation schema
const AddStudentSchema = z.object({
  student_id: z.string().min(1, "Student ID is required"),
  surname: z.string().min(1, "Surname is required"),
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),
  program_id: z.coerce.number().min(1, "Program is required"),
  year_level: z.string().min(1, "Year level is required"),
  sem: z.string().min(1, "Semester is required"),
  school_year: z.string().regex(/^\d{4}-\d{4}$/, "Format must be YYYY-YYYY"),

  // ✅ New fields
  mode_of_payment: z.string().min(1, "Mode of Payment is required"),
  total_tuition_fee: z
    .number({ invalid_type_error: "Total Tuition Fee is required" })
    .min(1, "Must be greater than 0"),
  amount_paid: z
    .number({ invalid_type_error: "Amount Paid is required" })
    .min(0, "Cannot be negative"),
});

type AddStudentInput = z.infer<typeof AddStudentSchema>;

export type AccountingRecord = {
  balance_id: number;
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
  mode_of_payment: string; // ✅ new
  total_tuition_fee: number; // ✅ new
  status?: string;
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

  const [openAddDialog, setOpenAddDialog] = React.useState(false);

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
  const { fetchAllAccounting, insertAccounting } = useAccounting(); // ✅ include insertAccounting
  const { programs, fetchPrograms } = useProgram();

  const [records, setRecords] = React.useState<AccountingRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"all" | "pending">("all");
  const [openAddDialog, setOpenAddDialog] = React.useState(false);

  // RHF form
  const form = useForm<AddStudentInput>({
    resolver: zodResolver(AddStudentSchema),
    defaultValues: {
      student_id: "",
      surname: "",
      first_name: "",
      middle_name: "",
      program_id: 0,
      year_level: "",
      sem: "",
      school_year: "",
    },
  });
  const load = React.useCallback(async () => {
    setLoading(true);
    const data = await fetchAllAccounting();
    // Ensure each record has school_year property
    const mappedData = data.map((rec: any) => ({
      ...rec,
      school_year: rec.school_year ?? "",
    }));
    setRecords(mappedData);
    setLoading(false);
  }, [fetchAllAccounting]);

  React.useEffect(() => {
    load();
    fetchPrograms();

    const handler = () => load();
    window.addEventListener("accountingUpdated", handler);
    return () => window.removeEventListener("accountingUpdated", handler);
  }, [load]);
  // ✅ Update onSubmit

  const onSubmit = async (values: AddStudentInput) => {
    const success = await insertAccounting(values);
    if (success) {
      toast.success("New accounting record added!");
      setOpenAddDialog(false);
      form.reset();
      load(); // refresh table after insert
    } else {
      toast.error("Failed to add record.");
    }
  };

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
      {/* ✅ Add Dialog */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="bg-white max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex justify-center">
              Add New Record
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Student ID */}
              <div className="flex flex-row items-center">
                <FormField
                  control={form.control}
                  name="student_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Student ID"
                          {...field}
                          className="w-110"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Student Name row */}
              <div className="flex flex-row items-center">
                <div className="flex gap-2 w-110">
                  <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Student Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Surname" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>&nbsp;</FormLabel>
                        <FormControl>
                          <Input placeholder="First Name" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="middle_name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>&nbsp;</FormLabel>
                        <FormControl>
                          <Input placeholder="Middle Name" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Program dropdown */}
              <div className="flex flex-row items-center">
                <FormField
                  control={form.control}
                  name="program_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(val) => field.onChange(Number(val))}
                        >
                          <SelectTrigger className="w-110">
                            <SelectValue placeholder="Select Program" />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-black">
                            {programs.map((p) => (
                              <SelectItem
                                key={p.program_id}
                                value={p.program_id.toString()}
                              >
                                {p.program_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Year Level + Semester on the same line */}
              <div className="w-110">
                <div className="flex flex-row gap-4">
                  {/* Year Level */}
                  <FormField
                    control={form.control}
                    name="year_level"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Year Level</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-black">
                              <SelectItem value="1st Year">1st Year</SelectItem>
                              <SelectItem value="2nd Year">2nd Year</SelectItem>
                              <SelectItem value="3rd Year">3rd Year</SelectItem>
                              <SelectItem value="4th Year">4th Year</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* Semester */}
                  <FormField
                    control={form.control}
                    name="sem"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Semester</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Semester" />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-black">
                              <SelectItem value="First Semester">
                                First Semester
                              </SelectItem>
                              <SelectItem value="Second Semester">
                                Second Semester
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* School Year (from-to) */}
              <FormField
                control={form.control}
                name="school_year"
                render={({ field }) => {
                  const [from, to] = field.value
                    ? field.value.split("-")
                    : ["", ""];

                  return (
                    <FormItem className="flex flex-col w-110">
                      <FormLabel>School Year</FormLabel>
                      <div className="flex gap-2">
                        {/* From */}
                        <Input
                          placeholder="From (e.g. 2025)"
                          value={from}
                          onChange={(e) => {
                            const newFrom = e.target.value;
                            field.onChange(
                              newFrom && to ? `${newFrom}-${to}` : newFrom
                            );
                          }}
                        />

                        <span className="flex-none self-center">-</span>

                        {/* To */}
                        <Input
                          placeholder="To (e.g. 2026)"
                          value={to}
                          onChange={(e) => {
                            const newTo = e.target.value;
                            field.onChange(
                              from && newTo ? `${from}-${newTo}` : newTo
                            );
                          }}
                        />
                      </div>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  );
                }}
              />
              {/* Mode of Payment + Amount Paid on the same line */}
              <div className="flex flex-row gap-4 w-110">
                {/* Mode of Payment */}
                <FormField
                  control={form.control}
                  name="mode_of_payment"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Mode of Payment</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Mode" />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-black">
                            <SelectItem value="Full Payment">
                              Full Payment
                            </SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Amount Paid */}
                <FormField
                  control={form.control}
                  name="amount_paid"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Amount Paid</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter amount paid"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Total Tuition Fee */}
              <FormField
                control={form.control}
                name="total_tuition_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Tuition Fee</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter tuition fee"
                        className="w-110"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenAddDialog(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#1BB2EF] hover:bg-[#1599cc] text-white"
                >
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Search + Add */}
      <div className="flex items-center justify-between py-4 w-full">
        <Input
          placeholder={`Search ${
            activeTab === "all" ? "records" : "pending records"
          }...`}
          className="max-w-sm"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <Button
          className="bg-[#1BB2EF] hover:bg-[#1599cc] text-white"
          onClick={() => setOpenAddDialog(true)}
        >
          Add
        </Button>
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
