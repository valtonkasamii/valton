import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import { followUnfollowUser, getUserProfile, newPfp, search } from "../controllers/user.controller.js"

const router = express.Router()

router.get("/profile/:username", protectRoute, getUserProfile)
router.post("/follow/:id", protectRoute, followUnfollowUser)
router.post("/pfp", protectRoute, newPfp)
router.post("/search", protectRoute, search)

export default router