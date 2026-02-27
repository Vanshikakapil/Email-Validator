import { FaChartPie } from "react-icons/fa"; // or use Lucide icon if using that library
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="p-4 text-white bg-gray-900 h-full space-y-4">
      <Link to="/admin/dashboard" className="block hover:text-blue-400">Dashboard</Link>
      <Link to="/admin/analyze" className="block hover:text-blue-400">
        <FaChartPie className="inline mr-2" /> Analyze
      </Link>
      {/* Add more links here */}
    </div>
  );
};

export default Sidebar;
