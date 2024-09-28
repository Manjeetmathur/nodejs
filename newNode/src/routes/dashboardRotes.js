import {Router} from "express"

import {verifyJWT} from "../middleware/auth.js"
import { getChannelStates, getChannelVideos } from "../controller/dashboard.js"

const router = Router()

router.use(verifyJWT)

router.route("/get-channel-video").get(getChannelVideos)
router.route("/get-channel-states").get(getChannelStates)

export default router