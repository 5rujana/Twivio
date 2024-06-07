import { Router } from "express";
import {registerUser,
        loginUser, 
        logoutUser,
        refreshAccessToken,
        changeCurrentPassword,
        getCurrentUser,
        updateAccountDetails,
        updateUserAvatar,
        updateUserCoverImage,
        getUserChannelProfile,
        getWatchHistory } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar", //jo frontend ka feild banega uska naam bhi avatar hoga
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]), //returns middleware that processes multiple files associated with the given form feild
    registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/get-user").get(verifyJWT, getCurrentUser)
router.route("/update-attach-details").patch(verifyJWT, updateAccountDetails)
router.route("/avatar".patch(verifyJWT, upload.single("avatar"), updateUserAvatar))
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

//jab params se le rahe hai data
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)

export default router

/* note: agar upload.fields mei name: jo diya hai agar vo different hoga hamare database ke feild se
 toh multer usko nahi samjhega and vo upload nehi karva payega and error dega, tho dyaan rakhna*/