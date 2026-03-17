import User from "../models/User.js"
import dotenv from "dotenv"
dotenv.config()
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { errorHandler } from "../utils/error.js"

 export const registerUser=async(req,res,next)=>{
    
 const { name, email, password, profileImageUrl, adminJoinCode } = req.body

  if (
    !name ||
    !email ||
    !password ||
    name === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"))
  }

  //   Check if user already exists
  const isAlreadyExist = await User.findOne({ email })

  if (isAlreadyExist) {
    return next(errorHandler(400, "User already exists"))
  }

  //   check user role
  let role = "user"

  if (adminJoinCode && adminJoinCode === process.env.ADMIN_INVITE_TOKEN) {
    role = "admin"
  }

  const hashedPassword = bcrypt.hashSync(password, 10)

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    profileImageUrl,
    role,
  })

  try {
    await newUser.save()

    res.json("Signup successful")
  } catch (error) {
    next(error.message)
  }
}
 
 export const loginUser=async(req,res,next)=>{
    try{
const {email,password}=req.body
if(!email||!password||email===""||password===""){
    return next(errorHandler(400,"All fields are required"))
}
const user=await User.findOne({email})
if(!user){
    return next(errorHandler(400,"Invalid credentials"))
}
const isPasswordCorrect=bcrypt.compareSync(password,user.password)
if(!isPasswordCorrect){
    return next(errorHandler(400,"Invalid credentials"))
}
const token=jwt.sign({id:user._id, role:user.role},process.env.JWT_SECRET)
console.log(token)
const {password:pass,...rest}=user._doc
const isProduction = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "production ";
res.status(200).cookie("access_token",token,{
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction
}).json(rest)
    }
    catch(error){
next(error)
    }
 }
 export const getUserProfile=async(req,res,next)=>{
    try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return next(errorHandler(404, "User not found!"))
    }

    const { password: pass, ...rest } = user._doc

    res.status(200).json(rest)
  } catch (error) {
    next(error)
  }
 }
 export const updateUserProfile=async(req,res,next)=>{
    try{
const user = await User.findById(req.user.id)

    if (!user) {
      return next(errorHandler(404, "User not found!"))
    }

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 10)
    }

    const updatedUser = await user.save()

    const { password: pass, ...rest } = user._doc

    res.status(200).json(rest)
  }
    catch(error){
next(error)
    }
 }
 export const uploadImage=async(req,res,next)=>{
    try {
    if (!req.file) {
      return next(errorHandler(400, "No file uploaded"))
    }

    // Save relative path so it works everywhere
    const imageUrl = `/uploads/${req.file.filename}`

    res.status(200).json({ imageUrl })
  } catch (error) {
    next(error)
  }
 }
