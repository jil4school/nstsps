import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRegistrationContext } from "@/context/registration-context";
import { useState } from "react";

function RegistrationDetailsTable() {
  const { registrations, loading, error } = useRegistrationContext();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

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
          <>
            {/* Main row */}
            <TableRow
              key={student.studentId}
              onClick={() => toggleRow(index)}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-[#1BB2EF] text-white"
              } cursor-pointer`}
            >
              <TableCell className="font-medium">{student.studentId}</TableCell>
              <TableCell>{student.studentName}</TableCell>
              <TableCell>{student.registration_date}</TableCell>
              <TableCell>{student.sem}</TableCell>
              <TableCell>{student.program_name}</TableCell>
            </TableRow>

            {/* Collapsible content */}
            {expandedRow === index && (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <div className="bg-white p-4 shadow-inner">
                    {/* Inner table */}
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-100">
                          <TableHead>Code</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Unit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>CS101</TableCell>
                          <TableCell>Intro to Computer Science</TableCell>
                          <TableCell>3</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>MATH201</TableCell>
                          <TableCell>Calculus II</TableCell>
                          <TableCell>4</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>ENG102</TableCell>
                          <TableCell>English Composition</TableCell>
                          <TableCell>3</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </>
        ))}
      </TableBody>
    </Table>
  );
}

export default RegistrationDetailsTable;
