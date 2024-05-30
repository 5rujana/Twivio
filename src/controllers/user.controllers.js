import {asyncHandler} from "../utils/asyncHandler.js"
import{ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {UploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        console.log('Step 1: Looking for user with ID:', userId);
        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found with ID:', userId);
            throw new ApiError(404, "User not found");
        }

        console.log('Step 2: Generating access token for user:', userId);
        const accessToken = user.generateAccessToken();
        console.log('Access token generated:', accessToken);

        console.log('Step 3: Generating refresh token for user:', userId);
        const refreshToken = user.generateRefreshToken();
        console.log('Refresh token generated:', refreshToken);

        console.log('Step 4: Saving refresh token to user document');
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        console.log('User document saved');

        console.log('Tokens successfully generated and saved');
        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Error in generateAccessAndRefreshTokens function:', error.message);
        console.error('Stack trace:', error.stack);

        if (error instanceof ApiError) {
            throw error;
        } else {
            throw new ApiError(500, "An error occurred while generating refresh and access tokens");
        }
    }
};





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


const loginUser = asyncHandler(async(req,res)=>{
    //get login details from user
    const {email,username,password} = req.body
    console.log(email)
    //validation username or email 
    if(!email && !username){
        throw new ApiError(400,"Email and username is required")
    }
    //check if user exists
    const user = await User.findOne({
        $or:[{email},{username}]

    })

    if(!user){
        throw new ApiError(404,"User not found")
    }

    //compare password
    const isPasswordValid = await user.isPasswordMatch(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }
    
    //generate access and refresh token
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    //return response in form of cookies
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options ={
        httpOnly : true, //cookie cannot be accessed by js
        secure:true //cookie only sent over https
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken,refreshToken

            },
            "User logged in successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req,res)=>{
    //clear cookies
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly:true,
        secure:true,
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{}, "User logged out successfully") //{data} par idhar kuch bhi data return nehi kar raha hai
    )
    
})

export {registerUser,
        loginUser,
        logoutUser
} 


