import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTrash,
  FaUserSlash,
  FaUserCheck,
  FaSyncAlt,
  FaEdit,
} from "react-icons/fa";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlock = async (id, blocked) => {
    try {
      await axios.post("http://127.0.0.1:8000/admin/block-user", {
        id,
        blocked: !blocked,
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/admin/delete-user/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const updateUser = async () => {
    try {
      await axios.put("http://127.0.0.1:8000/admin/update-user", editUser);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="text-white space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">👥 User Management</h2>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          title="Refresh user list"
        >
          <FaSyncAlt /> Refresh
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-3 py-2 rounded w-full text-black mb-3"
      />

      {loading ? (
        <p className="text-center text-gray-300">Loading users...</p>
      ) : (
        <div className="overflow-x-auto bg-white/10 p-4 rounded border border-white/20">
          <table className="w-full text-sm text-left text-white/80 border">
            <thead className="bg-gray-800 text-white uppercase text-xs">
              <tr>
                <th className="px-2 py-1 border">ID</th>
                <th className="px-2 py-1 border">Email</th>
                <th className="px-2 py-1 border">Role</th>
                <th className="px-2 py-1 border">Status</th>
                <th className="px-2 py-1 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-white/5 transition duration-200"
                >
                  <td className="px-2 py-1 border">{user.id}</td>
                  <td className="px-2 py-1 border">{user.email}</td>
                  <td className="px-2 py-1 border capitalize">
                    {user.status === "pending" ? (
                      <span className="text-yellow-400 font-semibold">Pending</span>
                    ) : (
                      user.role
                    )}
                  </td>

                  <td
                    className={`px-2 py-1 border font-semibold ${
                      user.blocked ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {user.blocked ? "Blocked" : "Active"}
                  </td>
                  <td className="px-2 py-1 border space-x-1">
                    <button
                      title="Edit user"
                      onClick={() =>
                        setEditUser({
                          id: user.id,
                          email: user.email,
                          role: user.role,
                          status: user.blocked ? "blocked" : "active",
                        })
                      }
                      className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      title={user.blocked ? "Unblock user" : "Block user"}
                      onClick={() => toggleBlock(user.id, user.blocked)}
                      className={`px-2 py-1 text-xs rounded ${
                        user.blocked
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-yellow-600 hover:bg-yellow-700"
                      }`}
                    >
                      {user.blocked ? <FaUserCheck /> : <FaUserSlash />}
                    </button>
                    <button
                      title="Delete user"
                      onClick={() => deleteUser(user.id)}
                      className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-400 italic"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editUser && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1f2937] p-6 rounded-2xl shadow-2xl w-96 space-y-5 border border-white/10">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              ✏️ Edit User
            </h3>

            <input
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Email"
              value={editUser.email}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            />

            <select
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
            >
              <option className="bg-gray-800" value="user">User</option>
              <option className="bg-gray-800" value="admin">Admin</option>
            </select>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditUser(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={updateUser}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UsersTab;
