import { useState } from "react";
import axios from "../api/axiosInstance";

export default function UploadForm({ setResults }) {
  const [files, setFiles] = useState([]);
  const [textEmails, setTextEmails] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    if (textEmails.trim()) {
      formData.append("text_emails", textEmails);
    }

    const res = await axios.post("/validate-emails/", formData);
    setResults(res.data.results);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="file"
        multiple
        accept=".csv"
        onChange={(e) => setFiles(e.target.files)}
        className="border p-2"
      />
      <textarea
        placeholder="Or paste emails here, one per line"
        rows={5}
        value={textEmails}
        onChange={(e) => setTextEmails(e.target.value)}
        className="w-full border p-2"
      ></textarea>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Validate Emails
      </button>
    </form>
  );
}
