import {Router} from "express"

import {verifyJWT} from "../middleware/auth.js"
import { getAllLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controller/likeController.js"

const router = Router()
router.use(verifyJWT)

router.route("/toggle-video-like").post(toggleVideoLike)
router.route("/toggle-comment-like").post(toggleCommentLike)
router.route("/toggle-tweet-like").post(toggleTweetLike)
router.route("/get-all-liked-video").get(getAllLikedVideos)

export default router