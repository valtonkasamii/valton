import express from 'express'
import dotenv from "dotenv"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.route.js'

dotenv.config()

const app = express()

app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', 'https://valton-frontend.vercel.app'); // Replace with allowed origin
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.sendStatus(204); // No Content
    }
    next();
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: 'https://valton-frontend.vercel.app',
    credentials: true,
     allowedHeaders: ['Content-Type', 'Authorization']

}))
app.use(cookieParser())

app.use("/api/auth", authRoutes);
//app.use("/api/users", userRoutes);
//app.use("/api/posts", postRoutes);
//app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
