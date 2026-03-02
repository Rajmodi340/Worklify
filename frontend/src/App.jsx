import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Dashboard from './pages/User/Dashboard'
import Managetask from './pages/Admin/Managetask'
import ManageUser from './pages/Admin/ManageUser'
import CreateTask from './pages/Admin/CreateTask'
import Dashboard1 from './pages/Admin/Dashboard1'
import MYtask from './pages/User/MYtask'
import PrivateRoute from './routes/Privateroute'
import Viewtaskdetail from './pages/User/Viewtaskdetail'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* admin */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>

          <Route path="/admin/managetask" element={<Managetask />} />
          <Route path="/admin/manageuser" element={<ManageUser />} />
          <Route path="/admin/createtask" element={<CreateTask />} />
          <Route path="/admin/dashboard1" element={<Dashboard1 />} />
        </Route>
        {/* user */}
        <Route element={<PrivateRoute allowedRoles={['user']} />}>
          <Route path="/user/dashboard" element={<Dashboard />} />
          <Route path="/user/mytask" element={<MYtask />} />
          <Route path="/user/viewtaskdetail/:id" element={<Viewtaskdetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
