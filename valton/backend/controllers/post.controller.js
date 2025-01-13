import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

export const createPost = async (req, res) => {
    try {
        const { text, postimg } = req.body;
        const userId = req.user.id

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!text && !postimg) {
            return res.status(400).json({ error: "Post must have text or image" });
        }

        let imageUrl = postimg;
        if (postimg) {
            const uploadedResponse = await cloudinary.uploader.upload(postimg);
            imageUrl = uploadedResponse.secure_url;
        }

        const newPost = await prisma.post.create({
            data: {
                userId,
                text,
                img: imageUrl,
            },
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error in createPost controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await prisma.post.findUnique({ where: { id: postId } });
        
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.userId !== req.user.id) {
            return res.status(401).json({ error: "You are not authorized to delete this post" });
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await prisma.post.delete({ where: { id: postId } });

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error in deletePost controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: [{ createdAt: 'desc' }],
            include:
              { 
                  user : true,
                  comments : true 
              }
          });

          if (posts.length === 0) {
              return res.status(200).json([]);
          }

          res.status(200).json(posts);
      } catch (error) {
          console.error("Error in getAllPosts controller:", error);
          res.status(500).json({ error: "Internal server error" });
      }
};

export const getUserPosts = async (req, res) => {
	try {
		const { username } = req.params;

		const user = await prisma.user.findUnique({ where :{ username}});
		if (!user) return res.status(404).json({ error : "User not found" });

		const posts = await prisma.post.findMany({
			where :{ 
				user :{
					id :user.id 
				}
			},
			orderBy : [{ createdAt :'desc' }],
			include:{
				user: {
					include : {
						followers: true,
						following: true
					}
				},
				comments:true,
			}
		});

		res.status(200).json(posts);
	} catch (error) {
		console.error("Error in getUserPosts controller:", error);
		res.status(500).json({ error : "Internal server error" });
	}
};

export const getPostsFromFollowings = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const following = await prisma.follow.findMany({
        where: {
          followingId: userId, 
        },
        select: {
          followerId: true, 
        },
      });
  
      const followingIds = following.map(follow => follow.followerId);
  
      const posts = await prisma.post.findMany({
        where: {
          userId: { in: followingIds }, 
        },
        include: {
          user: true, 
        },
      });
  
      res.status(200).json(posts);
	} catch (error) {
		console.error("Error in getUserPosts controller:", error);
		res.status(500).json({ error : "Internal server error" });
	}
  };