import Router from 'express'
import { verifyJWT } from '../middleware/auth.js'
import { createTweet, deleteTweet, getUserTweets, updateTweet } from '../controller/tweetController.js';

const router=Router()

router.use(verifyJWT);

router.route("/create-tweet").post(createTweet)
router.route("/get-user-tweets").get(getUserTweets)
router.route("/update-tweet").patch(updateTweet)
router.route("/delete-tweet").delete(deleteTweet)

export default router