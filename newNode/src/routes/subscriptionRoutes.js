import { Router } from "express";

import { verifyJWT } from "../middleware/auth.js";
import { getSubscribedChannels, getUserChannelSubscriber, toggleSubscription } from "../controller/subscriptionController.js";

const router = Router();

router.use(verifyJWT);

router.route("/toggle-subscription").post(toggleSubscription)
router.route("/get-channel-subscriber").get(getUserChannelSubscriber)
router.route("/get-subscribed-channels").get(getSubscribedChannels)

export default router;