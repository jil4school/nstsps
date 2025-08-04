import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRegistrationContext } from "@/context/registration-context";

function RegistrationDetailsTable() {
  const { registrations, loading, error } = useRegistrationContext();

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

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
            <TableCell>{student.registration_date}</TableCell>
            <TableCell>{student.sem}</TableCell>
            <TableCell>{student.program_name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default RegistrationDetailsTable;
