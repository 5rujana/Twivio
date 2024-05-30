import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"

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

export default router

/* note: agar upload.fields mei name: jo diya hai agar vo different hoga hamare database ke feild se
 toh multer usko nahi samjhega and vo upload nehi karva payega and error dega, tho dyaan rakhna*/