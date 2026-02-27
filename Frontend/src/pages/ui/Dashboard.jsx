import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import {
  FaTachometerAlt,
  FaUser,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444", "#3b82f6"];

const Dashboard = () => {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("dashboard"); // tab state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [singleEmail, setSingleEmail] = useState("");
  const [singleResult, setSingleResult] = useState(null);
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleTimeTaken, setSingleTimeTaken] = useState(null);
  const [bulkTimeTaken, setBulkTimeTaken] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState([]);

  const handleFileChange = (e) => setSelectedFiles(e.target.files);

  const [stats, setStats] = useState({
    total: 0,
    valid: 0,
    invalid: 0,
    disposable: 0,
  });

  const pieData = [
    { name: "Valid", value: stats.valid },
    { name: "Invalid", value: stats.invalid },
    { name: "Disposable", value: stats.disposable },
  ];
  const rotateDaysToEndOnToday = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const todayIndex = new Date().getDay(); // 0 (Sun) - 6 (Sat)
    const map = [6, 0, 1, 2, 3, 4, 5]; // To match "Mon" = 0, "Sun" = 6
    const adjustedIndex = map[todayIndex];

    return [
      ...days.slice(0, adjustedIndex + 1),
      ...days.slice(adjustedIndex + 1),
    ];
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Rotate days so the chart ends on today (e.g., Tue if today is Tuesday)
    const getRotatedDays = () => {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const today = new Date().toLocaleDateString("en-US", {
        weekday: "short",
      });
      const todayIndex = days.indexOf(today);
      if (todayIndex === -1) return days;
      return [...days.slice(todayIndex + 1), ...days.slice(0, todayIndex + 1)];
    };

    // Fetch total stats (valid/invalid/etc)
    const fetchUserRecords = async () => {
      try {
        const res = await axios.get("http://localhost:8000/user/all-emails", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;

        const statCounts = {
          total: data.length,
          valid: data.filter((r) => r.status?.toLowerCase() === "valid").length,
          invalid: data.filter((r) => r.status?.toLowerCase() === "invalid")
            .length,
          disposable: data.filter(
            (r) => r.status?.toLowerCase() === "disposable"
          ).length,
        };

        setStats(statCounts);
      } catch (err) {
        console.error(
          "Failed to fetch records:",
          err.response?.data || err.message
        );
      }
    };

    // Fetch weekly validation stats per user
    const fetchWeeklyStats = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/validation-stats/weekly",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();

        // Default values
        const defaultStats = {
          Mon: 0,
          Tue: 0,
          Wed: 0,
          Thu: 0,
          Fri: 0,
          Sat: 0,
          Sun: 0,
        };

        // Populate values from API
        data.forEach((item) => {
          if (item.day in defaultStats) {
            defaultStats[item.day] = item.emails;
          }
        });

        // Format with rotated day order
        const rotatedDays = getRotatedDays();
        const formatted = rotatedDays.map((day) => ({
          day,
          emails: defaultStats[day],
        }));

        setWeeklyStats(formatted);
      } catch (err) {
        console.error("Error fetching weekly stats:", err);
      }
    };

    fetchUserRecords();
    fetchWeeklyStats();
  }, []);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one CSV file.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    try {
      setLoading(true);
      setBulkTimeTaken(null);
      const token = localStorage.getItem("token");
      const startTime = performance.now();
      const response = await axios.post(
        "http://localhost:8000/validate-emails/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const endTime = performance.now(); // ⏱ end timer
      const seconds = ((endTime - startTime) / 1000).toFixed(2);

      setResults(response.data.results);
      setBulkTimeTaken(seconds);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSingleValidation = async (e) => {
    e.preventDefault();
    setSingleLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", singleEmail);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://127.0.0.1:8000/validate-single-email/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSingleResult(res.data);
      setSingleTimeTaken(res.data.time_taken);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
      setSingleResult(null);
    } finally {
      setSingleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-white p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-8">Email Validator</h1>
        <nav className="space-y-4">
          <button
            className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition ${
              selectedTab === "dashboard" ? "bg-blue-600" : "hover:bg-blue-900"
            }`}
            onClick={() => setSelectedTab("dashboard")}
          >
            <FaTachometerAlt /> Dashboard
          </button>
          <button
            className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition ${
              selectedTab === "profile" ? "bg-blue-600" : "hover:bg-blue-900"
            }`}
            onClick={() => setSelectedTab("profile")}
          >
            <FaUser /> Profile
          </button>
          <button
            className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition ${
              selectedTab === "analyze" ? "bg-blue-600" : "hover:bg-blue-900"
            }`}
            onClick={() => setSelectedTab("analyze")}
          >
            <FaChartBar /> Analyze Page
          </button>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        {selectedTab === "dashboard" && (
          <div className="p-6 space-y-8">
            <h2 className="text-3xl font-bold text-center">
              Welcome to the Dashboard!
            </h2>
            {/* Stats cards  */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white shadow-lg rounded-xl p-6 text-center">
                <p className="text-gray-500">Total Emails</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-green-100 shadow-lg rounded-xl p-6 text-center">
                <p className="text-gray-500">Valid Emails</p>
                <p className="text-2xl font-bold">{stats.valid}</p>
              </div>
              <div className="bg-red-100 shadow-lg rounded-xl p-6 text-center">
                <p className="text-gray-500">Invalid Emails</p>
                <p className="text-2xl font-bold">{stats.invalid}</p>
              </div>
              <div className="bg-yellow-100 shadow-lg rounded-xl p-6 text-center">
                <p className="text-gray-500">Disposable</p>
                <p className="text-2xl font-bold">{0}</p>
              </div>
            </div>
            {/* Line Chart */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">
                Emails Validated This Week
              </h3>

              {weeklyStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart width={600} height={300} data={weeklyStats}>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="emails" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-gray-500 text-center">
                  Loading chart data...
                </div>
              )}
            </div>
            {/* Pie Chart */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">
                Validation Type Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {/* analyze Tab */}

        {selectedTab === "analyze" && (
          <div className="text-gray-800">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] text-white py-20 px-6 text-center">
              <h1 className="text-5xl font-extrabold mb-4 animate-fade-in">
                Validate Emails with Precision
              </h1>
              <p className="text-lg md:text-xl mb-10 text-slate-300 animate-fade-in delay-100">
                Upload your CSV files and clean your email lists instantly.
                Protect your sender reputation.
              </p>
              <form
                onSubmit={handleSingleValidation}
                className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto animate-fade-in delay-200"
              >
                <input
                  type="email"
                  placeholder="Your email"
                  value={singleEmail}
                  onChange={(e) => setSingleEmail(e.target.value)}
                  required
                  className="px-5 py-3 w-full md:w-auto flex-1 rounded-lg bg-white/10 text-white placeholder:text-gray-300 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  type="submit"
                  disabled={singleLoading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-blue-400 transition duration-200 active:scale-95"
                >
                  {singleLoading ? "Checking..." : "Try Now"}
                </button>
              </form>
              {singleResult && (
                <div className="bg-white/10 mt-8 p-6 rounded-lg max-w-lg mx-auto text-left text-sm border border-white/20 text-white animate-fade-in delay-300">
                  <p>
                    <strong>Email:</strong> {singleResult.email}
                  </p>
                  <p>
                    <strong>Regex:</strong> {singleResult.regex}
                  </p>
                  <p>
                    <strong>MX:</strong> {singleResult.mx}
                  </p>
                  <p>
                    <strong>SMTP:</strong> {singleResult.smtp}
                  </p>
                  <p>
                    <strong>Status:</strong> {singleResult.status}
                  </p>
                </div>
              )}
              {singleTimeTaken !== null && (
                <div className="mt-6 flex justify-center">
                  <div className="relative px-6 py-3 bg-gradient-to-r from-green-100 to-green-200 border border-green-400 rounded-xl shadow-lg transform transition duration-300 hover:scale-105">
                    <div className="flex items-center space-x-2 text-green-800 text-sm font-medium animate-fade-in">
                      <span className="text-xl">⏱️</span>
                      <span>
                        Validation completed in{" "}
                        <span className="font-bold text-green-700">
                          {singleTimeTaken}
                        </span>{" "}
                        seconds
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Bulk Upload Section */}
            <section className="py-20 px-6 bg-[#f9fbfd]">
              <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-900 tracking-tight animate-fade-in">
                📤 Bulk Email Validation
              </h2>
              <div className="w-full p-4 border rounded-xl bg-white shadow-sm">
                <label className="block text-lg font-semibold mb-2 text-gray-800">
                  Upload CSV File(s)
                </label>

                <input
                  type="file"
                  multiple
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full px-4 py-2 text-gray-800 border border-blue-400 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />

                {selectedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {Array.from(selectedFiles).map((file, index) => (
                      <div
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-300"
                      >
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  🚀 Validate Emails
                </button>
                {loading && (
                  <p className="text-center mt-6 text-indigo-600 font-medium text-md animate-pulse">
                    Validating files... Hang tight!
                  </p>
                )}
                {bulkTimeTaken !== null && (
                  <div className="mt-6 flex justify-center">
                    <div className="relative px-6 py-3 bg-gradient-to-r from-green-100 to-green-200 border border-green-400 rounded-xl shadow-lg transform transition duration-300 hover:scale-105">
                      <div className="flex items-center space-x-2 text-green-800 text-sm font-medium animate-fade-in">
                        <span className="text-xl">⏱️</span>
                        <span>
                          Validation completed in{" "}
                          <span className="font-bold text-green-700">
                            {bulkTimeTaken}
                          </span>{" "}
                          seconds
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Results Section */}
            {results.length > 0 && (
              <section className="py-20 px-6 bg-white">
                <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">
                  Validation Results
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                  {results.map((file, idx) => {
                    const data = [
                      { name: "Valid", value: file.valid },
                      { name: "Invalid", value: file.invalid },
                      {
                        name: "Remaining",
                        value: file.total - file.valid - file.invalid,
                      },
                    ];
                    return (
                      <div
                        key={idx}
                        className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition animate-fade-in delay-300"
                      >
                        <h3 className="text-xl font-semibold mb-1 text-indigo-700">
                          {file.file}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Total Emails: {file.total}
                        </p>
                        <PieChart width={360} height={250}>
                          <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                          >
                            {data.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                        <div className="mt-4 space-y-2 text-sm">
                          <a
                            href={`http://localhost:8000${file.validated_download}`}
                            className="text-blue-600 hover:text-blue-800 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            ✅ Download Validated
                          </a>
                          {file.failed_download && (
                            <a
                              href={`http://localhost:8000${file.failed_download}`}
                              className="text-red-600 hover:text-red-800 underline block"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              ❌ Download Failed
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Other Tabs Placeholder */}
        {selectedTab === "dashboard" && (
          <div className="p-10 text-2xl font-semibold text-center">
            📊 More things will be added soon......
          </div>
        )}

        {selectedTab === "profile" && (
          <div className="p-8 max-w-4xl mx-auto space-y-12">
            {/* Section 1: User Details */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                👤 User Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Change Password
                  </label>
                  <input
                    type="password"
                    placeholder="New password"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Account Preferences */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                ⚙️ Account Preferences
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-blue-600 rounded border-gray-300"
                  />
                  <span className="text-gray-700">
                    Receive Email Notifications
                  </span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-blue-600 rounded border-gray-300"
                  />
                  <span className="text-gray-700">Enable Dark Mode</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-blue-600 rounded border-gray-300"
                  />
                  <span className="text-gray-700">
                    Two-Factor Authentication
                  </span>
                </label>
              </div>
              <div className="mt-6 text-right">
                <button
                  type="button"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition"
                >
                  Save Changes
                </button>
              </div>
            </section>

            {/* Section 3: Account Controls */}
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                🚨 Account Controls
              </h2>
              <p className="text-gray-600 mb-6">
                Manage your account status. You can deactivate your account
                temporarily or delete it permanently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  className="flex-1 py-3 bg-yellow-100 text-yellow-700 border border-yellow-300 hover:bg-yellow-200 font-semibold rounded-lg shadow-sm transition"
                >
                  Deactivate Account
                </button>
                <button
                  type="button"
                  className="flex-1 py-3 bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 font-semibold rounded-lg shadow-sm transition"
                >
                  Delete Account
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
