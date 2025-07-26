import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const pending = [
  {
    request: "Certificate of Enrollment",
    status: "Processing",
   
  },
  {
    request: "SID002",
    status: "Declined",
  },
  {
    request: "SID003",
    status: "Declined",
  },
  {
    request: "SID004",
    status: "Processing",
  },
];

function PendingRequestTable() {
  return (
    <Table className="border-none">
      <TableHeader className="bg-[#919090] text-white">
        <TableRow>
          <TableHead>Request</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pending.map((student) => (
          <TableRow
            >
            <TableCell className="font-medium max-w-[40%]">{student.request}</TableCell>
            <TableCell className="max-w-[40%]">{student.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default PendingRequestTable;
