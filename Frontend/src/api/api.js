// api.js
import axios from "axios";

export const getAdminStats = async () => {
  const [summary, users, rate] = await Promise.all([
    axios.get("http://127.0.0.1:8000/admin/summary"),
    axios.get("http://127.0.0.1:8000/admin/active-users"),
    axios.get("http://127.0.0.1:8000/admin/success-rate")
  ]);

  return {
    total: summary.data.total_validations,
    users: users.data.active_users,
    rate: rate.data.success_rate
  };
};
