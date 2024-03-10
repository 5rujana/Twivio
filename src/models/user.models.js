import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema({
    username: {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true //searching optimum banana hai tho index true kardo
    },
    fullname: {
        type:String,
        required:true,
        trim:true,
        index:true //searching optimum banana hai tho index true kardo
    },
    avtar:{
        type:String, //cloudinary url
        required:true,
    },
    coverImage:{
        type:String, //cloudinary url
    },
    watchHistrory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,"password is required"],
    },
    refreshToken : {
        type:String
    },
},{
    timestamps:true,
})
//save is an event asise hi 
//validate
//updateOne
//remove
//deleteOne
//init(note:init hooks are synchronous) 
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next() //agar password change nahi hua tho next
     this.password = brcypt.hash(this.password,10)
     next()
} )
//pre is hook of middleware


userSchema.methods.isPasswordMatch = async function (password) {
    return await bcrypt.compare(password,this.password)
} 
export const User = mongoose.model("User", userSchema)

userSchema.methods.generateAccessToken = function () {
    //sign method is used to generate token
    return jwt.sign(
        {
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname, 
        },
        process.env.ACCESS_TOKEN_SECRET,

            {
                expiresIn:process.env.ACCESS_TOKEN_EXPIRY
            
            }
    )
}

userSchema.methods.generateRefreshToken = function () {
    //sign method is used to generate token
    return jwt.sign(
        {
        _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,

            {
                expiresIn:process.env.REFRESH_TOKEN_EXPIRY
            
            }
    )
} 