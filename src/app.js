import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//cors configuration ......
//app.use is used for configuration and using middlewares
app.use(cors(
    {
    origin: process.env.CORS_ORIGIN,
    credentials: true
    }
))

export {app}
// export default app;
