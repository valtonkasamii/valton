import { PrismaClient } from '@prisma/client';
import {v2 as cloudinary} from "cloudinary"
const prisma = new PrismaClient();

export const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                following: true,
                followers: true,
                username: true,
                id: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserProfile: ", error.message);
        res.status(500).json({ error: error.message });
    }
};


export const followUnfollowUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Ensure target user and current user exist
        const userToModify = await prisma.user.findUnique({ where: { id } });
        const currentUser = await prisma.user.findUnique({ where: { id: req.user.id } });

        if (id === req.user.id) {
            return res.status(400).json({ error: "You can't follow/unfollow yourself" });
        }

        if (!userToModify || !currentUser) {
            return res.status(400).json({ error: "User not found" });
        }

        // Check if the follow relationship exists
        const existingFollow = await prisma.follow.findFirst({
            where: {
                followerId: id,
                followingId: req.user.id,
            },
        });

        if (existingFollow) {
            // Unfollow: Delete the follow relationship
            await prisma.follow.delete({
                where: { id: existingFollow.id },
            });
            return res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            // Follow: Create a new follow relationship
            await prisma.follow.create({
                data: {
                    followerId: id, // Current user doing the following
                    followingId: req.user.id,        // Target user being followed
                },
            });
            return res.status(200).json({ message: "User followed successfully" });
        }
    } catch (error) {
        console.error("Error in followUnfollowUser:", error.message);
        return res.status(500).json({ error: error.message });
    }
};