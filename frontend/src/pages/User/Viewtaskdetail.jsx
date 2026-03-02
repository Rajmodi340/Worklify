import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../component/Sidebar';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apipath';
import toast, { Toaster } from 'react-hot-toast';
import { FaCalendarAlt, FaFlag, FaArrowLeft, FaCheckSquare, FaSquare } from 'react-icons/fa';

function Viewtaskdetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASK.GET_BY_ID(id));
      setTask(response.data);
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast.error("Failed to load task details.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axiosInstance.put(API_PATHS.TASK.UPDATE_STATUS(id), { status: newStatus });
      setTask(prev => ({ ...prev, status: newStatus }));
      toast.success(`Task marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  const handleChecklistToggle = async (index) => {
    if (!task) return;

    const newChecklist = [...task.todoCheckLists];
    newChecklist[index].completed = !newChecklist[index].completed;

    try {
      await axiosInstance.put(API_PATHS.TASK.UPDATE_TODO(id), { todoCheckLists: newChecklist });
      // The backend returns updated task, but let's just update local state for speed if we trust our logic, 
      // OR use the response. Backend returns { message, task: updatedTask }
      // Let's refetch or just update local
      // Ideally use response
      const response = await axiosInstance.get(API_PATHS.TASK.GET_BY_ID(id)); // Refetch to be safe with progress calculation
      setTask(response.data);
      toast.success("Checklist updated");
    } catch (error) {
      console.error("Error updating checklist:", error);
      toast.error("Failed to update checklist.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-64">
          <p>Task not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <Toaster position="top-right" />
      <div className="flex-1 p-8 ml-64 overflow-y-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Tasks
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-800">{task.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide
                                ${task.priority === 'high' ? 'bg-red-100 text-red-600' :
                  task.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                    'bg-green-100 text-green-600'}`}>
                {task.priority}
              </span>
            </div>

            <div className="flex flex-wrap gap-6 text-gray-600 mb-8">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                <span>Due: {new Date(task.duedate || task.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <FaFlag className="mr-2 text-blue-500" />
                <span className="capitalize">Status: <span className="font-semibold text-gray-800">{task.status}</span></span>
              </div>
            </div>

            <div className="prose max-w-none text-gray-700 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p>{task.description}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Action Items</h3>

            {/* Status Actions */}
            <div className="flex space-x-3 mb-8">
              {task.status !== 'completed' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Mark Complete
                </button>
              )}
              {task.status === 'pending' && (
                <button
                  onClick={() => handleStatusChange('in progress')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Start Progress
                </button>
              )}
            </div>

            {/* Checklist */}
            {task.todoCheckLists && task.todoCheckLists.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-3">Checklist</h4>
                <div className="space-y-3">
                  {task.todoCheckLists.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer
                                                ${item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-blue-300'}`}
                      onClick={() => handleChecklistToggle(index)}
                    >
                      <div className={`mr-3 text-xl ${item.completed ? 'text-green-500' : 'text-gray-300'}`}>
                        {item.completed ? <FaCheckSquare /> : <FaSquare />}
                      </div>
                      <span className={`${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {/* Checklist item structure might just be a string or object. 
                                                    Model says: todoCheckLists is array. 
                                                    Code implies item has .completed. 
                                                    Let's assume item is object { task: "string", completed: boolean } based on usage. 
                                                    Wait, if item is just string, how to store completed? 
                                                    Taskcontroller.js: item.completed=true/false. So it MUST be an object.
                                                */}
                        {item.task || item.description || "Checklist Item"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Viewtaskdetail;
