import React, { useEffect, useState } from 'react';
import Sidebar from '../../component/Sidebar';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apipath';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FaClipboardList, FaCheckCircle, FaClock, FaExclamationCircle, FaDownload } from 'react-icons/fa';
import toast from 'react-hot-toast';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.TASK.USER_DASHBOARD_DATA);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'my_tasks_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report");
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

  if (!dashboardData) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 ml-64">
          <p>Error loading data.</p>
        </div>
      </div>
    )
  }

  const { statistics, charts, recentTasks } = dashboardData;

  // Prepare data for charts
  const statusLabels = {
    'pending': 'Pending',
    'inprogress': 'In Progress',
    'completed': 'Completed'
  };
  const statusData = ['pending', 'inprogress', 'completed'].map(key => ({
    name: statusLabels[key],
    value: charts?.taskDistribution?.[key] || 0
  }));

  const priorityData = charts?.taskPriorityLevel ? Object.keys(charts.taskPriorityLevel).map(key => ({
    name: key,
    value: charts.taskPriorityLevel[key]
  })) : [];

  const STATUS_COLORS = {
    'pending': '#FFBB28', // Yellow
    'inprogress': '#0088FE', // Blue
    'completed': '#00C49F' // Green
  };
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 ml-64 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleDownloadReport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaDownload />
            <span>Download Task Report</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Tasks"
            value={statistics.totalTasks}
            icon={<FaClipboardList className="text-white text-2xl" />}
            color="bg-blue-500"
          />
          <StatCard
            title="Completed"
            value={statistics.completedTasks}
            icon={<FaCheckCircle className="text-white text-2xl" />}
            color="bg-green-500"
          />
          <StatCard
            title="Pending"
            value={statistics.pendingTasks}
            icon={<FaClock className="text-white text-2xl" />}
            color="bg-yellow-500"
          />
          <StatCard
            title="Overdue"
            value={statistics.overdueTasks}
            icon={<FaExclamationCircle className="text-white text-2xl" />}
            color="bg-red-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Task Status Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={5}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[Object.keys(statusLabels).find(key => statusLabels[key] === entry.name)] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Task Priority</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-700">Recent Tasks</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 border-b font-medium text-gray-600">Title</th>
                  <th className="p-4 border-b font-medium text-gray-600">Status</th>
                  <th className="p-4 border-b font-medium text-gray-600">Priority</th>
                  <th className="p-4 border-b font-medium text-gray-600">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks && recentTasks.map(task => (
                  <tr key={task._id} className="hover:bg-gray-50 border-b last:border-0">
                    <td className="p-4 text-gray-800">{task.title}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                                ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                                ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(task.dueDate || task.duedate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(!recentTasks || recentTasks.length === 0) && (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">No recent tasks found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className={`p-4 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default Dashboard;
