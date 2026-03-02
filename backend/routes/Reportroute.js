import express from "express"
import { exporttaskreport, exportuserreport } from "../controller/Reportcontroller.js"
import { adminonly, protect } from "../middleware/authmiddleware.js"
const router1 = express.Router()
router1.get("/exports/tasks", protect, exporttaskreport)
router1.get("/exports/users", protect, adminonly, exportuserreport)
export default router1
