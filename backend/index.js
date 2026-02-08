import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import path from 'path'
import mongoose from 'mongoose'
const app=express()
app.use(
    cors({
        origin:process.env.CLIENT_URL||"*",
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"],
    })
)
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Connected to MongoDB")
})
.catch((err)=>{
    console.error("Error connecting to MongoDB",err)
})
app.use(express.json())
const port=process.env.PORT||2612
app.listen(port,()=>console.log(`Server running on port ${port}`))
