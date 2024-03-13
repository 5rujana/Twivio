import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


//cookie parser:
//cors: allows us to do setting in cross origin resourse sharing
//cors configuration ......
//app.use is used for configuration and using middlewares
app.use(cors(
    {
    origin: process.env.CORS_ORIGIN,
    credentials: true
    }
))

//we can configure json this way,mai json ko accept kar raha hu
app.use(express.json({
    limit:"16kb"
}))

//url configure , kyuki urls generally different browsers me differently work karega
app.use(express.urlencoded({
    extended:true,
    //in extended ham objects ke andar bhi objects de pate hai
    limit:"16kb"
}))

//sometimes i wanna store files , pdfs,image which are public asserts
app.use(express.static("public"))

app.use(cookieParser())


//routes import
import userRouter from "./routes/user.routes.js";

export {app}
// export default app;



//middleware - check in  to connect url to (req,res)
 
