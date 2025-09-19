import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { useMasterFile } from "./context/master-file-context";
import HeaderAdmin from "./header-admin";
import axios from "axios";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useLogin } from "./context/login-context";

const downloadTemplate = () => {
  const link = document.createElement("a");
  link.href = "http://localhost/NSTSPS_API/template/MasterFileBatch.xlsx";
  link.setAttribute("download", "MasterFileBatch.xlsx");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function NewStudentBatch() {
  const headerMapping: Record<string, string> = {
    "Student ID": "student_id",
    Surname: "surname",
    "First Name": "first_name",
    "Middle Name": "middle_name",
    Email: "email",
    Program: "program_id", // ⚡ handled separately
    "Year Level": "year_level",
    Semester: "sem",
    "School Year": "school_year",
    "Registration Date": "registration_date", // ✅ new
    Gender: "gender",
    Nationality: "nationality",
    "Civil Status": "civil_status",
    Religion: "religion",
    Birthday: "birthday",
    Birthplace: "birthplace",
    Street: "street",
    Barangay: "barangay",
    Region: "region",
    Municipality: "municipality",
    "Mobile Number": "mobile_number",
    "Guardian Surname": "guardian_surname",
    "Guardian First Name": "guardian_first_name",
    "Relationsip with the Student": "relation_with_the_student",
    "Guardian Mobile Number": "guardian_mobile_number",
    "Guardian Email": "guardian_email",
  };

  const mapRowToBackend = (row: any, programs: any[]) => {
    const mapped: any = {};

    for (const key in row) {
      if (key === "Program") {
        const program = programs.find(
          (p) => p.program_name.toLowerCase() === row[key].toLowerCase()
        );
        mapped["program_id"] = program ? program.program_id : null;
      } else if (key === "Birthday" || key === "Registration Date") {
        // ✅ handle registration date
        const value = row[key];
        if (value) {
          const d = new Date(value);
          if (!isNaN(d.getTime())) {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            mapped[headerMapping[key]] = `${year}-${month}-${day}`;
          } else {
            mapped[headerMapping[key]] = "0000-00-00";
          }
        } else {
          mapped[headerMapping[key]] = "0000-00-00";
        }
      } else {
        mapped[headerMapping[key]] = row[key];
      }
    }

    return mapped;
  };

  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost/NSTSPS_API/controller/ProgramController.php")
      .then((res) => setPrograms(res.data))
      .catch((err) => console.error("Failed to fetch programs", err));
  }, []);

  const [data, setData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { insertMultipleStudents } = useMasterFile();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setData([]);
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      if (!evt.target) return;
      const arrayBuffer = evt.target.result;
      const workbook = XLSX.read(arrayBuffer, {
        type: "array",
        cellDates: true,
      });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const rawData = XLSX.utils.sheet_to_json(worksheet, {
        header: 0,
        defval: "",
        blankrows: false,
        raw: false,
      });

      if (!rawData || rawData.length === 0) {
        toast.error("Uploaded file contains no data");
        setData([]);
        return;
      }

      if (rawData.length > 100) {
        toast.error(
          "Upload failed: File must contain no more than 100 data rows."
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
        setData([]);
        return;
      }

      // Format dates
      const dateFields = ["birthday"];
      const formatExcelDate = (value: any): string => {
        if (typeof value === "number") {
          const jsDate = XLSX.SSF.parse_date_code(value);
          if (jsDate) {
            const year = jsDate.y;
            const month = String(jsDate.m).padStart(2, "0");
            const day = String(jsDate.d).padStart(2, "0");
            return `${year}-${month}-${day}`;
          }
        } else if (typeof value === "string" && !isNaN(Date.parse(value))) {
          const d = new Date(value);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }
        return "";
      };

      const formattedData = rawData.map((row: any) => {
        const newRow = { ...row };
        dateFields.forEach((field) => {
          if (newRow[field]) newRow[field] = formatExcelDate(newRow[field]);
        });
        return newRow;
      });

      setData(formattedData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setData([]);
  };
  const toISODate = (value: any): string => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const handleSubmit = async () => {
    try {
      const cleanedData = data.map((row) => {
        return mapRowToBackend(row, programs);
      });

      const success = await insertMultipleStudents(cleanedData);

      if (success) {
        toast.success("Batch upload successful!");
        setData([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error("Batch upload failed. Check your data and try again.");
      }
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      toast.error(error.message || "An error occurred during batch upload.");
    }
  };

  const formatHeader = (key: string) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const navigate = useNavigate();
  const { user } = useLogin();

  const goBack = () => {
    if (user) {
      navigate(`/nstsps/${user.role.toLowerCase()}-home`);
    }
  };
  return (
    <>
      <div className="flex flex-row h-screen w-screen bg-white mt-20">
        <HeaderAdmin />

        <div className="w-full bg-white">
          <div className="flex justify-between items-center pl-10 pr-10 pt-10 mb-6">
            <h1 className="text-xl font-semibold">Batch Upload</h1>
            <button
              onClick={goBack}
              className="flex items-center text-blue-600 hover:underline text-sm font-medium"
            >
              <IoArrowBackSharp size={18} className="mr-1" />
              <span>Back</span>
            </button>
          </div>
          <div className="flex justify-center w-full">
            <div className="border border-dashed rounded-md p-6 bg-gray-50 text-sm text-gray-700 space-y-2 w-full ml-10 mr-10">
              <p>
                1. Download the{" "}
                <button
                  onClick={downloadTemplate}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  template
                </button>{" "}
                (provided in .xlsx format, do not rename or alter column
                structure).
              </p>
              <p>
                2. Fill in all required fields by completing each row with
                correct data formats without removing or rearranging columns.
              </p>
              <p>3. Limit entries to 100 row per file.</p>
              <p>
                4. Validate your data by checking for missing fields, incorrect
                formats, or duplicates before uploading.
              </p>
              <p>5. Upload the file below by selecting your completed file.</p>
            </div>
          </div>

          <div className="mt-6 flex justify-center w-full">
            <div className="border border-dashed rounded-md p-6 bg-gray-50 text-sm text-gray-700 w-full ml-10 mr-10">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full cursor-pointer"
              >
                <svg
                  className="w-8 h-8 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l-4-4m4 4l4-4"
                  ></path>
                </svg>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600">
                    Click to upload
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Only .xlsx files are allowed
                </p>
                <input
                  id="file-upload"
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>

              {data.length > 0 && (
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm text-green-600 font-medium">
                    ✅ File uploaded
                  </p>
                  <button
                    onClick={handleClearFile}
                    className="text-red-600 underline hover:text-red-800 text-sm"
                  >
                    Remove File
                  </button>
                </div>
              )}
            </div>
          </div>

          {data.length > 0 && (
            <div className="mt-6 mx-10">
              <h2 className="text-sm mb-2">Preview</h2>

              <div className="overflow-auto max-w-full rounded border">
                <table className="min-w-full border-collapse table-auto">
                  <thead className="bg-gray-100">
                    <tr>
                      {Object.keys(data[0]).map((header, idx) => (
                        <th
                          key={idx}
                          className="px-4 py-2 text-left text-sm font-semibold border"
                        >
                          {formatHeader(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                        {Object.keys(row).map((key, colIndex) => (
                          <td
                            key={colIndex}
                            className="px-4 py-2 text-sm border max-w-[300px] truncate"
                          >
                            {row[key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded mb-5"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
