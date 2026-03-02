import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaThLarge, FaTasks, FaSignOutAlt, FaUser, FaUsers, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

import axiosInstance from '../utils/axiosinstance';
import { API_PATHS } from '../utils/apipath';

function Sidebar() {
    const navigate = useNavigate();
    // Initialize state from localStorage, but allow it to be updated
    const [user, setUser] = React.useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const isAdmin = user && user.role === 'admin';

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.PROFILE);
                if (response.data) {
                    setUser(response.data);
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
            } catch (error) {
                console.error("Failed to fetch fresh profile:", error);
                // If 401, maybe logout? For now just keep using localStorage or let interceptor handle it
            }
        };

        // Only fetch if we have a token (which axios instance handles via cookie) or user in localstorage
        // But simpler: just try fetching.
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        // We should also clear cookies if possible, but they are HttpOnly.
        // Redirect to login
        navigate('/login');
        toast.success("Logged out");
    };

    return (
        <div className="w-64 h-screen bg-white shadow-lg fixed left-0 top-0 flex flex-col z-50">
            <div className="p-6 border-b flex items-center justify-center">
                <h1 className="text-2xl font-bold text-blue-600">Worklify</h1>
            </div>

            <div className="p-4 flex items-center space-x-3 border-b bg-gray-50">
                {user.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <FaUser />
                    </div>
                )}
                <div>
                    <p className="font-semibold text-gray-800 text-sm truncate w-32">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role || 'Member'}</p>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {isAdmin ? (
                    // Admin Links
                    <>
                        <NavLink
                            to="/admin/dashboard1"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`
                            }
                        >
                            <FaThLarge />
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink
                            to="/admin/createtask"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`
                            }
                        >
                            <FaPlus />
                            <span>Create Task</span>
                        </NavLink>
                        <NavLink
                            to="/admin/managetask"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`
                            }
                        >
                            <FaTasks />
                            <span>Manage Tasks</span>
                        </NavLink>
                        <NavLink
                            to="/admin/manageuser"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`
                            }
                        >
                            <FaUsers />
                            <span>Manage Users</span>
                        </NavLink>
                    </>
                ) : (
                    // User Links
                    <>
                        <NavLink
                            to="/user/dashboard"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`
                            }
                        >
                            <FaThLarge />
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink
                            to="/user/mytask"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`
                            }
                        >
                            <FaTasks />
                            <span>My Tasks</span>
                        </NavLink>
                    </>
                )}
            </nav>

            <div className="p-4 border-t">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 text-red-500 px-4 py-3 rounded-lg hover:bg-red-50 w-full transition-colors"
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
