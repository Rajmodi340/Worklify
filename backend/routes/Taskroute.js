import express from "express"
const taskroute=express.Router()
import { gettasks, updatetaskchecklist } from "../controller/Taskcontroller.js"
import { adminonly, protect } from "../middleware/authmiddleware.js"
import { Createtask } from "../controller/Taskcontroller.js"
import { updatetask } from "../controller/Taskcontroller.js"
import { gettaskbyid } from "../controller/Taskcontroller.js"
import { deletask } from "../controller/Taskcontroller.js"
import { updatetaskstatus } from "../controller/Taskcontroller.js"
import { getDashboarddata } from "../controller/Taskcontroller.js"
import { userData } from "../controller/Taskcontroller.js"
taskroute.post("/create",protect,adminonly,Createtask)
taskroute.get("/",protect,gettasks)
taskroute.get("/dashboard-data",protect,adminonly,getDashboarddata)
taskroute.get("/user-dashboard-data",protect,userData)
taskroute.get("/:id",protect,gettaskbyid)
taskroute.put("/:id",protect,updatetask)
taskroute.delete("/:id",protect,adminonly,deletask)
taskroute.put("/:id/status",protect,updatetaskstatus)
taskroute.put("/:id/todo",protect,updatetaskchecklist)
 export default taskroute