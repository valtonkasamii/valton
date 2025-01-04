import express from "express"
import { commentOnPost, createPost, deletePost, getAllPosts, getUserPosts, likeUnlikePost } from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router()

router.get("/all", protectRoute, getAllPosts)
router.get("/user/:username", protectRoute, getUserPosts)
router.post("/create", protectRoute, createPost);
router.post("/like", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

export default router