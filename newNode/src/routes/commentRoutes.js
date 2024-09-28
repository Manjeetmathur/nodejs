import {Router} from "express"
import { verifyJWT } from "../middleware/auth.js"
import { addComment, deleteComment, getVideoComments, updateComment } from "../controller/commentController.js"

const router = Router()

router.use(verifyJWT)

router.route("/add-comment").post(addComment)
router.route("/update-comment").patch(updateComment)
router.route("/delete-comment").delete(deleteComment)
router.route("/get-all-comment").get(getVideoComments)

export default router