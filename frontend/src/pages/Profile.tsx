import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { username, email, verified, logout } = useAuth();

  console.log(username, email);

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
        <div className="space-y-6">
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Username
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-800">{username}</span>
              <button
                className="text-blue-600 hover:underline text-sm px-2 py-1 rounded transition-colors"
                type="button"
                disabled
              >
                Change
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Email
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-800">{email}</span>
              <button
                className="text-blue-600 hover:underline text-sm px-2 py-1 rounded transition-colors"
                type="button"
                disabled
              >
                Change
              </button>
            </div>
          </div>
          <div>
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
          <div className="flex flex-col gap-2 mt-6">
            <button
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
              type="button"
              onClick={logout}
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
