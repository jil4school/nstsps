import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const registrations = [
  {
    studentId: "SID001",
    studentName: "Jewel Lei Tabbada",
    regDate: "2025-06-15",
    semester: "1st Semester",
    program: "BSIT",
  },
  {
    studentId: "SID002",
    studentName: "John Doe",
    regDate: "2025-06-16",
    semester: "1st Semester",
    program: "BSCS",
  },
  {
    studentId: "SID003",
    studentName: "Jane Smith",
    regDate: "2025-06-17",
    semester: "2nd Semester",
    program: "BSECE",
  },
  {
    studentId: "SID004",
    studentName: "Carlos Reyes",
    regDate: "2025-06-18",
    semester: "2nd Semester",
    program: "BSCE",
  },
];

function RegistrationDetailsTable() {
  return (
    <Table>
      <TableHeader className="bg-[#919090] text-white">
        <TableRow>
          <TableHead>S/ID.</TableHead>
          <TableHead>STUDENT NAME</TableHead>
          <TableHead>REG DATE</TableHead>
          <TableHead>SEMESTER</TableHead>
          <TableHead>PROGRAM</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registrations.map((student, index) => (
          <TableRow
            key={student.studentId}
            className={index % 2 === 0 ? "bg-white" : "bg-[#1BB2EF] text-white"}
          >
            <TableCell className="font-medium">{student.studentId}</TableCell>
            <TableCell>{student.studentName}</TableCell>
            <TableCell>{student.regDate}</TableCell>
            <TableCell>{student.semester}</TableCell>
            <TableCell>{student.program}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default RegistrationDetailsTable;
