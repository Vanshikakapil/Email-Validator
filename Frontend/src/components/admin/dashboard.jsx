import React, { useEffect, useState } from "react";
import { getSummary } from "../api";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getSummary().then(res => setSummary(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold">Admin Summary</h2>
      {summary ? (
        <ul>
          <li>Total Users: {summary.total_users}</li>
          <li>Total Verifications: {summary.total_verifications}</li>
          <li>Total Logs: {summary.total_logs}</li>
        </ul>
      ) : (
        "Loading..."
      )}
    </div>
  );
}
