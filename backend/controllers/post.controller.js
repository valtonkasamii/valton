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

export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text) {
            return res.status(400).json({ error: "Text field is required" });
        }

        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const comment = { userId, text };

        await prisma.post.update({
            where: { id: postId },
            data: {
                comments: { push: comment }, // Assuming comments are stored as an array of objects
            },
        });

        res.status(200).json(post);
    } catch (error) {
        console.error("Error in commentOnPost controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: postId } = req.body;

        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            // Unlike post
            await prisma.post.update({
                where: { id: postId },
                data: { likes: { set: post.likes.filter(id => id !== userId) } },
            });
            await prisma.user.update({
                where: { id: userId },
                data: { likedPosts: { set: post.likedPosts.filter(id => id !== postId) } },
            });
            res.status(200).json({ message: "Post unliked successfully" });
            
        } else {
            // Like post
            await prisma.post.update({
                where: { id: postId },
                data: { likes: { push: userId } },
            });
            await prisma.user.update({
                where: { id: userId },
                data: { likedPosts: { push: postId } },
            });

            // Create notification for liking the post
            await prisma.notification.create({
                data: {
                    fromUserId: userId,
                    toUserId: post.user.id,
                    type: "like",
                },
            });

            res.status(200).json({ message: "Post liked successfully" });
        }
    } catch (error) {
        console.error("Error in likeUnlikePost controller:", error);
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
