import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        //check cb callback function later for other parameters
        cb(null, ".public/temp")
    },
    filename: function(req,file,cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname + '-' + uniqueSuffix)
        //file.fieldname
    }
})

export const upload = multer({
    storage: storage //matlab? iska matlab hai ki storage method jo humne upar define kiya hai vo use karna hai
})

 



