import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { username, email, verified, logout, token, updateUser } = useAuth();

  const [editField, setEditField] = useState<"username" | "email" | null>(null);

  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEdit = (field: "username" | "email") => {
    setEditField(field);
    setValue(field === "username" ? username || "" : email || "");
  };

  const handleCancel = () => {
    setEditField(null);
    setValue("");
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editField === "username") {
        await api.post(
          "/update-name",
          { name: value },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Username updated successfully");
        updateUser(value, email || "");
      } else if (editField === "email") {
        await api.post(
          "/update-email",
          { newEmail: value },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Email updated successfully");
        updateUser(username || "", value);
      }
      setEditField(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
          <Link
            to="/"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Back
          </Link>
        </div>
        <div className="space-y-8">
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Username
            </label>
            {editField === "username" ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  autoFocus
                />
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors font-medium"
                  type="button"
                  onClick={handleSave}
                  disabled={loading || !value.trim()}
                >
                  {loading ? (
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full align-middle"></span>
                  ) : (
                    "Save"
                  )}
                </button>
                <button
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors font-medium"
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-gray-800">{username}</span>
                <button
                  className="text-blue-600 hover:underline text-sm px-2 py-1 rounded transition-colors"
                  type="button"
                  onClick={() => handleEdit("username")}
                >
                  Change
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Email
            </label>
            {editField === "email" ? (
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  autoFocus
                />
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors font-medium"
                  type="button"
                  onClick={handleSave}
                  disabled={loading || !value.trim()}
                >
                  {loading ? (
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full align-middle"></span>
                  ) : (
                    "Save"
                  )}
                </button>
                <button
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors font-medium"
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-gray-800">{email}</span>
                <button
                  className="text-blue-600 hover:underline text-sm px-2 py-1 rounded transition-colors"
                  type="button"
                  onClick={() => handleEdit("email")}
                >
                  Change
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label className="block text-gray-600 font-medium mb-1">
              Verified
            </label>
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                verified
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {verified ? "Verified" : "Not Verified"}
            </span>
          </div>

          <div className="flex flex-col gap-2 mt-8">
            <button
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
              type="button"
              onClick={() => {
                logout(), toast.success("Logged out successfully!");
              }}
            >
              Logout
            </button>
            <button
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors font-semibold"
              type="button"
              disabled
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
