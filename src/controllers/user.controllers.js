import {asyncHandler} from "../utils/asyncHandler.js"
import{ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {UploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser = asyncHandler(async (req,res) =>{
    // get user details from user (from fronted)
    const {fullname,email,username,password} = req.body
    console.log(`email: ${email}`)
    if([fullname,email,username,password].some((feild)=> feild?.trim()==="")){
        throw new ApiError(400,"All feilds are required")
    }
    //validation - not empty 
    //check if user already exist
    const existingUser = User.findOne({
        $or:[{username},{email}]
    })

    if(existingUser){
        throw new ApiError(409,"User already exists")
    }
    //check of images,check for avtar
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"Avtar is required")
    }
    //upload to cloudinary, avtar
    const avatar = await UploadOnCloudinary(avatarLocalPath)
    const coverImage = coverImageLocalPath ? await UploadOnCloudinary(coverImageLocalPath) : null
    if(!avatar){
        throw new ApiError(500,"Failed to upload image")
    }
    // create user object - create entry in db
    const user = await User.create({
        fullname,
        email,
        username:username.toLowerCase(),
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || ""
    })
    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    //check for user creation
    if(!createdUser){
        throw new ApiError(500,"Failed to register user")
    }
    //return response
    return res.status(201).json(
        new ApiResponse(201,createdUser,"User registered successfully")

    )
 
})

export {registerUser} 