import axios from "axios";

export default axios.create({
  baseURL: "http://127.0.0.1:8000/docs",
  withCredentials: true,
});
// Example:
const res = await axios.post("/api/admin/login", { email, password }, { withCredentials: true });
if (res.data.success) navigate("/admin/dashboard");
