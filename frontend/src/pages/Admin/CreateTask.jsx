import React, { useState, useEffect } from 'react';
import Sidebar from '../../component/Sidebar';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apipath';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function CreateTask() {
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    duedate: '',
    assignedTo: [], // Array of user IDs
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USER.GET_ALL);
      // Assuming the response is an array of users or object with users
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response.data.users) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleUserSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setTaskData({ ...taskData, assignedTo: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post(API_PATHS.TASK.CREATE, taskData);
      toast.success("Task created successfully!");
      setTimeout(() => navigate('/admin/managetask'), 1500);
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <Toaster position="top-right" />
      <div className="flex-1 p-8 ml-64 overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Task</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={taskData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={taskData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  name="duedate"
                  value={taskData.duedate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
              <select
                multiple
                name="assignedTo"
                value={taskData.assignedTo}
                onChange={handleUserSelect}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                required
              >
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple users.</p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/managetask')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 mr-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${loading ? 'opacity-50' : ''}`}
              >
                {loading ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTask;
