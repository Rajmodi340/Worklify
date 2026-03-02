import React, { useState, useEffect } from 'react';
import Sidebar from '../../component/Sidebar';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apipath';
import { Link } from 'react-router-dom';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

function Managetask() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASK.GET_ALL);
      // handle Admin response structure (same schema as user usually for list)
      if (response.data.tasks) {
        setTasks(response.data.tasks);
      } else if (Array.isArray(response.data)) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axiosInstance.delete(API_PATHS.TASK.DELETE(id));
        setTasks(tasks.filter(task => task._id !== id));
        toast.success("Task deleted successfully");
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <Toaster position="top-right" />
      <div className="flex-1 p-8 ml-64 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Tasks</h1>
          <Link to="/admin/createtask" className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <FaPlus /> Create Task
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-medium text-gray-600">Title</th>
                <th className="p-4 font-medium text-gray-600">Assigned To</th>
                <th className="p-4 font-medium text-gray-600">Status</th>
                <th className="p-4 font-medium text-gray-600">Priority</th>
                <th className="p-4 font-medium text-gray-600">Due Date</th>
                <th className="p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{task.title}</td>
                  <td className="p-4">
                    <div className="flex -space-x-2 overflow-hidden">
                      {task.assignedTo && task.assignedTo.map((user, idx) => (
                        <img
                          key={idx}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                          src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${user.name}`}
                          alt={user.name}
                          title={user.name}
                        />
                      ))}
                      {(!task.assignedTo || task.assignedTo.length === 0) && <span className="text-gray-400 text-sm">Unassigned</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold 
                                            ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold 
                                            ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(task.duedate || task.dueDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <FaTrash />
                    </button>
                    {/* Edit button could go here if implemented */}
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No tasks found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Managetask;
