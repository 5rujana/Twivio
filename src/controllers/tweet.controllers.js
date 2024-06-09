import mongoose,{isValidObjectId} from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    if(!content){
        throw new ApiError(400,"Content is required")
    }
    if(!isValidObjectId(req.user._id)){
        throw new ApiError(400,"Invalid user id")
    }
    
    const user = await User.findById(req.user._id)
    if(!user){
        throw new ApiError(404,"User not found")
    }

    const tweet = await Tweet.create({
        content,
        owner:req.user._id
    })

    res
    .status(200)
    .json(new ApiResponse(200,{tweet},"Tweet is created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweet
    const {username} = req.params
    if([username].some((field)=>field.trim()==="")){
        throw new ApiError("Username is empty")
    }
    const tweets = await Tweet.find({owner:username}) //idhar already hamara owner field hai Tweet model me
    res
    .status(200)
    .json(new ApiResponse(200,{tweets},"Tweets are fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    //he req.params property is an object containing properties mapped to the named route “parameters”.
    // For example, if you have the route /student/:id, then the “id” property is available as req.params.id.
    // This object defaults to {}. 
    if(!tweetId){
        throw new ApiError(400,"Tweet id is required")
    }

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet id")
    }

    const tweet = await Tweet.findByIdAndUpdate(tweetId,
        {
            $set:{
                content
            }
        },
        {
            new:true
        }
    )

    res
    .status(200)
    .json(ApiResponse(200,{},"Tweet updated successfully"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params
    if(!tweetId){
        throw new ApiError(400,"Tweet id is required")
    }
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet id")
    }

    const tweet =await Tweet.findByIdAndDelete(tweetId)
    res
    .status(200)
    .json(new ApiResponse(200,{},"Tweet deleted successfully"))

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}