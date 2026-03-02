import express from "express"
const userroute=express.Router()
import { adminonly, protect } from "../middleware/authmiddleware.js"
import { getUsers } from "../controller/Usercontroller.js"
// user managemnt
import { getuserbyid } from "../controller/Usercontroller.js"
userroute.get("/getuser",protect,adminonly,getUsers)
userroute.get("/:id",protect,getuserbyid)
export default userroute