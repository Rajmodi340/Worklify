import { errorHandler } from "../utils/error.js"
import Task from "../models/Task.js"
import mongoose from "mongoose"
export const Createtask = async (req, res, next) => {
  try {
    const { title, description, priority, duedate, assignedTo, attachments, todoCheckLists } = req.body
    if (!Array.isArray(assignedTo))
      return next(errorHandler(400, "assigned to  must be an array of user ID"))
    const task = await Task.create({
      title,
      description,
      priority,
      duedate,
      assignedTo,
      attachments,
      todoCheckLists,
      createdBy: req.user._id
    })
    res.status(201).json({ message: "task created successfully", task })
  }
  catch (error) {
    next(error)
  }
}
export const gettasks = async (req, res, next) => {
  try {
    const { status } = req.query
    let filter = {}
    if (status) {
      filter.status = status
    }
    let tasks
    if (req.user.role === 'admin') {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "email name profileImageUrl"
      )
    } else {
      tasks = await Task.find({
        ...filter,
        assignedTo: req.user.id,
      }).populate("assignedTo", "name,email,profileImageUrl")
    }
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoCheckLists.filter((item) => item.completed).length
        return { ...task._doc, completedCount: completedCount }
      })
    )
    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user.id }
    )
    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user.id }),
    })
    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "in progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user.id }),
    })

    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user.id }),
    })
    res.status(200).json({
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    })
  }
  catch (error) {
    next(error)
  }
}
export const gettaskbyid = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo", "name email profileImageUrl")
    if (!task) {
      return next(errorHandler(404, "task not found"))
    }
    res.status(200).json(task)
  }
  catch (error) {
    next(error)
  }
}
export const updatetask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return next(errorHandler(404, "Task not found"))
    }
    task.title = req.body.title || task.title
    task.description = req.body.description || task.description
    task.priority = req.body.priority || task.priority
    task.duedate = req.body.duedate || task.duedate
    task.todoCheckLists = req.body.todoCheckLists || task.todoCheckLists
    task.attachments = req.body.attachments || task.attachments
    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return next(
          errorHandler(400, "assignedTo must be an array of user IDs")
        )
      }

      task.assignedTo = req.body.assignedTo
    }

    const updatedTask = await task.save()

    return res
      .status(200)
      .json({ updatedTask, message: "Task updated successfully!" })
  } catch (error) {
    next(error)
  }
}
export const deletask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return next(errorHandler(404, "Task not found!"))
    }

    await task.deleteOne()

    res.status(200).json({ message: "Task deleted successfully!" })
  }
  catch (error) {
    next(error)
  }
}
export const updatetaskstatus = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return next(errorHandler(404, "task not found"))
    }
    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user.id.toString()
    )
    if (!isAssigned && req.user.role != "admin") {
      return next(errorHandler(403, "unauthorized"))
    }
    task.status = req.body.status || task.status
    if (task.status === "completed") {
      task.todoCheckLists.forEach((item) => (item.completed = true))
    }
    await task.save()
    res.status(200).json({ message: "task status updated", task })
  }
  catch (error) {
    next(error)
  }
}
export const updatetaskchecklist = async (req, res, next) => {
  try {
    const { todoCheckLists } = req.body
    const task = await Task.findById(req.params.id)
    if (!task) {
      return next(errorHandler(404, "task not found"))
    }
    if (!task.assignedTo.includes(req.user.id) && req.user.role !== "admin") {
      return next(errorHandler(403, "not authorized to update checklist"))
    }
    task.todoCheckLists = todoCheckLists
    const completedcount = task.todoCheckLists.filter(
      (item) => item.completed
    ).length
    const totalitem = task.todoCheckLists.length
    task.progress = totalitem > 0 ? Math.round((completedcount / totalitem) * 100) : 0
    if (task.progress === 100) {
      task.status = "completed"
    } else if (task.progress > 0) {
      task.status = "in progress"
    } else {
      task.status = "pending"
    }

    await task.save()

    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    )

    res
      .status(200)
      .json({ message: "Task checklist updated", task: updatedTask })
  }
  catch (error) {
    next(error)
  }
}
export const getDashboarddata = async (req, res, next) => {
  try {
    const totaltasks = await Task.countDocuments()
    const pendingtasks = await Task.countDocuments({ status: "pending" })
    const completedtasks = await Task.countDocuments({ status: "completed" })
    const overduetasks = await Task.countDocuments({
      status: { $ne: "completed" },
      duedate: { $lt: new Date() }
    })
    const taskSatuses = ["pending", "in progress", "completed"]
    const taskDistributionsRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])
    const taskdistribution = taskSatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "") //remove spaces for response key
      acc[formattedKey] = taskDistributionsRaw.find((item) => item._id === status)?.count || 0
      return acc;
    }, {})
    taskdistribution["All"] = totaltasks
    const taskPriorities = ["low", "medium", "high"]

    const taskPriorityLevelRaw = await Task.aggregate([

      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ])

    const taskPriorityLevel = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelRaw.find((item) => item._id === priority)?.count || 0

      return acc
    }, {})
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority duedate createdAt")

    res.status(200).json({
      statistics: {
        totaltasks,
        pendingtasks,
        completedtasks,
        overduetasks,
      },
      charts: {
        taskdistribution,
        taskPriorityLevel,
      },
      recentTasks,
    })
  }

  catch (error) {
    next(error)
  }
}
export const userData = async (req, res, next) => {
  try {
    const userId = req.user.id

    // console.log(userId)

    // Convert userId to ObjectId for proper matching
    const userObjectId = new mongoose.Types.ObjectId(userId)

    // console.log(userObjectId)

    // fetch statistics for user-specific tasks
    const totalTasks = await Task.countDocuments({ assignedTo: userId })
    const pendingTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "pending",
    })
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "completed",
    })
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "completed" },
      duedate: { $lt: new Date() },
    })

    // Task distribution by status
    const taskStatuses = ["pending", "in progress", "completed"]

    const taskDistributionRaw = await Task.aggregate([
      {
        $match: { assignedTo: userObjectId },
      },
      {
        $group: { _id: "$status", count: { $sum: 1 } },
      },
    ])

    // console.log(taskDistributionRaw)

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "")

      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0

      return acc
    }, {})

    taskDistribution["All"] = totalTasks

    // Task distribution by priority
    const taskPriorities = ["low", "medium", "high"]

    const taskPriorityLevelRaw = await Task.aggregate([
      { $match: { assignedTo: userObjectId } },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ])

    const taskPriorityLevel = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelRaw.find((item) => item._id === priority)?.count || 0

      return acc
    }, {})

    const recentTasks = await Task.find({ assignedTo: userObjectId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority duedate createdAt")

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevel,
      },
      recentTasks,
    })
  } catch (error) {
    next(error)
  }
}