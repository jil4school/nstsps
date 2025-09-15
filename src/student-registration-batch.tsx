import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import HeaderAdmin from "./header-admin";
import { useAdminRegistrationContext } from "./context/admin-registration-context";

const downloadTemplate = () => {
  const link = document.createElement("a");
  link.href =
    "http://localhost/NSTSPS_API/template/BatchRegistration.xlsx";
  link.setAttribute("download", "StudentRegistration.xlsx");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function StudentRegistrationBatch() {
  const headerMapping: Record<string, string> = {
    "student id": "student_id",
    surname: "surname",
    "first name": "first_name",
    "middle name": "middle_name",
    program: "program",
    "registration date": "registration_date",
    "school year": "school_year",
    "year level": "year_level",
    semester: "sem",
    "amount paid": "amount_paid", // 👈 NEW COLUMN
  };

  const mapRowToBackend = (row: any) => {
    const mapped: any = {};
    for (const key in row) {
      if (headerMapping[key.toLowerCase()]) {
        if (key.toLowerCase() === "registration date") {
          const value = row[key];
          if (value) {
            const d = new Date(value);
            if (!isNaN(d.getTime())) {
              const year = d.getFullYear();
              const month = String(d.getMonth() + 1).padStart(2, "0");
              const day = String(d.getDate()).padStart(2, "0");
              mapped["registration_date"] = `${year}-${month}-${day}`;
            } else {
              mapped["registration_date"] = "0000-00-00";
            }
          } else {
            mapped["registration_date"] = "0000-00-00";
          }
        } else {
          mapped[headerMapping[key.toLowerCase()]] = row[key];
        }
      }
    }
    return mapped;
  };

  const [data, setData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { insertMultipleRegistrations } = useAdminRegistrationContext();

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
        toast.error("Upload failed: File must contain no more than 100 rows.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setData([]);
        return;
      }

      setData(rawData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setData([]);
  };

  const handleSubmit = async () => {
    try {
      const cleanedData = data.map((row) => mapRowToBackend(row));

      const success = await insertMultipleRegistrations(cleanedData);

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

  return (
    <div className="flex flex-row h-screen w-screen bg-white mt-20">
      <HeaderAdmin />
      <div className="w-full bg-white">
        <h1 className="text-xl font-semibold mb-6 pl-10 pr-10 pt-10">
          Student Registration Batch Upload
        </h1>

        {/* Instructions */}
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
              (StudentRegistration.xlsx).
            </p>
            <p>
              2. Fill in all required fields by completing each row with correct
              data formats without removing or rearranging columns.
            </p>
            <p>3. Limit entries to 100 rows per file.</p>
            <p>4. Upload your completed file below.</p>
          </div>
        </div>

        {/* Upload Box */}
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

        {/* Preview */}
        {data.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm mb-2">Preview</h2>
            <div className="overflow-auto max-w-full rounded border">
              <table className="min-w-full border-collapse table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    {Object.keys(data[0]).map((header, idx) => {
                      let displayHeader = header;
                      if (header.toLowerCase() === "amount paid") {
                        displayHeader = "Amount Paid"; // 👈 consistent label
                      }
                      return (
                        <th
                          key={idx}
                          className="px-4 py-2 text-left text-sm font-semibold border"
                        >
                          {displayHeader}
                        </th>
                      );
                    })}
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

            <button
              onClick={handleSubmit}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
