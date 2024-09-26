import { Router } from "express";

import { verifyJWT } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";
import {
  deleteVideo,
  getAllVideo,
  getVideoByID,
  publishVideo,
  togglePublishStatus,
  updateVideo,
} from "../controller/videocontroller.js";

const router = Router();

router.use(verifyJWT);

router.route("/publish-video").post(upload.single("videoFile"), publishVideo);
router.route("/get-videos").get(getVideoByID);
router.route("/get-all-videos").get(getAllVideo);

router.route("/update-video").patch(upload.single("videoFile"), updateVideo);
router.route("/delete-video").delete(deleteVideo);
router.route("/toggle-video").patch(togglePublishStatus);
export default router;
