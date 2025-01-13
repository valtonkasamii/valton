import express from "express"
import { createPost, deletePost, getAllPosts, getUserPosts, getPostsFromFollowings } from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router()

router.get("/all", protectRoute, getAllPosts)
router.get("/following", protectRoute, getPostsFromFollowings)
router.get("/user/:username", protectRoute, getUserPosts)
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);

export default router