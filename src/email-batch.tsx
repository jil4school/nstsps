import { toast } from "sonner";
import { useMasterFile } from "./context/master-file-context";
import HeaderAdmin from "./header-admin";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useLogin } from "./context/login-context";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";

export default function EmailBatch() {
  const { uploadSPSEmail } = useMasterFile();

  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setFile(null);
      setData([]);
      return;
    }

    const selectedFile = files[0];

    if (!selectedFile.name.endsWith(".xlsx")) {
      toast.error("Invalid file type. Only .xlsx files are allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFile(null);
      setData([]);
      return;
    }

    setFile(selectedFile);

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
        setFile(null);
        setData([]);
        return;
      }

      setData(rawData);
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFile(null);
    setData([]);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a file before submitting.");
      return;
    }

    try {
      const success = await uploadSPSEmail(file);
      if (success) {
        toast.success("File uploaded successfully!");
        handleClearFile();
      } else {
        toast.error("Upload failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Error in handleSubmit:", err);
      toast.error(err.message || "An error occurred during upload.");
    }
  };

  const formatHeader = (key: string) =>
    key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  const { user } = useLogin();
  const navigate = useNavigate();

  const goBack = () => {
    if (user) {
      navigate(`/nstsps/${user.role.toLowerCase()}-home`);
    }
  };
  return (
    <div className="flex flex-row h-screen w-screen bg-white mt-20">
      <HeaderAdmin />
      <div className="w-full bg-white">
        <div className="flex items-center justify-between w-full pl-10 pr-10 pt-10 mb-6">
          <h1 className="text-xl font-semibold">Email Batch Upload</h1>

          <button
            onClick={goBack}
            className="flex items-center text-blue-600 hover:underline text-sm font-medium"
          >
            <IoArrowBackSharp size={18} className="mr-1" />
            <span>Back</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="flex justify-center w-full">
          <div className="border border-dashed rounded-md p-6 bg-gray-50 text-sm text-gray-700 space-y-2 w-full ml-10 mr-10">
            <p>
              1. Download the sheet (provided in .xlsx format, do not rename or
              alter column structure).
            </p>
            <p>2. Fill in all required fields correctly.</p>
            <p>3. Limit entries to 100 rows per file.</p>
            <p>4. Validate your data before uploading.</p>
            <p>5. Upload the file below.</p>
          </div>
        </div>

        {/* Upload area */}
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
                Only .xlsx files allowed
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

            {file && (
              <div className="mt-2 flex justify-between items-center">
                <p className="text-sm text-green-600 font-medium">
                  ✅ File selected: {file.name}
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

        {/* Preview table */}
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
  );
}
