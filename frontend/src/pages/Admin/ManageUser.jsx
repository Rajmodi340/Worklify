import React, { useState, useEffect } from 'react';
import Sidebar from '../../component/Sidebar';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apipath';
import toast, { Toaster } from 'react-hot-toast';

function ManageUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USER.GET_ALL);
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response.data.users) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <Toaster position="top-right" />
      <div className="flex-1 p-8 ml-64 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Users</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-medium text-gray-600">User</th>
                <th className="p-4 font-medium text-gray-600">Email</th>
                <th className="p-4 font-medium text-gray-600">Role</th>
                <th className="p-4 font-medium text-gray-600">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 flex items-center space-x-3">
                    <img
                      src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${user.name}`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-800">{user.name}</span>
                  </td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold capitalize
                                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageUser;
