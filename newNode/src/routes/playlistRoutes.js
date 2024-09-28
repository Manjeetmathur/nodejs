import {Router} from "express"

import {verifyJWT} from "../middleware/auth.js"
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controller/playlistController.js"

const router = Router()

router.use(verifyJWT)

router.route("/create-playlist").post(createPlaylist)
router.route("/add-video-to-playlist").patch(addVideoToPlaylist)
router.route("/remove-video-from-playlist").patch(removeVideoFromPlaylist)
router.route("/update-playlist").patch(updatePlaylist)
router.route("/delete-playlist").delete(deletePlaylist)
router.route("/get-playlist").get(getPlaylistById)
router.route("/get-user-playlist").get(getUserPlaylists)

export default router