import express from 'express'
import dotenv from "dotenv"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.route.js'
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: 'https://valton-frontend.vercel.app',
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
}))
app.use(cookieParser())
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://valton-frontend.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(204); // No Content
});

app.use('/api/auth/login', createProxyMiddleware({
    target: 'https://valton.vercel.app', // The original API URL
    changeOrigin: true,
    pathRewrite: {
        '^/api/auth/login': '/api/auth/login', // Rewrite the path if necessary
    },
    onProxyReq: (proxyReq, req, res) => {
        // You can modify the request here if needed
        proxyReq.setHeader('Content-Type', 'application/json');
        if (req.body) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.write(bodyData);
        }
    }
}));


app.use("/api/auth", authRoutes);
//app.use("/api/users", userRoutes);
//app.use("/api/posts", postRoutes);
//app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
