import express from "express"
const Authroute=express.Router()
import { protect } from "../middleware/authmiddleware.js"
import { registerUser } from "../controller/Authcontroller.js"
import { loginUser } from "../controller/Authcontroller.js"
import { getUserProfile } from "../controller/Authcontroller.js"
import { updateUserProfile } from "../controller/Authcontroller.js"
import upload from "../middleware/uploadmiddleware.js"
import { uploadImage } from "../controller/Authcontroller.js"
Authroute.post("/register",registerUser)
Authroute.post("/login",loginUser)
Authroute.get("/profile",protect,getUserProfile)
Authroute.put("/update",protect,updateUserProfile)
Authroute.post("/upload-image",upload.single("image"),uploadImage)

export default Authroute
   
