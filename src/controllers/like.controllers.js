import mongoose , {isValidObjectId} from "mongoose"
import { Like } from "../models/like.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.models.js"
import { Comment } from "../models/comment.models.js"
import { Tweet } from "../models/tweet.models.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found")
    }
    const isLiked = await Like.findOne({video:videoId,user:req.user._id})
    const tooglelike = await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                like:!isLiked
            }
        },
        {new:true}
    
    )

    res
    .status(200)
    .json(new ApiResponse(200,{tooglelike},"Video like is toggled successfully"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment id")
    }

    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404,"Comment not found")
    }
    const isLiked = await Like.findOne({comment:commentId,user:req.user._id})
    const tooglelike = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                like:!isLiked
            }
        },
        {new:true}
    
    )

    res
    .status(200)
    .json(new ApiResponse(200,{tooglelike},"Comment like is toggled successfully"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet id")
    }

    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,"Tweet not found")
    }
    const isLiked = await Like.findOne({tweet:tweetId,user:req.user._id})
    const tooglelike = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set:{
                like:!isLiked
            }
        },
        {new:true}
    
    
    )

    res
    .status(200)
    .json(new ApiResponse(200,{tooglelike},"Tweet like is toggled successfully"))

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const {username} = req.params
    if([username].some((field)=>field.trim()==="")){
        throw new ApiError("Username is empty")
    }
    //idhar only likedvideos hi dikhana hai
    const likedvideos = await Like.find({user:username,video:{$exists:true}})
    res
    .status(200)
    .json(new ApiResponse(200,{likedvideos},"Liked videos are fetched successfully"))
})

const getLikedTweets = asyncHandler(async (req, res) => {
    //TODO: get all liked tweets
    const {username} = req.params
    if([username].some((field)=>field.trim()==="")){
        throw new ApiError("Username is empty")
    }
    //idhar only likedtweets hi dikhana hai 
    const likedtweets = await Like.find({user:username,tweet:{$exists:true}})
    res
    .status(200)
    .json(new ApiResponse(200,{likedtweets},"Liked tweets are fetched successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getLikedTweets
}