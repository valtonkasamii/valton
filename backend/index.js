import express from 'express'
import dotenv from "dotenv"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.route.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.options('/api/*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://valton-frontend.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).send();
});
app.use(cors({
    origin: 'https://valton-frontend.vercel.app',
    credentials: true
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
