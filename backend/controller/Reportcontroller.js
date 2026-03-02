import Task from "../models/Task.js"
import User from "../models/User.js"
import exceljs from "exceljs"
export const exporttaskreport = async (req, res, next) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find().populate("assignedTo", "name email");
    } else {
      tasks = await Task.find({ assignedTo: req.user._id }).populate("assignedTo", "name email");
    }
    const workbook = new exceljs.Workbook()
    const worksheet = workbook.addWorksheet("Tasks Report")
    worksheet.columns = [
      { header: "Task Id", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "duedate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
    ]
    tasks.forEach((task) => {
      let assignedToStr = "Unassigned";
      if (task.assignedTo && task.assignedTo.length > 0) {
        // Check if assignedTo is actually an array of objects (populated)
        // If populate failed or data is inconsistent, map might fail if we don't check
        assignedToStr = task.assignedTo.map(user => `${user.name} (${user.email})`).join(", ");
      }

      worksheet.addRow({
        _id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        duedate: task.duedate ? task.duedate.toISOString().split("T")[0] : '',
        assignedTo: assignedToStr,
      })
    })
    res.setHeader(
      "Content-Type",
      "attachment/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="tasks_report.xlsx"'
    )

    return workbook.xlsx.write(res).then(() => {
      res.end()
    })
  }
  catch (error) {
    next(error)
  }
}
export const exportuserreport = async (req, res, next) => {
  try {
    const users = await User.find().select("name email _id").lean()

    const userTasks = await Task.find().populate("assignedTo", "name email _id")

    const userTaskMap = {}

    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      }
    })

    userTasks.forEach((task) => {
      if (task.assignedTo) {
        task.assignedTo.forEach((assignedUser) => {
          if (userTaskMap[assignedUser._id]) {
            userTaskMap[assignedUser._id].taskCount += 1

            if (task.status === "pending") {
              userTaskMap[assignedUser._id].pendingTasks += 1
            } else if (task.status === "in progress") {
              userTaskMap[assignedUser._id].inProgressTasks += 1
            } else if (task.status === "completed") {
              userTaskMap[assignedUser._id].completedTasks += 1
            }
          }
        })
      }
    })

    const workbook = new exceljs.Workbook()

    const worksheet = workbook.addWorksheet("User Task Report")

    worksheet.columns = [
      { header: "User Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 40 },
      { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
      { header: "Pending Tasks", key: "pendingTasks", width: 20 },
      { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
      { header: "Completed Tasks", key: "completedTasks", width: 20 },
    ]

    Object.values(userTaskMap).forEach((user) => {
      worksheet.addRow(user)
    })

    res.setHeader(
      "Content-Type",
      "attachment/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="users_report.xlsx"'
    )

    return workbook.xlsx.write(res).then(() => {
      res.end()
    })
  } catch (error) {
    next(error)
  }
}