import React, { useState, useEffect } from 'react';
import Sidebar from '../../component/Sidebar';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apipath';
import { Link } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaSpinner } from 'react-icons/fa';

function MYtask() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, [filterStatus]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      let url = API_PATHS.TASK.GET_ALL;
      if (filterStatus !== 'all') {
        url += `?status=${filterStatus}`;
      }
      const response = await axiosInstance.get(url);
      // Response structure might be { tasks: [], statusSummary: {} } based on controller
      // Or just array if I misread. Let's assume controller: res.status(200).json({ tasks, statusSummary })
      if (response.data.tasks) {
        setTasks(response.data.tasks);
      } else if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 ml-64 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
          <div className="flex space-x-2">
            {['all', 'pending', 'in progress', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-colors
                                    ${filterStatus === status
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map(task => (
              <Link to={`/user/viewtaskdetail/${task._id}`} key={task._id} className="block group">
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-transparent group-hover:border-blue-500 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold uppercase
                                            ${task.priority === 'high' ? 'bg-red-100 text-red-600' :
                        task.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                          'bg-green-100 text-green-600'}`}>
                      {task.priority}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded
                                             ${task.status === 'completed' ? 'bg-green-50 text-green-600' :
                        task.status === 'in progress' ? 'bg-blue-50 text-blue-600' :
                          'bg-yellow-50 text-yellow-600'}`}>
                      {task.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{task.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{task.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t">
                    <div className="flex items-center space-x-1">
                      <FaClock />
                      <span>{new Date(task.duedate || task.dueDate).toLocaleDateString()}</span>
                    </div>
                    {task.todoCheckLists && task.todoCheckLists.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <FaCheckCircle />
                        <span>{task.completedCount}/{task.todoCheckLists.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}

            {!loading && tasks.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No tasks found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MYtask;
