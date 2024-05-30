import {asyncHandler} from "../utils/asyncHandler.js"
import{ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {UploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }
}




const registerUser = asyncHandler(async (req,res) =>{
    // get user details from user (from fronted)
    const {fullname,email,username,password} = req.body
    console.log(`email: ${email}`)
    if([fullname,email,username,password].some((feild)=> feild?.trim()==="")){
        throw new ApiError(400,"All feilds are required")
    }
    //validation - not empty 
    //check if user already exist
    const existingUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existingUser){
        throw new ApiError(409,"User already exists")
    }
    console.log(req.files)
    //check of images,check for avtar
    const avatarLocalPath = req.files?.avatar[0]?.path
   // const coverImageLocalPath = req.files?.coverImage[0]?.path
    let coverImageLocalPath;
    // we use this check instead of the one mentioned above because
    // if cover image is not uploaded then it will throw error: cannot read properties of undefined
    //prolly cause req.files.coverImage is undefined and uska size 0 hai
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath = req.files.coverImage[0].path 
    }

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


const loginUser = asyncHandler(async(res,req)=>{
    //get login details from user
    const {email,username,password} = req.body
    //validation username or email 
    if(!email || !username){
        throw new ApiError(400,"Email or username is required")
    }
    //check if user exists
    const user = await User.findOne({
        $or:[{email},{username}]

    })

    if(!user){
        throw new ApiError(404,"User not found")
    }

    //compare password
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }
    
    //generate access and refresh token
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    //return response in form of cookies
    const loggedInUser = await user.findById(user._id).select(
        "-password -refreshToken"
    )

    const options ={
        httpOnly : true,
        secure:true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken,refreshToken

            }
        )
    )

})

export {registerUser,
        loginUser
} 


