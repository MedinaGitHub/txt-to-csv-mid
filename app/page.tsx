"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from "@heroicons/react/24/solid";

interface FileInputProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInput: React.FC<FileInputProps> = ({ onFileChange }) => (
  <label
    className="bg-white border border-gray-300 rounded px-3 py-2 flex items-center justify-center text-gray-500 hover:text-gray-700 cursor-pointer transition duration-300 ease-in-out"
    style={{
      backgroundColor: "#13acc5",
      borderColor: "#13acc5",
      color: "white",
    }}
  >
    <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
    Upload TXT File
    <input
      type="file"
      accept=".txt"
      onChange={onFileChange}
      className="hidden"
    />
  </label>
);

export default function Home() {
  const [csvContent, setCsvContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [txtName, setTxtName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setLoading(true);
    setError("");
    setTxtName(file.name);

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        const txtContent = event.target?.result as string;
        const csv = processTxtToCsv(txtContent);
        setCsvContent(csv);
        // New lines
        const fileName = file.name.replace(".txt", ".csv");
      } catch (err) {
        setError("Error processing the file. Please check the file format.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const processTxtToCsv = (txtContent: string): string => {
    const regex = /\d{4} \d{4} \d{7}/g;
    const matches = txtContent.match(regex);
    const accountNumbers = matches ? matches : [];
    return accountNumbers.join("\n");
  };

  const handleDownload = () => {
    if (!csvContent) return;
    const file = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const fileName = `${txtName.split(".")[0]}.csv`;
    saveAs(file, fileName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
    <div className="mx-auto max-w-lg px-300 p-12 rounded" style={{backgroundColor:'#1c1c1c'}}>
        <h1 className="text-2xl font-bold mb-6 text-center">
          Extract MID from TXT to CSV Converter
        </h1>
        <div className="flex items-center justify-center mb-8">
          <FileInput onFileChange={handleFileChange} />
        </div>
        {loading && <p className="text-gray-500 mt-4">Loading...</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {csvContent && (
          <div className="flex items-center justify-center">
            <button
              onClick={handleDownload}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l inline-flex items-center transition duration-300 ease-in-out"
              style={{ backgroundColor: "#13acc5", borderColor: "#13acc5" }}
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Download CSV
            </button>
            <span className="bg-gray-200 px-3 py-2 rounded-r text-gray-500 ml-2">
              {csvContent.length} rows
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
