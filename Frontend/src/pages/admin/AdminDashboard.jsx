import React, { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaHistory,
  FaUsersCog,
  FaSignOutAlt,
  FaChartPie,
  FaUserTimes,
  FaUserCheck,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Users from "./Users";
import axios from "axios";
const StatCard = ({ title, value, subtitle }) => (
  <div className="bg-white/5 border border-white/20 p-6 rounded-xl shadow-xl hover:shadow-sky-500/40 hover:scale-[1.03] transition-all duration-300">
    <p className="text-sm uppercase tracking-wide font-medium text-white/60">{title}</p>
    <h3 className="text-3xl font-extrabold mt-2 mb-1 text-white">{value}</h3>
    <p className="text-xs text-white/50">{subtitle}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_uploads: 0,
    valid_emails: 0,
    invalid_emails: 0,
    last_upload: "N/A",
  });

  const [trendData, setTrendData] = useState([]);
  const [accuracy, setAccuracy] = useState({
    valid: 0,
    invalid: 0,
    total: 0,
    regex_accuracy: 0,
    mx_accuracy: 0,
    smtp_accuracy: 0,
  });

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const summaryRes = await axios.get("http://127.0.0.1:8000/summary");
        const trendRes = await axios.get("http://127.0.0.1:8000/admin/email-stats");

        setStats({
          total_uploads: summaryRes.data.total_uploads,
          valid_emails: summaryRes.data.valid_emails,
          invalid_emails: summaryRes.data.invalid_emails,
          last_upload: summaryRes.data.last_upload
            ? new Date(summaryRes.data.last_upload).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "N/A",
        });

        setTrendData(trendRes.data.trend || []);

        setAccuracy({
          valid: trendRes.data.counts.valid || 0,
          invalid: trendRes.data.counts.invalid || 0,
          total: trendRes.data.counts.total || 0,
          regex_accuracy: trendRes.data.counts.regex_accuracy || 0,
          mx_accuracy: trendRes.data.counts.mx_accuracy || 0,
          smtp_accuracy: trendRes.data.counts.smtp_accuracy || 0,
        });
      } catch (apiErr) {
        console.error("❌ Failed to fetch dashboard data:", apiErr);
      }
    };

    fetchSummaryData();
    const interval = setInterval(fetchSummaryData, 30*60*1000); // every 30 min
    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-10">
      <div className="absolute top-0 right-0 w-40 h-40 bg-sky-400 opacity-10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-indigo-500 opacity-10 rounded-full blur-3xl animate-ping pointer-events-none" />

      <h2 className="text-5xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
        🎯 Admin Control Dashboard
      </h2>
      <p className="text-lg font-light leading-relaxed max-w-4xl">
        Live overview of <span className="text-sky-400 font-semibold">email validation</span> activity across the system.
      </p>

      <div className="mt-6">
        <p className="text-sm bg-white/10 px-5 py-2 inline-block rounded-lg shadow border border-white/20">
          ⏱️ Last upload: <span className="font-bold">{stats.last_upload}</span>
        </p>
      </div>

      <div className="my-8 h-px w-full bg-white/20"></div>

      <h3 className="text-2xl font-semibold mb-4">📊 Key Stats</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <StatCard title="Total Uploads" value={stats.total_uploads} subtitle="All email validations" />
        <StatCard title="Valid Emails" value={stats.valid_emails} subtitle="Passed validation checks" />
        <StatCard title="Invalid Emails" value={stats.invalid_emails} subtitle="Failed validation checks" />
      </div>

      <div className="my-8 h-px w-full bg-white/20"></div>

      <h3 className="text-2xl font-semibold mb-4">📈 Upload Trends</h3>
      <div className="bg-white/5 p-4 rounded-xl shadow">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <Line type="monotone" dataKey="valid" stroke="#22c55e" strokeWidth={2} />
            <Line type="monotone" dataKey="invalid" stroke="#ef4444" strokeWidth={2} />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="my-8 h-px w-full bg-white/20"></div>

      <h3 className="text-2xl font-semibold mb-4">🎯 Accuracy Insights</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Accuracy"
          value={
            accuracy.total > 0
              ? `${((accuracy.valid / accuracy.total) * 100).toFixed(2)}%`
              : "N/A"
          }
          subtitle={`${accuracy.valid} / ${accuracy.total}`}
        />
        <StatCard title="Regex Accuracy" value={`${accuracy.regex_accuracy}%`} subtitle="Pattern Validation" />
        <StatCard title="MX Accuracy" value={`${accuracy.mx_accuracy}%`} subtitle="Domain MX Check" />
        <StatCard title="SMTP Accuracy" value={`${accuracy.smtp_accuracy}%`} subtitle="Mailbox Verification" />
      </div>
    </div>
  );
};




const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin-login";
  };

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "analyze":
        return <AnalyzePage />;
      case "users":
        return <Users />;
      case "logs":
        return <LogsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <aside className="w-64 bg-gray-800 text-white py-6 px-4">
        <div className="text-2xl font-bold mb-10">Admin Panel</div>
        <nav className="space-y-4">
          <button onClick={() => setActiveTab("dashboard")} className="flex items-center gap-2 hover:text-sky-400">
            <FaTachometerAlt /> Dashboard
          </button>
          <button onClick={() => setActiveTab("users")} className="flex items-center gap-2 hover:text-sky-400">
            <FaUsersCog /> Users
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-10 overflow-y-auto">{renderTab()}</main>
    </div>
  );
};

export default AdminDashboard;