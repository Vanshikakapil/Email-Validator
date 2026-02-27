import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({ error }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center p-6">
      <AlertTriangle className="text-red-500 w-16 h-16 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>
      <p className="text-gray-600 mb-6">
        {error?.message || "We encountered an unexpected error. Please try again."}
      </p>
      <div className="space-x-4">
        <button
          onClick={() => window.location.reload()}
          className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Refresh
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
