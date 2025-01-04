import express from 'express'
import dotenv from "dotenv"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.route.js'
import postRoutes from './routes/post.route.js'
import userRoutes from './routes/user.route.js'
import {v2 as cloudinary} from "cloudinary"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: 'https://valton-frontend.vercel.app',
    allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization', 'X-Custom-Header'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
}))
app.use(cookieParser())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://valton-frontend.vercel.app'); // Specify your frontend URL
    res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies, authorization headers)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Allowed methods
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
    next(); // Proceed to the next middleware or route handler
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})