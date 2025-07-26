import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const archive = [
  {
    request: "Certificate of Enrollment",   
  },
  {
    request: "SID002",
  },
  {
    request: "SID003",
  },
  {
    request: "SID004",
  },
];

function ArchiveRequestTable() {
  return (
    <Table className="border-none">
      <TableHeader className="bg-[#919090] text-white">
        <TableRow>
          <TableHead>Request</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {archive.map((student) => (
          <TableRow
            >
            <TableCell className="font-medium max-w-[40%]">{student.request}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ArchiveRequestTable;
