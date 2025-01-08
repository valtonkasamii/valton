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
                id: true,
                profileImg: true
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
        const userToModify = await prisma.user.findUnique({ where: { id } });
        const currentUser = await prisma.user.findUnique({ where: { id: req.user.id } });

        if (id === req.user.id) {
            return res.status(400).json({ error: "You can't follow/unfollow yourself" });
        }

        if (!userToModify || !currentUser) {
            return res.status(400).json({ error: "User not found" });
        }

        const existingFollow = await prisma.follow.findFirst({
            where: {
                followerId: id,
                followingId: req.user.id,
            },
        });

        if (existingFollow) {
            await prisma.follow.delete({
                where: { id: existingFollow.id },
            });
            return res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            await prisma.follow.create({
                data: {
                    followerId: id, 
                    followingId: req.user.id,        
                },
            });
            return res.status(200).json({ message: "User followed successfully" });
        }
    } catch (error) {
        console.error("Error in followUnfollowUser:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

export const newPfp = async (req, res) => {
    try {
        const { pfp } = req.body;
        const userId = req.user.id

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: "User not found" });

        let imageUrl = pfp;
        if (pfp) {
            const uploadedResponse = await cloudinary.uploader.upload(pfp);
            imageUrl = uploadedResponse.secure_url;
        }

        await prisma.user.update({
            where: { id: userId },
            data: { profileImg: imageUrl },
        });

        res.status(201).json(user);
    } catch (error) {
        console.error("Error in createPost controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const search = async (req, res) => {
    try {
      const { search } = req.body;
  
      if (!search) {
        return res.status(400).json({ message: "Search term is required." });
      }
  
      const users = await prisma.user.findMany({
        where: {
          username: {
            startsWith: search,  
            mode: 'insensitive', 
          },
        },
        take: 5,
      });
  
      if (users.length === 0) {
        return res.status(404).json({ message: "No users found." });
      }
  
      res.status(200).json(users);
    } catch (error) {
      console.error("Error in search controller:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };