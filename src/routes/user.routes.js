import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avtar", //jo frontend ka feild banega uska naam bhi avatar hoga
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]), //returns middleware that processes multiple files associated with the given form feild
    registerUser)

export default router