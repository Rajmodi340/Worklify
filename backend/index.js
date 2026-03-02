import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import Authroute from './routes/Authroute.js'
import path from 'path'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import userroute from './routes/Userroute.js'
import taskroute from './routes/Taskroute.js'
import router1 from './routes/Reportroute.js'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

// Database connection
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("Error: MONGO_URI is not defined in .env file");
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1);
    }
};

// Apply middleware first (before routes)
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
)
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});
app.use("/api/auth", Authroute)
app.use("/api/user", userroute)
app.use("/api/task", taskroute)
app.use("/api/reports", router1)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

connectDB().then(() => {
    const port = process.env.PORT || 3000
    app.listen(port, () => console.log(`Server running on port ${port}`))
})
