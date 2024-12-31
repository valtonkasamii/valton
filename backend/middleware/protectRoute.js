import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"

const prisma = new PrismaClient();


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).json({error: "Unauthorized: No Token Provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid Token" })
        }
        
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId, 
            },
            select: {
                id: true,
                username: true,
                profileImg: true,
                likedPosts: true,
                posts: true,
                comments: true,
                followers: true,
                following: true,
                createdAt: true,
                updatedAt: true,
                password: false, 
            },
        });
        if (!user) {
            return res.status(404).json({error: "User not found"})
        }

        req.user = user
        next()
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}